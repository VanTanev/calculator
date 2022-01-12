export type ResponseData =
    | undefined
    | string
    | number
    | Array<ResponseData>
    | { [K: string]: ResponseData }
