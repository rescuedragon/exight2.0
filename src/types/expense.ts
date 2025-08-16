export type ExpenseType = 'EMI' | 'Personal Loan' | 'Borrowed';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  name: string;
  amount: number;
  currency: Currency;
  type: ExpenseType;
  deductionDay: number;
  isRecurring: boolean;
  totalMonths: number;
  remainingMonths: number;
  remainingAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PartialPayment {
  id: string;
  expenseId: string;
  amount: number;
  paymentDate: string;
  description: string;
  createdAt: string;
}

export interface ActionLog {
  id: string;
  action: string;
  details: string;
  type: 'add' | 'update' | 'payment' | 'delete';
  timestamp: string;
}