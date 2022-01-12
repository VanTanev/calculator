import React from 'react'
import cn from 'classnames'
import { CalculatorEvent } from '../calculator.machine'
import { useCalculatorInterpreter } from '../CalculatorProvider'
import { useStateCan } from 'xstate-helpers/react/useStateCan'

type ButtonProps = {
    event: CalculatorEvent
    highlighted?: boolean
    size?: 1 | 2
    children: React.ReactNode
}

function Button(props: ButtonProps): JSX.Element {
    const service = useCalculatorInterpreter()
    const disabled = !useStateCan(service, props.event)

    return (
        <button
            type="button"
            disabled={disabled}
            className={cn('flex-none text-center align-middle py-4 border-2 text-2xl', {
                'col-span-2': props.size === 2,
                'text-gray-300': disabled,
            })}
            onClick={() => service.send(props.event)}
        >
            {props.children}
        </button>
    )
}

export default Button
