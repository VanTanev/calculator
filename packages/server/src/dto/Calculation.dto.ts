import * as D from 'io-ts/lib/Decoder'
import { pipe } from 'fp-ts/lib/function'
import { Op, OP_ADD, OP_MUL, OP_DIV, OP_SUB } from '@calculator/common'

export interface CalculationRequest {
    left: string
    right: string
    op: Op
}

export const CalculationRequestDecoder = pipe(
    D.struct<CalculationRequest>({
        left: D.string,
        right: D.string,
        op: D.literal(OP_ADD, OP_SUB, OP_DIV, OP_MUL),
    }),
    D.withMessage(() => 'CalculationRequest'),
)
