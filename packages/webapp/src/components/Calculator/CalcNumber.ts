export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type Sign = -1 | 1

const DECIMAL_SEPARATOR = computeDecimalSeparator()

export class CalcNumber {
    constructor(public readonly v: string = '0', public readonly sign: Sign = +1) {
        if (v.slice(0, 1) === '-') {
            this.v = v.slice(1)
            this.sign = -1
        }
    }

    addDigit(digit: Digit): CalcNumber {
        return new CalcNumber(
            !this.isDecimal() && this.isZero() ? (digit === 0 ? '0' : '' + digit) : this.v + digit,
            this.sign,
        )
    }

    addDecimal(): CalcNumber {
        let v = this.v
        return new CalcNumber(v.indexOf('.') > -1 ? v : v + '.', this.sign)
    }

    isDecimal(): boolean {
        return this.v.indexOf('.') > -1
    }

    removeDigit(): CalcNumber {
        return new CalcNumber(this.v.slice(0, -1), this.sign)
    }

    flipSign(): CalcNumber {
        return new CalcNumber(this.v, -this.sign as Sign)
    }

    toString(): string {
        let str = this.v || '0'
        return this.sign === -1 && !this.isZero() ? '-' + str : str
    }

    toJSON(): string {
        return this.toString()
    }

    toDisplay(): string {
        const [left, right] = this.toString().split('.')
        let str = BigInt(left).toLocaleString()
        if (right || this.isDecimal()) {
            str += DECIMAL_SEPARATOR + (right ?? '')
        }

        return str
    }

    isZero(): boolean {
        return this.v === '' || 0 === +this.v
    }
}

function computeDecimalSeparator() {
    return Intl.NumberFormat()
        .formatToParts(1000.1)
        .find(part => part.type === 'decimal')!.value
}
