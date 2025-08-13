import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  timestamp: number;
}

export const usePerformance = (componentName: string) => {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  // Track render start time
  useEffect(() => {
    renderStartTime.current = performance.now();
    renderCount.current += 1;

    // Log performance metrics
    const logPerformance = () => {
      const renderTime = performance.now() - renderStartTime.current;
      
      // Only log slow renders in development
      if (process.env.NODE_ENV === 'development' && renderTime > 16) {
        console.warn(
          `🚨 Slow render detected in ${componentName}:`,
          `${renderTime.toFixed(2)}ms (target: <16ms)`
        );
      }

      // Log every 10th render to avoid spam
      if (renderCount.current % 10 === 0) {
        console.log(
          `📊 ${componentName} render #${renderCount.current}:`,
          `${renderTime.toFixed(2)}ms`
        );
      }
    };

    // Use requestIdleCallback for non-blocking performance logging
    if ('requestIdleCallback' in window) {
      requestIdleCallback(logPerformance);
    } else {
      // Fallback to setTimeout
      setTimeout(logPerformance, 0);
    }
  });

  // Measure expensive operations
  const measureOperation = useCallback((operationName: string, operation: () => void) => {
    const start = performance.now();
    operation();
    const duration = performance.now() - start;
    
    if (duration > 16) {
      console.warn(
        `🐌 Slow operation in ${componentName}:`,
        `${operationName} took ${duration.toFixed(2)}ms`
      );
    }
    
    return duration;
  }, [componentName]);

  // Measure async operations
  const measureAsyncOperation = useCallback(async <T>(
    operationName: string, 
    operation: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await operation();
      const duration = performance.now() - start;
      
      if (duration > 100) {
        console.warn(
          `🐌 Slow async operation in ${componentName}:`,
          `${operationName} took ${duration.toFixed(2)}ms`
        );
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(
        `❌ Failed operation in ${componentName}:`,
        `${operationName} failed after ${duration.toFixed(2)}ms:`,
        error
      );
      throw error;
    }
  }, [componentName]);

  return {
    measureOperation,
    measureAsyncOperation,
    renderCount: renderCount.current,
  };
};

// Hook for measuring component mount/unmount performance
export const useComponentLifecycle = (componentName: string) => {
  const mountTime = useRef<number>(0);

  useEffect(() => {
    mountTime.current = performance.now();
    
    return () => {
      const lifetime = performance.now() - mountTime.current;
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `📈 ${componentName} lifetime:`,
          `${lifetime.toFixed(2)}ms`
        );
      }
    };
  }, [componentName]);
};
