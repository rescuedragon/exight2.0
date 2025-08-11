export type ExpenseType = 'EMI' | 'Personal Loan' | 'Borrowed from Someone';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface Expense {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  type: ExpenseType;
  deductionDay: number;
  isRecurring: boolean;
  totalMonths?: number; // Optional for recurring expenses
  remainingMonths?: number; // Optional for recurring expenses
  remainingAmount?: number; // Optional for recurring expenses
  createdAt: Date;
  partialPayments: PartialPayment[];
}

export interface PartialPayment {
  id: string;
  amount: number;
  date: Date;
  description?: string;
}
