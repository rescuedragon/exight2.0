import { useMemo, useState, useEffect } from "react";
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Animation effect - moved to top to follow React Hook rules
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

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
      '#10B981', // Emerald
      '#EF4444', // Red
      '#F59E0B', // Amber
      '#059669', // Emerald-600
      '#F97316', // Orange
      '#3B82F6', // Blue
      '#8B5CF6', // Violet
      '#6366F1', // Indigo
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

  // Dynamic sizing based on number of entries
  const itemCount = chartData.length;
  const baseSize = 384; // 96 * 4 (w-96 h-96 in pixels)
  const baseMinHeight = 384; // min-h-96 in pixels
  
  // Scale up proportionally if more than 8 items
  const scaleFactor = itemCount > 8 ? 1 + ((itemCount - 8) * 0.1) : 1;
  const chartSize = Math.round(baseSize * scaleFactor);
  const minHeight = Math.round(baseMinHeight * scaleFactor);
  
  const chartSizeClass = `w-[${chartSize}px] h-[${chartSize}px]`;
  const minHeightClass = `min-h-[${minHeight}px]`;

  // Enhanced chart creation for donut chart
  const centerX = 200;
  const centerY = 200;
  const innerRadius = 80;
  const outerRadius = 140;
  const hoverRadius = 150;

  const createPath = (startAngle: number, endAngle: number, radius: number, isHovered: boolean) => {
    const adjustedRadius = isHovered ? hoverRadius : radius;
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + adjustedRadius * Math.cos(startAngleRad);
    const y1 = centerY + adjustedRadius * Math.sin(startAngleRad);
    const x2 = centerX + adjustedRadius * Math.cos(endAngleRad);
    const y2 = centerY + adjustedRadius * Math.sin(endAngleRad);
    const x3 = centerX + innerRadius * Math.cos(endAngleRad);
    const y3 = centerY + innerRadius * Math.sin(endAngleRad);
    const x4 = centerX + innerRadius * Math.cos(startAngleRad);
    const y4 = centerY + innerRadius * Math.sin(startAngleRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${adjustedRadius} ${adjustedRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  // Create segments with animation
  let currentAngle = -90;
  const segments = chartData.map((item, index) => {
    const angle = (item.percentage / 100) * 360 * animationProgress;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const isHovered = hoveredIndex === index;
    const path = createPath(startAngle, endAngle, outerRadius, isHovered);

    return {
      ...item,
      path,
      startAngle,
      endAngle,
      isHovered
    };
  });

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
        <h1 className="text-2xl font-bold text-foreground">
          Monthly Expense Breakdown
        </h1>
      </div>

      <Card className="bg-background border border-border shadow-lg">
        <CardContent className="p-6">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Chart Section */}
            <div className="flex justify-center">
              <svg 
                width={chartSize} 
                height={chartSize} 
                className="drop-shadow-lg"
                viewBox="0 0 400 400"
              >


                {/* Chart segments */}
                {segments.map((segment, index) => (
                  <path
                    key={index}
                    d={segment.path}
                    fill={segment.color}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                    className="cursor-pointer"
                    style={{
                      opacity: segment.isHovered ? 0.9 : 1,
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                ))}

                {/* Center circle */}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={innerRadius}
                  fill="hsl(var(--background))"
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                />

                {/* Center text */}
                <text
                  x={centerX}
                  y={centerY - 15}
                  textAnchor="middle"
                  className="fill-foreground font-bold"
                  style={{ 
                    fontFamily: 'system-ui',
                    fontSize: `${Math.max(24, 24 * scaleFactor)}px`
                  }}
                >
                  {formatCurrency(totalAmount)}
                </text>
                <text
                  x={centerX}
                  y={centerY + 8}
                  textAnchor="middle"
                  className="fill-muted-foreground font-medium"
                  style={{ 
                    fontFamily: 'system-ui',
                    fontSize: `${Math.max(14, 14 * scaleFactor)}px`
                  }}
                >
                  Total Monthly
                </text>
              </svg>
            </div>

            {/* Legend Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                Expense Breakdown
              </h2>
              <div className="space-y-3">
                {chartData.map((item, index) => (
                  <div
                    key={index}
                    className={`group p-4 rounded-xl border cursor-pointer ${
                      hoveredIndex === index
                        ? 'bg-muted/20 border-border shadow-md'
                        : 'bg-muted/10 border-border/50 hover:bg-muted/15'
                    }`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: item.color,
                          }}
                        ></div>
                        <div>
                          <div className="font-semibold text-foreground text-base">
                            {item.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.type}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-foreground text-base">
                          {formatCurrency(item.amount)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.percentage}%
                        </div>
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