import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Calendar, TrendingUp, IndianRupee } from 'lucide-react';
import { Expense } from '@/types/expense';
import { ConnectedLineChart } from '@/components/ConnectedLineChart';
import { useModal } from '@/contexts/ModalContext';

interface MonthlyExpensesModalProps {
  expenses: Expense[];
  onClose: () => void;
}

export const MonthlyExpensesModal = ({ expenses, onClose }: MonthlyExpensesModalProps) => {
  const { openModal, closeModal } = useModal();
  const [selectedYear] = useState(new Date().getFullYear());
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  // Use actual current month, but can be overridden for testing
  const currentMonth = currentDate.getMonth();

  // For testing: if we want to simulate April 2025, uncomment the next line
  // const currentMonth = 3; // April

  // Register modal when component mounts
  useEffect(() => {
    openModal();
    return () => {
      closeModal();
    };
  }, [openModal, closeModal]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'symbol',
    })
      .format(amount)
      .replace(/^₹/, '₹');
  };

  const getMonthlyExpense = (monthIndex: number) => {
    const monthTotal = expenses.reduce((total, expense) => {
      // Recurring expenses (like rent) are active every month
      if (expense.isRecurring) {
        return total + expense.amount;
      }

      // For EMIs/Loans, check if they are active in the target month
      if (expense.remainingMonths && expense.remainingMonths > 0 && expense.totalMonths) {
        // Calculate when the EMI started
        const completedMonths = expense.totalMonths - expense.remainingMonths;
        const startMonthIndex = currentMonth - completedMonths;
        const startYear = currentYear + Math.floor(startMonthIndex / 12);
        const normalizedStartMonth = ((startMonthIndex % 12) + 12) % 12;

        // Calculate when the EMI will end
        const endMonthIndex = currentMonth + expense.remainingMonths;
        const endYear = currentYear + Math.floor(endMonthIndex / 12);
        const normalizedEndMonth = endMonthIndex % 12;

        // Check if the target month falls within the EMI period
        const targetYear = selectedYear;
        const targetMonth = monthIndex;

        // Convert dates to comparable format (year * 12 + month)
        const startPeriod = startYear * 12 + normalizedStartMonth;
        const endPeriod = endYear * 12 + normalizedEndMonth;
        const targetPeriod = targetYear * 12 + targetMonth;

        // Include the expense if target month is within the EMI period
        if (targetPeriod >= startPeriod && targetPeriod < endPeriod) {
          return total + expense.amount;
        }
      }

      return total;
    }, 0);

    return monthTotal;
  };

  const getMonthlyExpenseDetails = (monthIndex: number) => {
    const monthExpenses: Array<{ name: string; amount: number; type: string }> = [];

    expenses.forEach((expense) => {
      // Recurring expenses are active every month
      if (expense.isRecurring) {
        monthExpenses.push({
          name: expense.name,
          amount: expense.amount,
          type: expense.type,
        });
        return;
      }

      // For EMIs/Loans, check if they are active in the target month
      if (expense.remainingMonths && expense.remainingMonths > 0 && expense.totalMonths) {
        // Calculate when the EMI started
        const completedMonths = expense.totalMonths - expense.remainingMonths;
        const startMonthIndex = currentMonth - completedMonths;
        const startYear = currentYear + Math.floor(startMonthIndex / 12);
        const normalizedStartMonth = ((startMonthIndex % 12) + 12) % 12;

        // Calculate when the EMI will end
        const endMonthIndex = currentMonth + expense.remainingMonths;
        const endYear = currentYear + Math.floor(endMonthIndex / 12);
        const normalizedEndMonth = endMonthIndex % 12;

        // Check if the target month falls within the EMI period
        const targetYear = selectedYear;
        const targetMonth = monthIndex;

        // Convert dates to comparable format (year * 12 + month)
        const startPeriod = startYear * 12 + normalizedStartMonth;
        const endPeriod = endYear * 12 + normalizedEndMonth;
        const targetPeriod = targetYear * 12 + targetMonth;

        // Include the expense if target month is within the EMI period
        if (targetPeriod >= startPeriod && targetPeriod < endPeriod) {
          monthExpenses.push({
            name: expense.name,
            amount: expense.amount,
            type: expense.type,
          });
        }
      }
    });

    return monthExpenses;
  };

  // Determine the effective current month for the selected year
  const effectiveCurrentMonth =
    selectedYear === currentYear ? currentMonth : selectedYear < currentYear ? 11 : 0;

  const monthlyData = months.map((month, index) => ({
    month,
    amount: getMonthlyExpense(index),
    isPast: index < effectiveCurrentMonth,
    isCurrent: index === effectiveCurrentMonth,
    isFuture: index > effectiveCurrentMonth,
  }));

  const maxAmount = Math.max(...monthlyData.map((d) => d.amount));
  const totalSpentSoFar = monthlyData
    .slice(0, effectiveCurrentMonth + 1)
    .reduce((sum, d) => sum + d.amount, 0);
  const projectedRemaining = monthlyData
    .slice(effectiveCurrentMonth + 1)
    .reduce((sum, d) => sum + d.amount, 0);

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-background animate-fade-in-up overscroll-none">
      <Card className="w-screen h-screen rounded-none border-0 shadow-none premium-card animate-scale-in flex flex-col">
        <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between py-5 px-4 sm:py-6 sm:px-8 bg-gradient-to-r from-blue-accent/5 to-purple-accent/5 border-b border-border/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-accent/20 to-blue-accent/10 rounded-2xl">
              <Calendar className="h-6 w-6 text-blue-accent" />
            </div>
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground">
                Monthly Expenses Overview
              </CardTitle>
              <p className="text-muted-foreground font-medium">
                {selectedYear} - Actual vs Projected
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="premium-card border-blue-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-accent/10 rounded-xl">
                      <IndianRupee className="h-5 w-5 text-blue-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Spent So Far</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(totalSpentSoFar)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card border-emerald-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-accent/10 rounded-xl">
                      <TrendingUp className="h-5 w-5 text-emerald-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Projected Remaining
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(projectedRemaining)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card border-purple-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-accent/10 rounded-xl">
                      <Calendar className="h-5 w-5 text-purple-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Year</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(totalSpentSoFar + projectedRemaining)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart */}
            <Card className="premium-card">
              <CardHeader className="pb-0">
                <CardTitle className="text-xl font-bold">Monthly Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-4">
                <ConnectedLineChart
                  data={monthlyData.map((data, index) => ({
                    label: data.month,
                    value: data.amount,
                    isPast: data.isPast,
                    isCurrent: data.isCurrent,
                    isFuture: data.isFuture,
                    expenses: getMonthlyExpenseDetails(index),
                  }))}
                  formatValue={formatCurrency}
                  title="Monthly Spending Trend"
                  color="#3b82f6"
                  height={360}
                />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>,
    document.body,
  );
};
