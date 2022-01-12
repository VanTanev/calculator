import { CalcNumber } from '../CalcNumber'

describe('CalcNumber', () => {
    const subject = CalcNumber

    describe('constructor', () => {
        test('normal', () => {
            const n = new subject('10')
            expect(n.v).toBe('10')
            expect(n.sign).toBe(+1)
        })

        test('negative', () => {
            const n = new subject('-10')
            expect(n.v).toBe('10')
            expect(n.sign).toBe(-1)
        })
    })

    describe('add/remove methods', () => {
        test('initial is zero', () => {
            const n = new subject()
            expect(n.toString()).toEqual('0')
        })

        test('zero integrals are ignored when the number is zero', () => {
            const n = new subject().addDigit(0).addDigit(0).addDigit(0)
            expect(n.toString()).toEqual('0')
        })

        test('removing integrals from zero is still zero', () => {
            const n = new subject().removeDigit().removeDigit()
            expect(n.toString()).toEqual('0')
        })

        test('fliping sign on zero is still zero', () => {
            const n = new subject().flipSign()
            expect(n.toString()).toEqual('0')
            expect(n.sign).toEqual(-1)
        })

        test('integer', () => {
            const n = new subject().addDigit(1).addDigit(0).addDigit(0).removeDigit()
            expect(n.toString()).toEqual('10')
        })

        test('empty decimal', () => {
            const n = new subject().addDecimal()
            expect(n.toString()).toEqual('0.')
        })

        test('decimal', () => {
            const n = new subject()
                .addDigit(1)
                .addDigit(1)
                .removeDigit()
                .addDecimal()
                .addDecimal()
                .addDigit(1)
                .addDigit(0)
                .addDigit(0)
                .addDecimal()
                .removeDigit()
            expect(n.toString()).toEqual('1.10')
        })
    })

    describe('isZero()', () => {
        test('empty', () => {
            const n = new subject()
            expect(n.isZero()).toBe(true)
            expect(n.toString()).toBe('0')
        })

        test('negative', () => {
            const n = new subject().flipSign()
            expect(n.isZero()).toBe(true)
            expect(n.toString()).toBe('0')
        })

        test('zero fractions', () => {
            const n = new subject().addDigit(0).addDecimal().addDigit(0).addDigit(0)
            expect(n.isZero()).toBe(true)
            expect(n.toString()).toBe('0.00')
        })

        test('non-zero decimal', () => {
            const n = new subject().addDecimal().addDigit(0).addDigit(1)
            expect(n.isZero()).toBe(false)
            expect(n.toString()).toBe('0.01')
        })

        test('non-zero integer', () => {
            const n = new subject().addDigit(1)
            expect(n.isZero()).toBe(false)
            expect(n.toString()).toBe('1')
        })
    })

    describe('toString()', () => {
        test.each([
            // no params yields zero
            [[], '0'],

            // // zero does not have negative sign
            [['0', +1], '0'],
            [['0', -1], '0'],
            [['0.000', +1], '0.000'],
            [['0.000', -1], '0.000'],

            // integer
            [['123', +1], '123'],
            [['123', -1], '-123'],

            // decimals
            [['1.23400', +1], '1.23400'],
            [['1.23400', -1], '-1.23400'],

            // big numbers are formatted
            [
                ['1000000000000000000000000.23400000000000', -1],
                '-1000000000000000000000000.23400000000000',
                '-1,000,000,000,000,000,000,000,000.23400000000000',
            ],
        ])(
            'new CalcNumber(...%j) => [%j, %j]',
            (constructorArgs, expected1, expected2 = expected1) => {
                const n = new subject(...(constructorArgs as any))
                expect([n.toString(), n.toDisplay()]).toEqual([expected1, expected2])
            },
        )
    })
})
