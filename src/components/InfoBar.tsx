import { useState } from "react";
import { TrendingUp, Calendar, Wallet, IndianRupee } from "lucide-react";
import { Expense } from "@/types/expense";
import { MonthlyExpensesModal } from "@/components/MonthlyExpensesModal";
import { YearlyProjectionModal } from "@/components/YearlyProjectionModal";
import { ActiveExpensesModal } from "@/components/ActiveExpensesModal";

interface InfoBarProps {
  expenses: Expense[];
  onUpdateExpense: (expense: Expense) => void;
}

export const InfoBar = ({ expenses, onUpdateExpense }: InfoBarProps) => {
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
            <div className="p-4 bg-gradient-to-br from-blue-accent/20 to-blue-accent/10 rounded-2xl shadow-lg">
              <Calendar className="h-7 w-7 text-blue-accent" />
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
            <div className="p-4 bg-gradient-to-br from-emerald-accent/20 to-emerald-accent/10 rounded-2xl shadow-lg">
              <TrendingUp className="h-7 w-7 text-emerald-accent" />
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
            <div className="p-4 bg-gradient-to-br from-purple-accent/20 to-purple-accent/10 rounded-2xl shadow-lg">
              <Wallet className="h-7 w-7 text-purple-accent" />
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
        />
      )}
    </>
  );
};