import { useState } from "react";

interface ChartData {
  month: string;
  amount: number;
  isPast: boolean;
  isCurrent: boolean;
  isFuture: boolean;
  expenses: Array<{name: string, amount: number, type: string}>;
}

interface SimpleChartProps {
  data: ChartData[];
  maxAmount: number;
  formatCurrency: (amount: number) => string;
  selectedYear: number;
}

export const SimpleChart = ({ data, maxAmount, formatCurrency, selectedYear }: SimpleChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="relative h-80 bg-muted/5 rounded-xl p-6">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-6 bottom-12 flex flex-col justify-between text-xs text-muted-foreground font-medium">
        <span>₹{(maxAmount / 1000).toFixed(0)}k</span>
        <span>₹{(maxAmount * 0.75 / 1000).toFixed(0)}k</span>
        <span>₹{(maxAmount * 0.5 / 1000).toFixed(0)}k</span>
        <span>₹{(maxAmount * 0.25 / 1000).toFixed(0)}k</span>
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
        
        {/* Line Chart */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(217, 91%, 60%)" />
              <stop offset="50%" stopColor="hsl(259, 94%, 51%)" />
              <stop offset="100%" stopColor="hsl(142, 76%, 36%)" />
            </linearGradient>
          </defs>
          
          {/* Smooth Connecting Line */}
          <path
            d={data.map((point, index) => {
              const x = (index / Math.max(data.length - 1, 1)) * 100;
              const y = maxAmount > 0 ? 100 - ((point.amount / maxAmount) * 100) : 50;
              return `${index === 0 ? 'M' : 'L'} ${x}% ${y}%`;
            }).join(' ')}
            stroke="url(#lineGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))'
            }}
          />
        </svg>
        
        {/* Data Points */}
        {data.map((point, index) => {
          const x = (index / Math.max(data.length - 1, 1)) * 100;
          const y = maxAmount > 0 ? 100 - ((point.amount / maxAmount) * 100) : 50;
          
          return (
            <div
              key={index}
              className="absolute cursor-pointer group"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Data Point Circle */}
              <div
                className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm group-hover:w-3.5 group-hover:h-3.5 transition-all duration-200 ${
                  point.isPast ? 'bg-blue-accent' : 
                  point.isCurrent ? 'bg-emerald-accent' : 
                  'bg-purple-accent'
                }`}
                style={{
                  backgroundColor: point.isPast ? 'hsl(217, 91%, 60%)' : 
                                   point.isCurrent ? 'hsl(142, 76%, 36%)' : 
                                   'hsl(259, 94%, 51%)',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))'
                }}
              />
              

            </div>
          );
        })}
        
        {/* Tooltip inside chart container */}
        {hoveredIndex !== null && (() => {
          const xPercent = (hoveredIndex / Math.max(data.length - 1, 1)) * 100;
          const yPercent = maxAmount > 0 ? 100 - ((data[hoveredIndex].amount / maxAmount) * 100) : 50;
          
          // Smart positioning: adjust transform based on position
          let transform = 'translate(-50%, -120%)'; // Default: center above
          
          if (xPercent > 80) {
            // Right side: position tooltip to the left of the dot
            transform = 'translate(-100%, -50%)';
          } else if (xPercent < 20) {
            // Left side: position tooltip to the right of the dot
            transform = 'translate(0%, -50%)';
          }
          
          return (
            <div
              className="absolute rounded-xl p-4 min-w-64 z-[100] pointer-events-none bg-white dark:bg-gray-800 border-2 border-white dark:border-gray-700"
              style={{
                left: `${xPercent}%`,
                top: `${yPercent}%`,
                transform,
                boxShadow: document.documentElement.classList.contains('dark') 
                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 8px rgba(31, 41, 55, 0.9)' 
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 8px rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)'
              }}
            >
            <div className="space-y-3">
              <div className="border-b border-gray-200 dark:border-gray-600 pb-2">
                <h4 className="font-bold text-gray-900 dark:text-white text-lg">{data[hoveredIndex].month} {selectedYear}</h4>
                <p className="text-xl font-bold bg-gradient-to-r from-blue-accent to-purple-accent bg-clip-text text-transparent">
                  Total: {formatCurrency(data[hoveredIndex].amount)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Expenses:</p>
                {data[hoveredIndex].expenses.length > 0 ? (
                  data[hoveredIndex].expenses.map((expense, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm p-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">{expense.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded-full">
                          {expense.type}
                        </span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(expense.amount)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">No expenses this month</p>
                )}
              </div>
            </div>
          </div>
          );
        })()}
        
        {/* X-axis labels */}
        <div className="absolute -bottom-6 left-0 right-0 grid grid-cols-12 gap-1 text-xs text-muted-foreground font-medium">
          {data.map((point, index) => (
            <span key={index} className={`text-center truncate transition-colors ${
              point.isCurrent ? 'font-bold text-emerald-accent' : 'hover:text-foreground'
            }`}>
              {point.month}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};