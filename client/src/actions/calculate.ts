import { CalculationResult, CalculationPayload } from '../interface/index';
import { calculateAmountFinancedEndpoint, calculateMonthlyPaymentAmountEndoint } from '../infrastructure/endpoints';
import { strings } from '../infrastructure/constants';

export async function fetchCalculation(months: number, amountFinanced: number, monthlyAmount: number, calculationContext: string): Promise<CalculationResult> {
    const data: CalculationPayload = {
      term: months,
      amountFinanced: amountFinanced,
      monthly: monthlyAmount,
    };

    const fetchUrl = calculationContext === strings.amountFinancedString ? calculateMonthlyPaymentAmountEndoint : calculateAmountFinancedEndpoint;

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json' 
      },
      body: JSON.stringify(data)
    });

      const result: Promise<CalculationResult> = response.json();

  return result;
}
