import { CalculationRequest, CalculationResponseDecoder, Op } from '@calculator/common'
import { fetchAndDecode } from 'api/fetch'
import { NetworkError } from 'api/NetworkError'
import * as E from 'fp-ts/lib/Either'
import { identity, pipe } from 'fp-ts/lib/function'
import { assign, createMachine } from 'xstate'
import { invariantEvent } from 'xstate-helpers/events'
import { CalcNumber, Digit } from './CalcNumber'

export type CalculatorContext = {
    input: CalcNumber
    left: CalcNumber | null
    right: CalcNumber | null
    op: Op | null
    result: CalcNumber | null
    pendingOp: Op | null
    error: null | string
}

const initialContext = identity<CalculatorContext>({
    left: null,
    op: null,
    right: null,
    result: null,
    input: new CalcNumber(),
    pendingOp: null,
    error: null,
})

export type CalculatorEvent =
    | {
          type: 'CLEAR'
      }
    | {
          type: 'MODE_DECIMAL'
      }
    | {
          type: 'REVERSE_SIGN'
      }
    | {
          type: 'INPUT_OP'
          op: Op
      }
    | {
          type: 'INPUT_NUMBER'
          value: Digit
      }
    | {
          type: 'BACKSPACE'
      }
    | {
          type: 'EXECUTE'
      }

export const calculatorMachine = createMachine<CalculatorContext, CalculatorEvent>(
    {
        id: 'calculator',
        context: initialContext,
        on: {
            CLEAR: {
                target: 'oneSided',
                actions: 'reset',
            },
        },
        initial: 'oneSided',
        states: {
            oneSided: {
                on: {
                    INPUT_NUMBER: { actions: 'addDigit' },
                    MODE_DECIMAL: { actions: 'addDecimal' },
                    REVERSE_SIGN: { cond: 'inputIsNotZero', actions: 'reverseSign' },
                    INPUT_OP: {
                        target: 'fullCalculation',
                        actions: ['copyInputToLeft', 'setOp'],
                    },
                    BACKSPACE: { actions: 'removeDigit' },
                },
            },
            fullCalculation: {
                on: {
                    INPUT_NUMBER: { actions: 'addDigit' },
                    MODE_DECIMAL: { actions: 'addDecimal' },
                    REVERSE_SIGN: { actions: 'reverseSign' },
                    BACKSPACE: [
                        {
                            cond: 'inputIsZero',
                            target: 'oneSided',
                            actions: ['removeOp'],
                        },
                        { actions: 'removeDigit' },
                    ],
                    INPUT_OP: {
                        actions: ['setOp'],
                    },
                    EXECUTE: { target: 'executeBackendCalculation', actions: ['copyInputToRight'] },
                },
                initial: 'noNumberInput',
                states: {
                    noNumberInput: {
                        on: {
                            INPUT_NUMBER: {
                                target: 'withNumberInput',
                                actions: ['clearInput', 'addDigit'],
                            },
                            MODE_DECIMAL: {
                                target: 'withNumberInput',
                                actions: ['clearInput', 'addDecimal'],
                            },
                        },
                    },
                    withNumberInput: {
                        on: {
                            INPUT_OP: {
                                actions: ['copyInputToRight', 'setPendingOp'],
                                target: '#executeBackendCalculation',
                            },
                        },
                    },
                },
            },
            executeBackendCalculation: {
                id: 'executeBackendCalculation',
                invoke: {
                    src: ctx =>
                        calculate({
                            left: ctx.left!.toString(),
                            right: ctx.right!.toString(),
                            op: ctx.op!,
                        }),
                    onDone: [
                        {
                            cond: 'hasPendingOp',
                            actions: assign((ctx, e) => ({
                                left: new CalcNumber(e.data.result),
                                right: null,
                                op: ctx.pendingOp,
                                pendingOp: null,
                                input: new CalcNumber(e.data.result),
                            })),
                            target: 'fullCalculation',
                        },
                        {
                            target: 'result',
                            actions: assign((_, e) => ({
                                result: new CalcNumber(e.data.result),
                                input: new CalcNumber(e.data.result),
                            })),
                        },
                    ],
                    onError: {
                        target: 'error',
                        actions: assign((_, { data: error }) => ({
                            error:
                                (error instanceof NetworkError &&
                                    error.status === 422 &&
                                    (error.data as any)?.error) ||
                                String(error),
                        })),
                    },
                },
            },
            result: {
                on: {
                    EXECUTE: { target: 'executeBackendCalculation', actions: ['copyInputToLeft'] },
                    INPUT_NUMBER: { target: 'oneSided', actions: ['reset', 'addDigit'] },
                    MODE_DECIMAL: { target: 'oneSided', actions: ['reset', 'addDecimal'] },
                    REVERSE_SIGN: { target: 'oneSided', actions: ['reset', 'reverseSign'] },
                    INPUT_OP: {
                        target: 'fullCalculation',
                        actions: ['clearRight', 'copyInputToLeft', 'setOp'],
                    },
                    BACKSPACE: {
                        target: 'oneSided',
                        actions: ['resetWithoutInput', 'removeDigit'],
                    },
                },
            },
            error: {
                on: {
                    INPUT_NUMBER: { target: 'fullCalculation', actions: ['addDigit'] },
                    MODE_DECIMAL: { target: 'fullCalculation', actions: ['addDecimal'] },
                    BACKSPACE: { target: 'fullCalculation', actions: ['removeDigit'] },
                },
            },
        },
    },
    {
        guards: {
            inputIsZero: ctx => ctx.input.isZero(),
            inputIsNotZero: ctx => !ctx.input.isZero(),
            hasPendingOp: ctx => !!ctx.pendingOp,
        },
        actions: {
            setOp: assign((_, e) => {
                invariantEvent(e, 'INPUT_OP')
                return {
                    op: e.op,
                }
            }),
            setPendingOp: assign((_, e) => {
                invariantEvent(e, 'INPUT_OP')
                return {
                    pendingOp: e.op,
                }
            }),
            reset: assign(_ => initialContext),
            resetWithoutInput: assign(ctx => ({ ...initialContext, input: ctx.input })),
            addDigit: assign((ctx, e) => {
                invariantEvent(e, 'INPUT_NUMBER')
                return {
                    input: ctx.input.addDigit(e.value),
                }
            }),
            clearInput: assign(_ => ({
                input: new CalcNumber(),
            })),
            copyInputToLeft: assign(ctx => {
                return {
                    left: ctx.input,
                }
            }),
            moveLeftToInput: assign(ctx => {
                console.log(ctx, ctx.left)
                return {
                    left: null,
                    input: ctx.left!,
                }
            }),
            copyInputToRight: assign(ctx => ({
                right: ctx.input,
            })),
            addDecimal: assign(ctx => {
                return {
                    input: ctx.input.addDecimal(),
                }
            }),
            clearRight: assign(_ => ({
                right: null,
            })),
            reverseSign: assign(ctx => ({
                input: ctx.input.flipSign(),
            })),
            removeDigit: assign(ctx => ({
                input: ctx.input.removeDigit(),
            })),
            removeOp: assign(ctx => ({
                ...initialContext,
                input: ctx.left!,
            })),
        },
    },
)

async function calculate(req: CalculationRequest) {
    return pipe(
        await fetchAndDecode(CalculationResponseDecoder, 'http://localhost:8080/calculate', {
            method: 'POST',
            data: req,
        }),
        E.fold(e => {
            throw e
        }, identity),
    )
}
