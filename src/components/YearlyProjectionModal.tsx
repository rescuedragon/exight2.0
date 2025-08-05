import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, TrendingUp, IndianRupee, Target, Calendar } from "lucide-react";
import { ConnectedLineChart } from "@/components/ConnectedLineChart";
import { Expense } from "@/types/expense";

interface YearlyProjectionModalProps {
  expenses: Expense[];
  onClose: () => void;
}

export const YearlyProjectionModal = ({ expenses, onClose }: YearlyProjectionModalProps) => {
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
    const allExpenses = expenses; // Include all expenses, not just active ones

    return allExpenses.reduce((total, expense) => {
      if (expense.isRecurring) {
        // Recurring expenses are always active
        return total + expense.amount;
      }
      
      // For EMIs, calculate the actual timeline
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
        
        // Check if the given month falls within the EMI period
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

  // Calculate cumulative spending
  const monthlyData = months.map((month, index) => {
    const monthlyAmount = getMonthlyExpense(index);
    const cumulativeAmount = months.slice(0, index + 1).reduce((sum, _, i) => sum + getMonthlyExpense(i), 0);
    
    return {
      month,
      monthlyAmount,
      cumulativeAmount,
      isPast: index < currentMonth,
      isCurrent: index === currentMonth,
      isFuture: index > currentMonth
    };
  });

  const totalSpentSoFar = monthlyData[currentMonth]?.cumulativeAmount || 0;
  const projectedYearEnd = monthlyData[11]?.cumulativeAmount || 0;
  const remainingToSpend = projectedYearEnd - totalSpentSoFar;
  const maxCumulative = Math.max(...monthlyData.map(d => d.cumulativeAmount));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg z-[100] animate-fade-in-up">
      <Card className="w-full h-full overflow-hidden premium-card border-0 shadow-premium animate-scale-in flex flex-col rounded-none">
        <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between py-6 px-8 bg-gradient-to-r from-emerald-accent/5 to-blue-accent/5 border-b border-border/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-accent/20 to-emerald-accent/10 rounded-2xl">
              <TrendingUp className="h-6 w-6 text-emerald-accent" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-foreground">Yearly Projection</CardTitle>
              <p className="text-muted-foreground font-medium">{selectedYear} - Cumulative Spending Analysis</p>
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
        
        <CardContent className="flex-1 overflow-auto p-8">
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="premium-card border-emerald-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-accent/10 rounded-xl">
                      <IndianRupee className="h-5 w-5 text-emerald-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Spent Till Now</p>
                      <p className="text-2xl font-bold text-foreground">{formatCurrency(totalSpentSoFar)}</p>
                      <p className="text-xs text-muted-foreground">Through {months[currentMonth]}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="premium-card border-blue-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-accent/10 rounded-xl">
                      <Target className="h-5 w-5 text-blue-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Remaining to Spend</p>
                      <p className="text-2xl font-bold text-foreground">{formatCurrency(remainingToSpend)}</p>
                      <p className="text-xs text-muted-foreground">Till year end</p>
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
                      <p className="text-sm font-medium text-muted-foreground">Year-End Projection</p>
                      <p className="text-2xl font-bold text-foreground">{formatCurrency(projectedYearEnd)}</p>
                      <p className="text-xs text-muted-foreground">Total by Dec</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cumulative Chart */}
            <Card className="premium-card">
              <CardContent className="p-6">
                <ConnectedLineChart 
                  data={monthlyData.map((data, index) => ({
                    label: data.month,
                    value: data.cumulativeAmount,
                    isPast: data.isPast,
                    isCurrent: data.isCurrent,
                    isFuture: data.isFuture
                  }))}
                  formatValue={(value) => `₹${(value / 100000).toFixed(1)}L`}
                  title="Cumulative Spending Curve"
                  color="#10b981"
                  height={400}
                />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};