export interface CalculationState {
    amountFinanced: any;
    numberOfMonthlyPayments: any;
    monthlyPaymentAmount: any;
    monthlyString: string;
    termString: string;
    amountFinancedString: string;
    termLabel: string;
    monthlyAmountLabel: string;
    amountFinancedLabel: string;
    termValueHasErrors: boolean;
    amountFinancedHasErrors: boolean;
    validCalculation: boolean;
    isModalOpen: boolean;
    error: boolean;
    errorMessage: string;
    applicationLocked: boolean;
    snackBar: {
      open: boolean;
      vertical?: string;
      horizontal?: string;
    },
    boundaries: {
      monthlyPayments: Boundary,
      amountFinanced: Boundary
    }
}

export interface CalculationResult {
    result: number,
    error: boolean,
    errorMessage: string,
    validCalculation: boolean
}

export interface Boundary {
    bottom: number;
    top: number;
}

export interface CalculationPayload {
    term?: number;
    amountFinanced?: number;
    monthly?: number;
}

export interface CalculationProps {};