export async function calculateMonthlyPaymentAmount(months, amountFinanced) {
    const data = {
      term: months,
      amountFinanced: amountFinanced
    }

    const response = await fetch('http://localhost:9000/calculateMonthlyPaymentAmount', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json' 
      },
      body: JSON.stringify(data)
    });

      const result = response.json();

  return result;
}

export async function calculateAmountFinanced(months, monthlyAmount) {
      const data = {
        term: months,
        monthly: monthlyAmount
      }
  
      const response = await fetch('http://localhost:9000/calculateAmountFinanced', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data)
      });
  
      const result = response.json();

    return result;
}
