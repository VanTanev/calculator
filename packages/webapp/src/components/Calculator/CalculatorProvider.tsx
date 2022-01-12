import { useInterpret } from '@xstate/react'
import { createReactContextHelpers } from 'xstate-helpers/react/createReactContextHelpers'
import { calculatorMachine } from './calculator.machine'

export const {
    Provider: CalculatorProvider,
    useSelector: useCalculatorSelector,
    useSend: useCalculatorSend,
    useInterpreter: useCalculatorInterpreter,
} = createReactContextHelpers('Calculator', () => {
    return useInterpret(calculatorMachine, {
        devTools: true,
    })
})

export default CalculatorProvider
