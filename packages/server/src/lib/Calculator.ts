import { CalculationRequest } from '../dto/Calculation.dto'
import { CalculationResponse } from '../dto/CalculationResult.dto'
import BigNumber from 'bignumber.js'
import { ERROR_CODE_DIVIDE_BY_ZERO, OP_ADD, OP_DIV, OP_MUL, OP_SUB } from '@calculator/common'

export class Calculator {
    static calculate(c: CalculationRequest): CalculationResponse['result'] {
        switch (c.op) {
            case OP_ADD:
                return new BigNumber(c.left).plus(c.right).toFixed()
            case OP_SUB:
                return new BigNumber(c.left).minus(c.right).toFixed()
            case OP_MUL:
                return new BigNumber(c.left).multipliedBy(c.right).toFixed()
            case OP_DIV:
                if (new BigNumber(c.right).isZero()) {
                    throw new DivisionByZeroError()
                }
                return new BigNumber(c.left).dividedBy(c.right).toFixed()
        }
    }
}

export class DivisionByZeroError extends Error {
    constructor() {
        super('Cannot divide by zero.')
    }

    toJSON() {
        return {
            error: this.message,
            code: ERROR_CODE_DIVIDE_BY_ZERO,
        }
    }
}
