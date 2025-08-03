import { useState } from "react";

interface ExpenseDetail {
  name: string;
  amount: number;
  type: string;
}

interface ChartDataPoint {
  label: string;
  value: number;
  isPast?: boolean;
  isCurrent?: boolean;
  isFuture?: boolean;
  expenses?: ExpenseDetail[];
}

interface ConnectedLineChartProps {
  data: ChartDataPoint[];
  formatValue: (value: number) => string;
  title: string;
  color?: string;
  height?: number;
}

export const ConnectedLineChart = ({ 
  data, 
  formatValue, 
  title, 
  color = "#10b981", 
  height = 320 
}: ConnectedLineChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-muted-foreground">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="w-full">
      <div className="relative bg-muted/5 rounded-xl p-6" style={{ height }}>
        
        {/* Y-axis labels - removed for cleaner look */}

        {/* Chart area */}
        <div className="ml-4 mr-4 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-rows-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-t border-border/20 first:border-t-0"></div>
            ))}
          </div>

          {/* Chart container with proper dimensions */}
          <div className="absolute inset-0" style={{ paddingTop: '5%', paddingBottom: '15%' }}>
            
            {/* Lines connecting each pair of dots */}
            {data.map((point, index) => {
              if (index === data.length - 1) return null;
              
              const x1 = (index / (data.length - 1)) * 100;
              const y1 = 100 - (point.value / maxValue) * 100;
              const x2 = ((index + 1) / (data.length - 1)) * 100;
              const y2 = 100 - (data[index + 1].value / maxValue) * 100;
              
              return (
                <svg
                  key={`line-${index}`}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 5 }}
                >
                  <line
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
                      strokeDasharray: 'none',
                      opacity: 0.9
                    }}
                  />
                </svg>
              );
            })}

            {/* Data points */}
            {data.map((point, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - (point.value / maxValue) * 100;
              
              return (
                <div
                  key={index}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 15
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Data point circle */}
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-lg group-hover:w-5 group-hover:h-5 transition-all duration-200"
                    style={{
                      backgroundColor: point.isPast ? color : 
                                     point.isCurrent ? '#f59e0b' : 
                                     point.isFuture ? '#8b5cf6' : color,
                      filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.25))',
                      border: '3px solid white',
                      boxShadow: '0 0 0 1px rgba(0,0,0,0.1)'
                    }}
                  />

                  {/* Tooltip */}
                  {hoveredIndex === index && (() => {
                    // Smart positioning based on dot location
                    let tooltipStyle: React.CSSProperties = {
                      position: 'fixed',
                      zIndex: 1000,
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '16px',
                      padding: '20px',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                      minWidth: '320px',
                      maxWidth: '450px',
                      maxHeight: '70vh',
                      overflowY: 'auto',
                      pointerEvents: 'none',
                      backdropFilter: 'blur(12px)'
                    };

                    // Determine position based on dot location
                    if (index <= 1) {
                      // First two months - position to the right
                      tooltipStyle.left = '20px';
                      tooltipStyle.top = '50%';
                      tooltipStyle.transform = 'translateY(-50%)';
                    } else if (index >= data.length - 2) {
                      // Last two months - position to the left
                      tooltipStyle.right = '20px';
                      tooltipStyle.top = '50%';
                      tooltipStyle.transform = 'translateY(-50%)';
                    } else {
                      // Middle months - center position
                      tooltipStyle.left = '50%';
                      tooltipStyle.top = '50%';
                      tooltipStyle.transform = 'translate(-50%, -50%)';
                    }

                    return (
                      <div style={tooltipStyle}>
                        <div className="space-y-3">
                          <div className="border-b border-gray-200 pb-2">
                            <div className="text-sm font-semibold text-gray-900">{point.label}</div>
                            <div className="text-lg font-bold" style={{ color }}>{formatValue(point.value)}</div>
                          </div>
                          
                          {point.expenses && point.expenses.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-gray-600">Expenses:</p>
                              {point.expenses.map((expense, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm p-2 rounded-lg bg-gray-50">
                                  <div>
                                    <span className="font-semibold text-gray-900">{expense.name}</span>
                                    <span className="text-xs text-gray-500 ml-2 px-2 py-0.5 bg-gray-200 rounded-full">
                                      {expense.type}
                                    </span>
                                  </div>
                                  <span className="font-bold text-gray-900">{formatValue(expense.amount)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {(!point.expenses || point.expenses.length === 0) && (
                            <p className="text-sm text-gray-500 italic">No expenses this month</p>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>

          {/* X-axis labels */}
          <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-muted-foreground">
            {data.map((point, index) => (
              <span 
                key={index} 
                className={`text-center ${point.isCurrent ? 'font-bold text-emerald-accent' : ''}`}
              >
                {point.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};