import { OP_ADD, OP_DIV, OP_MUL, OP_SUB } from '@calculator/common'
import { Calculator } from '../Calculator'

describe('Calculator.calculate()', () => {
    const subject = Calculator.calculate

    test('addition', () => {
        expect(
            subject({
                left: '1000000000000000000000000000.1',
                right: '1000000000000000000000000000.2',
                op: OP_ADD,
            }),
        ).toEqual('2000000000000000000000000000.3')
    })

    test('subtraction', () => {
        expect(
            subject({
                left: '1000000000000000000000000000.3',
                right: '1000000000000000000000000000.2',
                op: OP_SUB,
            }),
        ).toEqual('0.1')

        expect(
            subject({
                left: '1000000000000000000000000000.3',
                right: '0',
                op: OP_SUB,
            }),
        ).toEqual('1000000000000000000000000000.3')
    })

    test('multiplication', () => {
        expect(
            subject({
                left: '1000000000000000000000000000.3',
                right: '2',
                op: OP_MUL,
            }),
        ).toEqual('2000000000000000000000000000.6')
    })

    test('division', () => {
        expect(
            subject({
                left: '2000000000000000000000000000.6',
                right: '2',
                op: OP_DIV,
            }),
        ).toEqual('1000000000000000000000000000.3')
    })

    test('division by zero throws', () => {
        expect(() =>
            subject({
                left: '1',
                right: '0',
                op: OP_DIV,
            }),
        ).toThrow('Cannot divide by zero')
    })
})
