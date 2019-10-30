import { CalculationResult, CalculationPayload } from '../interface/index';
import { calculateAmountFinancedEndpoint, calculateMonthlyPaymentAmountEndoint } from '../infrastructure/endpoints';

export async function calculateMonthlyPaymentAmount(months: number, amountFinanced: number): Promise<CalculationResult> {
    const data: CalculationPayload = {
      term: months,
      amountFinanced: amountFinanced
    };

    const response = await fetch(calculateMonthlyPaymentAmountEndoint, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json' 
      },
      body: JSON.stringify(data)
    });

      const result:Promise<CalculationResult> = response.json();

  return result;
}

export async function calculateAmountFinanced(months: number, monthlyAmount: number): Promise<CalculationResult> {
      const data: CalculationPayload = {
        term: months,
        monthly: monthlyAmount
      };
  
      const response = await fetch(calculateAmountFinancedEndpoint, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data)
      });
  
      const result: Promise<CalculationResult> = response.json();

    return result;
}
