export interface Loan {
  id: string;
  personName: string;
  amount: number;
  currency: string;
  dateGiven: Date;
  description?: string;
  status: 'active' | 'completed' | 'written-off';
  totalReceived: number;
  remainingAmount: number;
  createdAt: Date;
  payments: LoanPayment[];
}

export interface LoanPayment {
  id: string;
  amount: number;
  date: Date;
  description?: string;
  type: 'payment' | 'write-off';
}

export interface LoanSummary {
  totalLoaned: number;
  totalReceived: number;
  totalPending: number;
  totalWrittenOff: number;
  activeLoans: number;
}