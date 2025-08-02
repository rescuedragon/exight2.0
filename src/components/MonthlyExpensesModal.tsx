import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Calendar, TrendingUp, IndianRupee } from "lucide-react";
import { Expense } from "@/types/expense";
import { SimpleChart } from "@/components/SimpleChart";

interface MonthlyExpensesModalProps {
  expenses: Expense[];
  onClose: () => void;
}

export const MonthlyExpensesModal = ({ expenses, onClose }: MonthlyExpensesModalProps) => {
  const [selectedYear] = useState(new Date().getFullYear());
  const currentMonth = new Date().getMonth();

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'symbol'
    }).format(amount).replace(/^₹/, '₹');
  };

  const getMonthlyExpense = (monthIndex: number) => {
    const allExpenses = expenses;

    return allExpenses.reduce((total, expense) => {
      if (expense.isRecurring) {
        return total + expense.amount;
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
          return total + expense.amount;
        }
      }
      
      return total;
    }, 0);
  };

  const getMonthlyExpenseDetails = (monthIndex: number) => {
    const allExpenses = expenses;
    const monthExpenses: Array<{name: string, amount: number, type: string}> = [];

    allExpenses.forEach(expense => {
      if (expense.isRecurring) {
        monthExpenses.push({
          name: expense.name,
          amount: expense.amount,
          type: expense.type
        });
        return;
      }
      
      const totalMonths = expense.totalMonths || 0;
      const remainingMonths = expense.remainingMonths || 0;
      const completedMonths = totalMonths - remainingMonths;
      
      const currentDate = new Date();
      const currentMonthIndex = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      const startMonthIndex = currentMonthIndex - completedMonths;
      const startYear = currentYear + Math.floor(startMonthIndex / 12);
      const normalizedStartMonth = ((startMonthIndex % 12) + 12) % 12;
      
      const endMonthIndex = currentMonthIndex + remainingMonths;
      const endYear = currentYear + Math.floor(endMonthIndex / 12);
      const normalizedEndMonth = endMonthIndex % 12;
      
      const targetYear = selectedYear;
      const targetMonth = monthIndex;
      
      const startPeriod = startYear * 12 + normalizedStartMonth;
      const endPeriod = endYear * 12 + normalizedEndMonth;
      const targetPeriod = targetYear * 12 + targetMonth;
      
      if (targetPeriod >= startPeriod && targetPeriod < endPeriod) {
        monthExpenses.push({
          name: expense.name,
          amount: expense.amount,
          type: expense.type
        });
      }
    });

    return monthExpenses;
  };

  const monthlyData = months.map((month, index) => ({
    month,
    amount: getMonthlyExpense(index),
    isPast: index < currentMonth,
    isCurrent: index === currentMonth,
    isFuture: index > currentMonth
  }));

  const maxAmount = Math.max(...monthlyData.map(d => d.amount));
  const totalSpentSoFar = monthlyData.slice(0, currentMonth + 1).reduce((sum, d) => sum + d.amount, 0);
  const projectedRemaining = monthlyData.slice(currentMonth + 1).reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-fade-in-up">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden premium-card border-border/40 shadow-premium animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between py-6 px-8 bg-gradient-to-r from-blue-accent/5 to-purple-accent/5 border-b border-border/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-accent/20 to-blue-accent/10 rounded-2xl">
              <Calendar className="h-6 w-6 text-blue-accent" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-foreground">Monthly Expenses Overview</CardTitle>
              <p className="text-muted-foreground font-medium">{selectedYear} - Actual vs Projected</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-12 w-12 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-8">
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
                      <p className="text-2xl font-bold text-foreground">{formatCurrency(totalSpentSoFar)}</p>
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
                      <p className="text-sm font-medium text-muted-foreground">Projected Remaining</p>
                      <p className="text-2xl font-bold text-foreground">{formatCurrency(projectedRemaining)}</p>
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
                      <p className="text-2xl font-bold text-foreground">{formatCurrency(totalSpentSoFar + projectedRemaining)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Monthly Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <SimpleChart 
                  data={monthlyData.map((data, index) => ({
                    ...data,
                    expenses: getMonthlyExpenseDetails(index)
                  }))}
                  maxAmount={maxAmount}
                  formatCurrency={formatCurrency}
                  selectedYear={selectedYear}
                />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};