import { OP_DIV } from '@calculator/common'
import request from 'supertest'
import app from '../app'

describe('app e2e tests', () => {
    test('supertest running as expected', () => {
        return request(app).get('/404').expect(404)
    })

    describe('/calcuate', () => {
        describe('POST /calculate', () => {
            it('fails for invalid data', () => {
                return request(app)
                    .post('/calculate')
                    .send({})
                    .expect(422)
                    .expect(res =>
                        expect(res.body).toMatchInlineSnapshot(`
                            {
                              "code": "decode-error",
                              "error": "Error decoding data:
                            CalculationRequest
                            ├─ required property \\"left\\"
                            │  └─ cannot decode undefined, should be string
                            ├─ required property \\"right\\"
                            │  └─ cannot decode undefined, should be string
                            └─ required property \\"op\\"
                               └─ cannot decode undefined, should be \\"ADDITION\\" | \\"SUBTRACTION\\" | \\"DIVISION\\" | \\"MULTIPLICATION\\"",
                            }
                        `),
                    )
            })

            it('fails for division by zero', () => {
                return request(app)
                    .post('/calculate')
                    .send({
                        left: '123.123',
                        right: '0.00000000000',
                        op: OP_DIV,
                    })
                    .expect(422)
                    .expect(res => {
                        expect(res.body).toMatchInlineSnapshot(`
                            {
                              "code": "divide-by-zero",
                              "error": "Cannot divide by zero.",
                            }
                        `)
                    })
            })
        })
    })
})
