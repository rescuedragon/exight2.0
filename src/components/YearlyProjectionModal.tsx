import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, TrendingUp, IndianRupee, Target, Calendar } from "lucide-react";
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
    <div className="fixed inset-0 bg-background/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-fade-in-up">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden premium-card border-border/40 shadow-premium animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between py-6 px-8 bg-gradient-to-r from-emerald-accent/5 to-blue-accent/5 border-b border-border/20">
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
        
        <CardContent className="p-8">
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
              <CardHeader>
                <CardTitle className="text-xl font-bold">Cumulative Spending Curve</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  
                  <div className="relative h-80 bg-muted/5 rounded-xl p-6">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-6 bottom-12 flex flex-col justify-between text-xs text-muted-foreground">
                      <span>₹{(maxCumulative / 100000).toFixed(1)}L</span>
                      <span>₹{(maxCumulative * 0.75 / 100000).toFixed(1)}L</span>
                      <span>₹{(maxCumulative * 0.5 / 100000).toFixed(1)}L</span>
                      <span>₹{(maxCumulative * 0.25 / 100000).toFixed(1)}L</span>
                      <span>₹0</span>
                    </div>
                    
                    {/* Chart area */}
                    <div className="ml-12 mr-4 h-full relative">
                      {/* Grid lines */}
                      <div className="absolute inset-0 grid grid-rows-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="border-t border-border/20 first:border-t-0"></div>
                        ))}
                      </div>
                      
                      {/* Chart SVG */}
                      <svg className="absolute inset-0 w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="cumulativeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="hsl(var(--emerald-accent))" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="hsl(var(--emerald-accent))" stopOpacity="0.05" />
                          </linearGradient>
                        </defs>
                        
                        {/* Area under curve */}
                        <path
                          d={`M 0 100% ${monthlyData.map((data, index) => {
                            const x = (index / (monthlyData.length - 1)) * 100;
                            const y = 100 - ((data.cumulativeAmount / maxCumulative) * 100);
                            return `L ${x}% ${y}%`;
                          }).join(' ')} L 100% 100% Z`}
                          fill="url(#cumulativeGradient)"
                          className="animate-fade-in-up"
                          style={{ animationDelay: '300ms' }}
                        />
                        
                        {/* Smooth connecting line - Made very visible */}
                        <path
                          d={`M ${monthlyData.map((data, index) => {
                            const x = (index / (monthlyData.length - 1)) * 100;
                            const y = 100 - ((data.cumulativeAmount / maxCumulative) * 100);
                            return `${index === 0 ? 'M' : 'L'} ${x}% ${y}%`;
                          }).join(' ')}`}
                          stroke="#000000"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray="none"
                          style={{ 
                            zIndex: 10
                          }}
                        />
                        
                        {/* Data points */}
                        {monthlyData.map((data, index) => {
                          const x = (index / (monthlyData.length - 1)) * 100;
                          const y = 100 - ((data.cumulativeAmount / maxCumulative) * 100);
                          
                          return (
                            <g key={index}>
                              <circle
                                cx={`${x}%`}
                                cy={`${y}%`}
                                r="2.4"
                                fill={data.isPast || data.isCurrent ? 'hsl(var(--emerald-accent))' : 'hsl(var(--blue-accent))'}
                                stroke="white"
                                strokeWidth="1"
                                className="animate-fade-in-up hover:r-4 transition-all duration-200 cursor-pointer"
                                style={{ 
                                  animationDelay: `${700 + index * 50}ms`,
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
                                }}
                              />
                              {/* Value labels on hover */}
                              <text
                                x={`${x}%`}
                                y={`${y - 10}%`}
                                textAnchor="middle"
                                className="text-xs font-medium fill-foreground opacity-0 hover:opacity-100 transition-opacity duration-200"
                                style={{ animationDelay: `${700 + index * 50}ms` }}
                              >
                                ₹{(data.cumulativeAmount / 100000).toFixed(1)}L
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                      
                      {/* X-axis labels */}
                      <div className="absolute -bottom-6 left-0 right-0 grid grid-cols-12 gap-1 text-xs text-muted-foreground">
                        {monthlyData.map((data, index) => (
                          <span key={index} className={`text-center truncate ${data.isCurrent ? 'font-bold text-emerald-accent' : ''}`}>
                            {data.month}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};