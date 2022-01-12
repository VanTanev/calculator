import * as D from 'io-ts/lib/Decoder'
import { pipe } from 'fp-ts/lib/function'
import { OP_ADD, OP_MUL, OP_DIV, OP_SUB } from '../Op'
import { CalculationRequest } from './CalculationRequest'

export interface CalculationResponse extends CalculationRequest {
    result: string
}

export const CalculationResponseDecoder = pipe(
    D.struct<CalculationResponse>({
        left: D.string,
        right: D.string,
        op: D.literal(OP_ADD, OP_SUB, OP_DIV, OP_MUL),
        result: D.string,
    }),
    D.withMessage(() => 'CalculationResponse'),
)
