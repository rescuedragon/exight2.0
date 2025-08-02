import { useState } from "react";
import { IndianRupee } from "lucide-react";
import { Expense } from "@/types/expense";
import { MonthlyExpensesModal } from "@/components/MonthlyExpensesModal";
import { YearlyProjectionModal } from "@/components/YearlyProjectionModal";
import { ActiveExpensesModal } from "@/components/ActiveExpensesModal";

interface InfoBarProps {
  expenses: Expense[];
  onUpdateExpense: (expense: Expense) => void;
  onDeleteExpense?: (expenseId: string) => void;
}

export const InfoBar = ({ expenses, onUpdateExpense, onDeleteExpense }: InfoBarProps) => {
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const [showYearlyModal, setShowYearlyModal] = useState(false);
  const [showActiveModal, setShowActiveModal] = useState(false);

  // Filter to show only active expenses
  const activeExpenses = expenses.filter(expense =>
    expense.isRecurring || (expense.remainingMonths > 0 && (expense.remainingAmount === undefined || expense.remainingAmount > 0))
  );

  const totalMonthly = activeExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate accurate yearly projection considering fixed-term expenses
  const totalYearly = activeExpenses.reduce((sum, expense) => {
    if (expense.isRecurring) {
      // Recurring expenses continue for the full year
      return sum + (expense.amount * 12);
    } else {
      // Fixed-term expenses only continue for remaining months (max 12)
      const monthsInYear = Math.min(expense.remainingMonths || 0, 12);
      return sum + (expense.amount * monthsInYear);
    }
  }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'symbol'
    }).format(amount).replace(/^₹/, '₹');
  };

  return (
    <>
      <div className="w-full premium-card p-8 mb-8 animate-fade-in-up stagger-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            className="flex items-center space-x-5 animate-fade-in-up stagger-2 cursor-pointer hover:bg-muted/10 rounded-2xl p-4 -m-4 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            onClick={() => setShowMonthlyModal(true)}
          >
            <div className="p-4 rounded-2xl shadow-lg" style={{ backgroundColor: '#5c5aeb' }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 text-white"
              >
                <path d="M3 3V21H21" />
                <path d="M9 9L12 6L16 10L21 5" />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Monthly Expenses</p>
              <div className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-foreground" />
                <p className="text-3xl font-bold text-foreground tracking-tight">{formatCurrency(totalMonthly).replace('₹', '')}</p>
              </div>
            </div>
          </div>

          <div
            className="flex items-center space-x-5 animate-fade-in-up stagger-3 cursor-pointer hover:bg-muted/10 rounded-2xl p-4 -m-4 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            onClick={() => setShowYearlyModal(true)}
          >
            <div className="p-4 bg-green-500 rounded-2xl shadow-lg">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 text-white"
              >
                <path d="M22 12H18L15 21L9 3L6 12H2" />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Yearly Projection</p>
              <div className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-foreground" />
                <p className="text-3xl font-bold text-foreground tracking-tight">{formatCurrency(totalYearly).replace('₹', '')}</p>
              </div>
            </div>
          </div>

          <div
            className="flex items-center space-x-5 animate-fade-in-up stagger-4 cursor-pointer hover:bg-muted/10 rounded-2xl p-4 -m-4 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            onClick={() => setShowActiveModal(true)}
          >
            <div className="p-4 bg-purple-500 rounded-2xl shadow-lg">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 text-white"
              >
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Active Expenses</p>
              <p className="text-3xl font-bold text-foreground tracking-tight">{activeExpenses.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showMonthlyModal && (
        <MonthlyExpensesModal
          expenses={expenses}
          onClose={() => setShowMonthlyModal(false)}
        />
      )}

      {showYearlyModal && (
        <YearlyProjectionModal
          expenses={expenses}
          onClose={() => setShowYearlyModal(false)}
        />
      )}

      {showActiveModal && (
        <ActiveExpensesModal
          expenses={expenses}
          onClose={() => setShowActiveModal(false)}
          onUpdateExpense={onUpdateExpense}
          onDeleteExpense={onDeleteExpense}
        />
      )}
    </>
  );
};