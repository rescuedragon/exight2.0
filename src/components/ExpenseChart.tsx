import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, BarChart3 } from "lucide-react";
import { Expense } from "@/types/expense";

interface ExpenseChartProps {
  expenses: Expense[];
}

interface ChartData {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  type: string;
}

export const ExpenseChart = ({ expenses }: ExpenseChartProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'symbol'
    }).format(amount).replace(/^₹/, '₹');
  };

  const chartData = useMemo(() => {
    const activeExpenses = expenses.filter(expense => 
      expense.isRecurring || (expense.remainingMonths > 0 && (expense.remainingAmount === undefined || expense.remainingAmount > 0))
    );

    if (activeExpenses.length === 0) return [];

    const totalAmount = activeExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    const colors = [
      'hsl(217, 91%, 60%)', // Blue
      'hsl(259, 94%, 51%)', // Purple  
      'hsl(142, 76%, 36%)', // Emerald
      'hsl(25, 95%, 53%)',  // Orange
      'hsl(346, 77%, 49%)', // Rose
      'hsl(47, 96%, 53%)',  // Yellow
      'hsl(262, 83%, 58%)', // Violet
      'hsl(173, 58%, 39%)', // Teal
    ];

    return activeExpenses
      .map((expense, index) => ({
        name: expense.name,
        amount: expense.amount,
        percentage: Math.round((expense.amount / totalAmount) * 100),
        color: colors[index % colors.length],
        type: expense.type
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  if (chartData.length === 0) {
    return null;
  }

  const totalAmount = chartData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-blue-accent/20 to-blue-accent/10 rounded-xl">
          <PieChart className="h-5 w-5 text-blue-accent" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Monthly Expense Breakdown</h2>
      </div>

      <Card className="premium-card">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart Visualization */}
            <div className="flex items-center justify-center">
              <div className="relative w-64 h-64">
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                  {chartData.map((item, index) => {
                    const previousPercentages = chartData
                      .slice(0, index)
                      .reduce((sum, prev) => sum + prev.percentage, 0);
                    
                    const startAngle = (previousPercentages / 100) * 360;
                    const endAngle = ((previousPercentages + item.percentage) / 100) * 360;
                    
                    const startAngleRad = (startAngle * Math.PI) / 180;
                    const endAngleRad = (endAngle * Math.PI) / 180;
                    
                    const largeArcFlag = item.percentage > 50 ? 1 : 0;
                    
                    const x1 = 100 + 80 * Math.cos(startAngleRad);
                    const y1 = 100 + 80 * Math.sin(startAngleRad);
                    const x2 = 100 + 80 * Math.cos(endAngleRad);
                    const y2 = 100 + 80 * Math.sin(endAngleRad);
                    
                    const pathData = [
                      `M 100 100`,
                      `L ${x1} ${y1}`,
                      `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                      'Z'
                    ].join(' ');
                    
                    return (
                      <g key={item.name}>
                        <path
                          d={pathData}
                          fill={item.color}
                          className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                          style={{
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                          }}
                        />
                      </g>
                    );
                  })}
                  
                  {/* Center circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="45"
                    fill="hsl(var(--background))"
                    className="drop-shadow-sm"
                  />
                </svg>
                
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold text-foreground">
                    {formatCurrency(totalAmount)}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Total Monthly
                  </div>
                </div>
              </div>
            </div>

            {/* Legend and Details */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-foreground mb-4">Expense Breakdown</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {chartData.map((item, index) => (
                  <div 
                    key={item.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <div className="font-semibold text-foreground group-hover:text-foreground/80 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">
                          {item.type}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground">
                        {formatCurrency(item.amount)}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {item.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};