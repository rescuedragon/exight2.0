import React, { memo, useMemo, useCallback } from 'react';

interface MemoizedWrapperProps {
  children: React.ReactNode;
  dependencies?: any[];
  shouldUpdate?: (prevProps: any, nextProps: any) => boolean;
}

// Custom comparison function for deep equality
const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  
  if (typeof a === 'object') {
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    
    if (Array.isArray(a)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i])) return false;
      }
      return true;
    }
    
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    
    if (keysA.length !== keysB.length) return false;
    
    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    
    return true;
  }
  
  return false;
};

// Memoized wrapper with custom comparison
export const MemoizedWrapper = memo<MemoizedWrapperProps>(
  ({ children, dependencies = [] }) => {
    // Memoize children based on dependencies
    const memoizedChildren = useMemo(() => children, dependencies);
    
    return <>{memoizedChildren}</>;
  },
  (prevProps, nextProps) => {
    // Custom comparison function
    if (prevProps.shouldUpdate) {
      return prevProps.shouldUpdate(prevProps, nextProps);
    }
    
    // Default deep comparison
    return deepEqual(prevProps.dependencies, nextProps.dependencies);
  }
);

// Hook for creating memoized callbacks with dependency tracking
export const useMemoizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  dependencies: any[]
): T => {
  return useCallback(callback, dependencies);
};

// Hook for creating memoized values with dependency tracking
export const useMemoizedValue = <T>(value: T, dependencies: any[]): T => {
  return useMemo(() => value, dependencies);
};

// Higher-order component for memoization
export const withMemoization = <P extends object>(
  Component: React.ComponentType<P>,
  comparisonFn?: (prevProps: P, nextProps: P) => boolean
) => {
  const MemoizedComponent = memo(Component, comparisonFn);
  
  // Add display name for debugging
  MemoizedComponent.displayName = `Memoized(${Component.displayName || Component.name})`;
  
  return MemoizedComponent;
};

// Component for conditional rendering with memoization
export const ConditionalRender = memo<{
  condition: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}>(({ condition, children, fallback = null }) => {
  return condition ? <>{children}</> : <>{fallback}</>;
});

// Component for expensive calculations with memoization
export const ExpensiveCalculation = memo<{
  data: any[];
  children: (result: any) => React.ReactNode;
  calculation: (data: any[]) => any;
}>(({ data, children, calculation }) => {
  const result = useMemo(() => calculation(data), [data, calculation]);
  return <>{children(result)}</>;
});
