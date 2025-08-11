import React, { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load the chart components
const ChartComponent = lazy(() => import('./ui/chart'));

interface LazyChartProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyChart: React.FC<LazyChartProps> = ({ 
  children, 
  fallback = <Skeleton className="w-full h-64" /> 
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

// Lazy load specific chart types
export const LazyLineChart = lazy(() => import('./ConnectedLineChart'));
export const LazyExpenseChart = lazy(() => import('./ExpenseChart'));
export const LazySimpleChart = lazy(() => import('./SimpleChart'));

// Chart loading fallbacks
export const ChartFallback = () => (
  <div className="w-full h-64 flex items-center justify-center bg-muted/20 rounded-lg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
      <p className="text-sm text-muted-foreground">Loading chart...</p>
    </div>
  </div>
);
