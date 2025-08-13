interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  bundleSize: number; // JavaScript bundle size
  loadTime: number; // Total page load time
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  init() {
    if (this.isInitialized) return;
    
    try {
      this.setupObservers();
      this.measureBundleSize();
      this.measureLoadTime();
      this.isInitialized = true;
      
      console.log('🚀 Performance monitoring initialized');
    } catch (error) {
      console.error('Failed to initialize performance monitoring:', error);
    }
  }

  private setupObservers() {
    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            this.metrics.fcp = fcpEntry.startTime;
            this.logMetric('FCP', fcpEntry.startTime);
          }
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(fcpObserver);
      } catch (error) {
        console.warn('FCP observer failed:', error);
      }

      // Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            this.metrics.lcp = lastEntry.startTime;
            this.logMetric('LCP', lastEntry.startTime);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (error) {
        console.warn('LCP observer failed:', error);
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            this.metrics.fid = entry.processingStart - entry.startTime;
            this.logMetric('FID', this.metrics.fid);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (error) {
        console.warn('FID observer failed:', error);
      }

      // Cumulative Layout Shift
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          list.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.cls = clsValue;
          this.logMetric('CLS', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (error) {
        console.warn('CLS observer failed:', error);
      }
    }
  }

  private measureBundleSize() {
    try {
      const entries = performance.getEntriesByType('resource');
      const jsEntries = entries.filter(entry => 
        entry.name.endsWith('.js') || entry.name.includes('chunk')
      );
      
      const totalSize = jsEntries.reduce((sum, entry) => {
        const size = (entry as any).transferSize || 0;
        return sum + size;
      }, 0);
      
      this.metrics.bundleSize = totalSize;
      this.logMetric('Bundle Size', totalSize, 'bytes');
    } catch (error) {
      console.warn('Bundle size measurement failed:', error);
    }
  }

  private measureLoadTime() {
    try {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        this.metrics.loadTime = navigationEntry.loadEventEnd - navigationEntry.loadEventStart;
        this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        
        this.logMetric('Load Time', this.metrics.loadTime);
        this.logMetric('TTFB', this.metrics.ttfb);
      }
    } catch (error) {
      console.warn('Load time measurement failed:', error);
    }
  }

  private logMetric(name: string, value: number, unit = 'ms') {
    const isSlow = this.isMetricSlow(name, value);
    const emoji = isSlow ? '🐌' : '✅';
    const status = isSlow ? 'SLOW' : 'GOOD';
    
    console.log(`${emoji} ${name}: ${value.toFixed(2)}${unit} (${status})`);
    
    // Send to analytics if available
    this.sendToAnalytics(name, value, unit);
  }

  private isMetricSlow(name: string, value: number): boolean {
    const thresholds: Record<string, number> = {
      fcp: 1800,    // 1.8s
      lcp: 2500,    // 2.5s
      fid: 100,     // 100ms
      cls: 0.1,     // 0.1
      ttfb: 600,    // 600ms
      loadTime: 3000, // 3s
    };
    
    return value > (thresholds[name] || Infinity);
  }

  private sendToAnalytics(name: string, value: number, unit: string) {
    // Send to your analytics service
    if (window.gtag) {
      window.gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: value,
        metric_unit: unit,
        page_url: window.location.href,
      });
    }
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  getScore(): number {
    const scores = {
      fcp: this.getScoreForMetric('fcp', 1800, 900),
      lcp: this.getScoreForMetric('lcp', 2500, 1200),
      fid: this.getScoreForMetric('fid', 100, 50),
      cls: this.getScoreForMetric('cls', 0.1, 0.05),
    };
    
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    return Math.round(totalScore / Object.keys(scores).length);
  }

  private getScoreForMetric(name: string, poor: number, good: number): number {
    const value = this.metrics[name as keyof PerformanceMetrics] as number;
    if (!value) return 0;
    
    if (value <= good) return 100;
    if (value >= poor) return 0;
    
    return Math.round(100 - ((value - good) / (poor - good)) * 100);
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.isInitialized = false;
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-initialize when the module is imported
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      performanceMonitor.init();
    });
  } else {
    performanceMonitor.init();
  }
}

export default PerformanceMonitor;
