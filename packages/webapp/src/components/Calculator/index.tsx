import Display from './Display'
import Button from './Button'
import CalculatorProvider from './CalculatorProvider'
import { OP_ADD, OP_MUL, OP_DIV, OP_SUB } from '@calculator/common'

function Calculator(): JSX.Element {
    return (
        <CalculatorProvider>
            <div className="flex flex-col not-prose" style={{ width: 500 }}>
                <div className="mb-2">
                    <Display />
                </div>

                <div className="grid grid-cols-4 gap-y-2">
                    <Button event={{ type: 'CLEAR' }}>C</Button>
                    <Button event={{ type: 'REVERSE_SIGN' }}>-/+</Button>
                    <Button event={{ type: 'BACKSPACE' }}>&lt;=</Button>
                    <Button event={{ type: 'INPUT_OP', op: OP_DIV }}>/</Button>

                    <Button event={{ type: 'INPUT_NUMBER', value: 9 }}>9</Button>
                    <Button event={{ type: 'INPUT_NUMBER', value: 8 }}>8</Button>
                    <Button event={{ type: 'INPUT_NUMBER', value: 7 }}>7</Button>
                    <Button event={{ type: 'INPUT_OP', op: OP_MUL }}>X</Button>

                    <Button event={{ type: 'INPUT_NUMBER', value: 6 }}>6</Button>
                    <Button event={{ type: 'INPUT_NUMBER', value: 5 }}>5</Button>
                    <Button event={{ type: 'INPUT_NUMBER', value: 4 }}>4</Button>
                    <Button event={{ type: 'INPUT_OP', op: OP_SUB }}>-</Button>

                    <Button event={{ type: 'INPUT_NUMBER', value: 3 }}>3</Button>
                    <Button event={{ type: 'INPUT_NUMBER', value: 2 }}>2</Button>
                    <Button event={{ type: 'INPUT_NUMBER', value: 1 }}>1</Button>
                    <Button event={{ type: 'INPUT_OP', op: OP_ADD }}>+</Button>

                    <Button event={{ type: 'INPUT_NUMBER', value: 0 }} size={2}>
                        0
                    </Button>
                    <Button event={{ type: 'MODE_DECIMAL' }}>.</Button>
                    <Button event={{ type: 'EXECUTE' }}>=</Button>
                </div>
            </div>
        </CalculatorProvider>
    )
}

export default Calculator
