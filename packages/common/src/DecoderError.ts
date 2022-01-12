import * as D from 'io-ts/lib/Decoder'
import { ERROR_CODE_DECODE_ERROR } from './ErrorCodes'

export class DecoderError extends Error {
    constructor(errors: D.DecodeError) {
        super(`Error decoding data:\n${D.draw(errors)}`)
    }

    toJSON() {
        return {
            error: this.message,
            code: ERROR_CODE_DECODE_ERROR,
        }
    }
}
