import { CalculationRequest } from './Calculation.dto'

export interface CalculationResponse extends CalculationResult {
    result: string
}
