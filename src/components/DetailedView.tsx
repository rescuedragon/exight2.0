import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { X, IndianRupee, Calendar } from "lucide-react";
import { Expense } from "@/types/expense";
import { ExpenseChart } from "@/components/ExpenseChart";
import { useModal } from "@/contexts/ModalContext";

interface DetailedViewProps {
  expenses: Expense[];
  onClose: () => void;
}

export const DetailedView = ({ expenses, onClose }: DetailedViewProps) => {
  const { openModal, closeModal } = useModal();
  const [selectedYear] = useState(new Date().getFullYear());

  // Register modal when component mounts
  useEffect(() => {
    openModal();
    return () => {
      closeModal();
    };
  }, [openModal, closeModal]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    // Store original overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Disable scrolling
    document.body.style.overflow = 'hidden';
    
    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Filter to show only active expenses
  const activeExpenses = expenses.filter(expense =>
    expense.isRecurring || (expense.remainingMonths > 0 && (expense.remainingAmount === undefined || expense.remainingAmount > 0))
  );

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'symbol'
    }).format(amount).replace(/^₹/, '₹');
  };

  const getMonthlyExpenseForItem = (expense: Expense, monthIndex: number) => {
    const targetDate = new Date(selectedYear, monthIndex, expense.deductionDay);

    // For recurring expenses, show amount every month
    if (expense.isRecurring) {
      return expense.amount;
    }

    // For non-recurring (EMI/Loan), calculate the timeline properly
    if (expense.remainingMonths && expense.remainingMonths > 0 && expense.totalMonths) {
      const currentDate = new Date();
      const currentMonthIndex = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      // Calculate completed months
      const completedMonths = expense.totalMonths - expense.remainingMonths;
      
      // EMI started 'completedMonths' months ago from current month
      const startMonthIndex = currentMonthIndex - completedMonths;
      const startYear = currentYear + Math.floor(startMonthIndex / 12);
      const normalizedStartMonth = ((startMonthIndex % 12) + 12) % 12;
      
      // EMI will end 'remainingMonths' months from current month
      const endMonthIndex = currentMonthIndex + expense.remainingMonths;
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
        return expense.amount;
      }
    }

    return 0;
  };

  const getMonthlyTotal = (monthIndex: number) => {
    return activeExpenses.reduce((total, expense) => {
      return total + getMonthlyExpenseForItem(expense, monthIndex);
    }, 0);
  };

  // Calculate min and max values for heatmap
  const monthlyTotals = months.map((_, monthIndex) => getMonthlyTotal(monthIndex));
  const minTotal = Math.min(...monthlyTotals);
  const maxTotal = Math.max(...monthlyTotals);

  // Function to get heatmap intensity (0-1 scale)
  const getHeatmapIntensity = (value: number) => {
    if (maxTotal === minTotal) return 0.5; // If all values are same, use medium intensity
    return (value - minTotal) / (maxTotal - minTotal);
  };

  // Function to get heatmap background color
  const getHeatmapColor = (intensity: number) => {
    // Using blue color scheme with varying opacity
    const baseOpacity = 0.15;
    const maxOpacity = 0.7;
    const opacity = baseOpacity + (intensity * (maxOpacity - baseOpacity));
    
    // Return a single color that works well in both light and dark modes
    return `rgba(59, 130, 246, ${opacity})`; // blue-500 with varying opacity
  };

  return (
    <div
      className="fixed inset-0 bg-background z-[9999] flex items-center justify-center p-4 animate-fade-in-up"
      role="dialog"
      aria-modal="true"
      aria-label="Detailed monthly expense view"
    >
        <Card className="w-full h-full overflow-hidden premium-card border-0 shadow-premium rounded-none animate-scale-in flex flex-col">
        <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between py-6 px-8 bg-gradient-to-r from-blue-accent/5 to-purple-accent/5 border-b border-border/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl backdrop-blur-sm">
              <IndianRupee className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                Detailed Monthly View
              </CardTitle>
              <div className="flex items-center gap-1 mt-1">
                <Calendar className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{selectedYear}</p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 group"
          >
            <X className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0 bg-gradient-to-br from-gray-50/30 to-white/30 dark:from-gray-900/30 dark:to-gray-800/30">
          <div className="h-full overflow-y-auto">
            <div className="space-y-4 p-4 pb-6">
              <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <Table className="w-full table-fixed">
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50/80 to-gray-100/60 dark:from-gray-800/80 dark:to-gray-700/60 border-b border-gray-200/50 dark:border-gray-600/50">
                    <TableHead className="sticky left-0 bg-gradient-to-r from-gray-50/90 to-gray-100/70 dark:from-gray-800/90 dark:to-gray-700/70 font-semibold text-gray-900 dark:text-white py-3 px-4 w-32 rounded-l-xl">
                      <div className="text-xs font-semibold tracking-wide">Expense</div>
                    </TableHead>
                    {months.map((month) => (
                      <TableHead key={month} className="text-center font-semibold py-3 px-1 w-12">
                        <div className="text-gray-700 dark:text-gray-200 text-xs font-medium tracking-wide">
                          {month.substring(0, 3)}
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="text-center font-semibold bg-gradient-to-r from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 py-3 px-2 w-16">
                      <div className="text-gray-900 dark:text-white text-xs font-semibold tracking-wide">Total</div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeExpenses.map((expense, index) => (
                    <TableRow 
                      key={expense.id} 
                      className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent dark:hover:from-blue-900/20 dark:hover:to-transparent transition-all duration-300 border-b border-gray-100/50 dark:border-gray-700/30 group"
                    >
                      <TableCell className="sticky left-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm font-medium text-gray-900 dark:text-white py-2 px-4 w-32 rounded-l-xl group-hover:bg-white/90 dark:group-hover:bg-gray-900/90 transition-colors">
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900 dark:text-white text-sm tracking-wide" title={expense.name}>
                            {expense.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium px-2 py-0.5 bg-gray-100/60 dark:bg-gray-700/60 rounded-full inline-block tracking-wide">
                            {expense.type}
                          </div>
                        </div>
                      </TableCell>
                      {months.map((month, monthIndex) => {
                        const amount = getMonthlyExpenseForItem(expense, monthIndex);
                        return (
                          <TableCell key={month} className={`text-center py-2 px-1 min-w-[50px] max-w-[50px] ${amount > 0 ? 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 hover:from-blue-500/15 hover:to-blue-600/15 dark:hover:from-blue-500/25 dark:hover:to-blue-600/25 transition-all duration-200' : ''}`}>
                            {amount > 0 ? (
                              <div className="font-semibold text-gray-900 dark:text-white text-xs tracking-wide">
                                {formatCurrency(amount, expense.currency).replace('₹', '₹')}
                              </div>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500 font-medium text-xs">—</span>
                            )}
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-center font-semibold bg-gradient-to-r from-blue-500/15 to-blue-600/15 dark:from-blue-500/25 dark:to-blue-600/25 py-2 px-2 min-w-[70px] max-w-[70px]">
                        <div className="text-gray-900 dark:text-white text-xs font-semibold tracking-wide">
                          {formatCurrency(
                            months.reduce((total, _, monthIndex) => {
                              return total + getMonthlyExpenseForItem(expense, monthIndex);
                            }, 0),
                            expense.currency
                          ).replace('₹', '₹')}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2 border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20">
                    <TableCell className="sticky left-0 bg-gradient-to-r from-blue-500/15 to-blue-600/15 dark:from-blue-500/25 dark:to-blue-600/25 font-semibold text-gray-900 dark:text-white py-2 px-4 min-w-[140px] max-w-[140px] rounded-l-xl">
                      <div className="text-sm font-semibold tracking-wide">Monthly Total</div>
                    </TableCell>
                    {months.map((month, monthIndex) => {
                      const monthTotal = getMonthlyTotal(monthIndex);
                      const intensity = getHeatmapIntensity(monthTotal);
                      const heatmapColor = getHeatmapColor(intensity);
                      
                      return (
                        <TableCell 
                          key={month} 
                          className="text-center font-semibold py-2 px-1 min-w-[50px] max-w-[50px] transition-all duration-200"
                          style={{
                            backgroundColor: heatmapColor,
                          }}
                        >
                          <div className="text-gray-900 dark:text-white text-xs font-semibold tracking-wide">
                            {formatCurrency(monthTotal)}
                          </div>
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center font-semibold bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 py-2 px-2 min-w-[70px] max-w-[70px]">
                      <div className="text-white text-xs font-bold tracking-wide">
                        {formatCurrency(
                          months.reduce((total, _, monthIndex) => total + getMonthlyTotal(monthIndex), 0)
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

              {/* Expense Chart below the table */}
              <div className="pt-4 pb-2">
                <ExpenseChart expenses={expenses} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};