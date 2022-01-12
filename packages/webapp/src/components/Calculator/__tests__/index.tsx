import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Calculator from '../index'

describe('Calculator', () => {
    it('renders zero initially', () => {
        render(<Calculator />)
        expect(screen.getByTestId('display')).toHaveTextContent('0')
    })

    it('accepts user input', async () => {
        render(<Calculator />)

        userEvent.click(screen.getByRole('button', { name: /5/i }))
        userEvent.click(screen.getByRole('button', { name: /5/i }))

        expect(screen.getByTestId('display')).toHaveTextContent('55')

        userEvent.click(screen.getByRole('button', { name: /X/i }))
        userEvent.click(screen.getByRole('button', { name: /4/i }))
        userEvent.click(screen.getByRole('button', { name: /0/i }))

        expect(screen.getByTestId('display')).toHaveTextContent('40')
        expect(screen.getByTestId('computation')).toHaveTextContent('55 *')
    })

    it('delete resets to zero', async () => {
        render(<Calculator />)

        userEvent.click(screen.getByRole('button', { name: /5/i }))
        userEvent.click(screen.getByRole('button', { name: /\<=/i }))

        expect(screen.getByTestId('display')).toHaveTextContent('0')
    })
})
