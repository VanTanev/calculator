import express from 'express'
import cors from 'cors'

import * as apiController from './controllers/api'

const app = express()
app.use(express.json())
app.use(cors())

app.post('/calculate', apiController.postCalculate)

export default app
