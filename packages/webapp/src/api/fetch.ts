import { pipe } from 'fp-ts/function'

import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import * as D from 'io-ts/lib/Decoder'
import { DecoderError } from '@calculator/common'
import { NetworkError } from './NetworkError'
import { ResponseData } from './ResponseData'

type SimpleInit = {
    method?: RequestInit['method']
    data?: any
}

export function fetch<T extends ResponseData>(
    input: string | Request,
    init?: SimpleInit,
): Promise<E.Either<Error | NetworkError, T>> {
    return TE.tryCatch(async () => {
        const fetchInit = {
            headers: {
                'Content-Type': 'application/json',
            },
            method: init?.method,
            body: (init?.data && JSON.stringify(init.data)) || undefined,
        }
        const response = await window.fetch(input, fetchInit)

        if (response.status >= 400) {
            // turn errors into NetworkError
            let data: ResponseData = await response.text()
            const contentType = response.headers.get('content-type')
            if (/application\/json/.test(contentType!)) {
                try {
                    data = JSON.parse(data)
                } catch (e) {}
            }

            throw new NetworkError(response, data)
        }

        return (await response.json()) as T
    }, E.toError)()
}

export async function fetchAndDecode<Decoder extends D.Decoder<any, any>>(
    decoder: Decoder,
    input: string | Request,
    init?: SimpleInit,
): Promise<E.Either<Error | NetworkError | DecoderError, D.TypeOf<Decoder>>> {
    return pipe(
        await fetch(input, init),
        E.chainW(data => {
            return pipe(
                decoder.decode(data),
                E.mapLeft(error => new DecoderError(error)),
            )
        }),
    )
}
