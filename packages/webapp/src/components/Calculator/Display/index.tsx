import { Op, OP_ADD, OP_MUL, OP_DIV, OP_SUB } from '@calculator/common'
import cn from 'classnames'
import { useCalculatorSelector } from '../CalculatorProvider'

function Display(): JSX.Element {
    const input = useCalculatorSelector(state => state.context.input)
    const hasError = useCalculatorSelector(state => state.matches('error'))
    const error = useCalculatorSelector(state => state.context.error)
    const computationString = useCalculatorSelector(state => {
        const left = state.context.left?.toDisplay() || ''
        const right = state.context.right?.toDisplay() || ''
        const op = renderOp(state.context.op)

        switch (true) {
            case state.matches('left'):
                return ''

            case state.matches('leftAndOperation'):
                return `${left} ${op}`

            case state.matches('fullCalculation'):
            case state.matches('executeBackendCalculation'):
            case state.matches('error'):
                return `${left} ${op} ${right}`
            case state.matches('result'):
                return `${left} ${op} ${right} =`
        }
    })

    return (
        <div className="border-2 px-3 py-3 flex-1 flex-col overflow-hidden">
            <div className="float-right overflow-hidden" data-testid="computation">
                &nbsp;{computationString}
            </div>
            <div className="clear-both" />
            <div
                data-testid="display"
                className={cn('text-4xl float-right overflow-hidden', { 'text-red-500': hasError })}
            >
                {hasError ? error : input?.toDisplay()}
            </div>
        </div>
    )
}

function renderOp(op: Op | null): string {
    if (!op) {
        return ''
    }

    switch (op) {
        case OP_MUL:
            return '*'
        case OP_DIV:
            return '/'
        case OP_SUB:
            return '-'
        case OP_ADD:
            return '+'
    }
}

export default Display
