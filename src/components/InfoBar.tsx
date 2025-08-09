import { memo, useMemo, useState } from "react";
import { IndianRupee } from "lucide-react";
import { Expense } from "@/types/expense";
import { MonthlyExpensesModal } from "@/components/MonthlyExpensesModal";
import { YearlyProjectionModal } from "@/components/YearlyProjectionModal";
import { ActiveExpensesModal } from "@/components/ActiveExpensesModal";

interface InfoBarProps {
  expenses: Expense[];
  onUpdateExpense: (expense: Expense) => void;
  onDeleteExpense?: (expenseId: string) => void;
  isPrivacyMode?: boolean;
}

const InfoBarComponent = ({ expenses, onUpdateExpense, onDeleteExpense, isPrivacyMode = false }: InfoBarProps) => {
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const [showYearlyModal, setShowYearlyModal] = useState(false);
  const [showActiveModal, setShowActiveModal] = useState(false);

  // Filter to show only active expenses
  const activeExpenses = useMemo(() => (
    expenses.filter(expense => {
      if (expense.isRecurring) return true;
      const hasRemainingMonths = !!(expense.remainingMonths && expense.remainingMonths > 0);
      const hasRemainingAmount = !!(expense.remainingAmount && expense.remainingAmount > 0);
      const hasTotalMonths = !!(expense.totalMonths && expense.totalMonths > 0);
      const isNewExpense = hasTotalMonths && (!expense.remainingMonths || expense.remainingMonths > 0);
      return hasRemainingMonths || hasRemainingAmount || isNewExpense;
    })
  ), [expenses]);

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
    if (isPrivacyMode) {
      return '••••••';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'symbol'
    }).format(amount).replace(/^₹/, '₹');
  };

  const formatCount = (count: number) => {
    return isPrivacyMode ? '••' : count.toString();
  };

  return (
    <>
      <div className="w-full backdrop-blur-xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 dark:from-gray-900/20 dark:via-gray-800/10 dark:to-gray-900/20 rounded-3xl p-6 animate-fade-in-up stagger-1 shadow-2xl border border-white/20 infobar-container">
        
        <div className="grid grid-cols-3 gap-6 justify-start ml-20">
          <div
            className="flex items-center justify-start space-x-5 animate-fade-in-up stagger-2 cursor-pointer backdrop-blur-md rounded-2xl p-4 -m-4 transition-all duration-200 w-full group"
            onClick={() => setShowMonthlyModal(true)}
          >
            <div className="p-4 rounded-3xl shadow-xl backdrop-blur-sm transition-all duration-300 group-hover:scale-110 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#5c5aeb' }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 text-white drop-shadow-lg"
              >
                <path d="M3 3V21H21" />
                <path d="M9 9L12 6L16 10L21 5" />
              </svg>
            </div>
            <div className="space-y-1 min-w-0 flex-1 w-full">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide w-full">Monthly Expenses</p>
              <div className="flex items-center gap-2 w-full">
                <IndianRupee className="h-5 w-5 text-gray-800 dark:text-gray-200 flex-shrink-0" />
                <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent tracking-tight flex-1">{formatCurrency(totalMonthly).replace('₹', '')}</p>
              </div>
            </div>
          </div>

          <div
            className="flex items-center justify-start space-x-5 animate-fade-in-up stagger-3 cursor-pointer backdrop-blur-md rounded-2xl p-4 -m-4 transition-all duration-200 w-full group"
            onClick={() => setShowYearlyModal(true)}
          >
            <div className="p-4 rounded-3xl shadow-xl backdrop-blur-sm transition-all duration-300 group-hover:scale-110 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#10b981' }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 text-white drop-shadow-lg"
              >
                <path d="M22 12H18L15 21L9 3L6 12H2" />
              </svg>
            </div>
            <div className="space-y-1 min-w-0 flex-1 w-full">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide w-full">Yearly Projection</p>
              <div className="flex items-center gap-2 w-full">
                <IndianRupee className="h-5 w-5 text-gray-800 dark:text-gray-200 flex-shrink-0" />
                <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent tracking-tight flex-1">{formatCurrency(totalYearly).replace('₹', '')}</p>
              </div>
            </div>
          </div>

          <div
            className="flex items-center justify-start space-x-5 animate-fade-in-up stagger-4 cursor-pointer backdrop-blur-md rounded-2xl p-4 -m-4 transition-all duration-200 w-full group"
            onClick={() => setShowActiveModal(true)}
          >
            <div className="p-4 rounded-3xl shadow-xl backdrop-blur-sm transition-all duration-300 group-hover:scale-110 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#8b5cf6' }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 text-white drop-shadow-lg"
              >
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <div className="space-y-1 min-w-0 flex-1 w-full">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide w-full">Active Expenses</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent tracking-tight w-full">{formatCount(activeExpenses.length)}</p>
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

export const InfoBar = memo(InfoBarComponent);