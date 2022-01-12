import { ResponseData } from './ResponseData'

export class NetworkError extends Error {
    status: number

    constructor(readonly response: Response, readonly data: ResponseData) {
        super(`NetworkError ${response.status}`)
        this.status = response.status
    }
}
