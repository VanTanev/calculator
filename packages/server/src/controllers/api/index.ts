import { DecoderError } from '@calculator/common'
import { Request, Response } from 'express'
import * as E from 'fp-ts/lib/Either'
import { identity, pipe } from 'fp-ts/lib/function'
import { CalculationRequestDecoder } from '../../dto/Calculation.dto'
import { CalculationResponse } from '../../dto/CalculationResult.dto'
import { Calculator } from '../../lib/Calculator'

export const postCalculate = (req: Request, res: Response) => {
    return pipe(
        CalculationRequestDecoder.decode(req.body),
        E.mapLeft(error => new DecoderError(error)),
        E.chain(calculation =>
            E.tryCatch(
                () =>
                    identity<CalculationResponse>({
                        ...calculation,
                        result: Calculator.calculate(calculation),
                    }),
                E.toError,
            ),
        ),
        E.fold(
            error => {
                return res.status(422).json(error)
            },
            response => {
                return res.json(response)
            },
        ),
    )
}
