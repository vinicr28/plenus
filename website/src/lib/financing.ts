export interface FinancingInput {
  propertyValue: number;
  downPayment: number;
  termYears: number;
  annualInterestRate: number;
}

export interface FinancingResult {
  financedAmount: number;
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
}

/**
 * Calculates financing using the PRICE (PMT) amortization formula.
 * PMT = PV × (i × (1+i)^n) / ((1+i)^n − 1)
 */
export function calculateFinancing(input: FinancingInput): FinancingResult {
  const { propertyValue, downPayment, termYears, annualInterestRate } = input;

  const financedAmount = propertyValue - downPayment;
  if (financedAmount <= 0) {
    return { financedAmount: 0, monthlyPayment: 0, totalPaid: 0, totalInterest: 0 };
  }

  const monthlyRate = annualInterestRate / 100 / 12;
  const totalMonths = termYears * 12;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = financedAmount / totalMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    monthlyPayment = financedAmount * (monthlyRate * factor) / (factor - 1);
  }

  const totalPaid = monthlyPayment * totalMonths;
  const totalInterest = totalPaid - financedAmount;

  return { financedAmount, monthlyPayment, totalPaid, totalInterest };
}

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}
