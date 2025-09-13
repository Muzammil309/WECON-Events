// Performance monitoring system for WECON
// Tracks API response times, database queries, and system metrics

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
  tags?: string[];
}

interface SystemMetrics {
  apiResponseTimes: Record<string, number[]>;
  databaseQueryTimes: Record<string, number[]>;
  cacheHitRates: Record<string, number>;
  errorRates: Record<string, number>;
  activeConnections: number;
  memoryUsage: number;
  cpuUsage: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 10000;
  private systemMetrics: SystemMetrics = {
    apiResponseTimes: {},
    databaseQueryTimes: {},
    cacheHitRates: {},
    errorRates: {},
    activeConnections: 0,
    memoryUsage: 0,
    cpuUsage: 0
  };

  // Record a performance metric
  recordMetric(name: string, duration: number, metadata?: Record<string, any>, tags?: string[]): void {
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now(),
      metadata,
      tags
    };

    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Update system metrics
    this.updateSystemMetrics(metric);
  }

  // Time a function execution
  async timeFunction<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>,
    tags?: string[]
  ): Promise<T> {
    const start = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.recordMetric(name, duration, metadata, tags);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(name, duration, { ...metadata, error: true }, tags);
      throw error;
    }
  }

  // Create a timer for manual timing
  createTimer(name: string, metadata?: Record<string, any>, tags?: string[]) {
    const start = performance.now();
    
    return {
      end: () => {
        const duration = performance.now() - start;
        this.recordMetric(name, duration, metadata, tags);
        return duration;
      }
    };
  }

  // Get performance statistics
  getStats(timeRange?: number): {
    averageResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    totalRequests: number;
    errorRate: number;
    slowestEndpoints: Array<{ name: string; avgTime: number; count: number }>;
    systemMetrics: SystemMetrics;
  } {
    const cutoff = timeRange ? Date.now() - timeRange : 0;
    const recentMetrics = this.metrics.filter(m => m.timestamp > cutoff);

    if (recentMetrics.length === 0) {
      return {
        averageResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        totalRequests: 0,
        errorRate: 0,
        slowestEndpoints: [],
        systemMetrics: this.systemMetrics
      };
    }

    // Calculate response time statistics
    const durations = recentMetrics.map(m => m.duration).sort((a, b) => a - b);
    const averageResponseTime = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const p95Index = Math.floor(durations.length * 0.95);
    const p99Index = Math.floor(durations.length * 0.99);
    const p95ResponseTime = durations[p95Index] || 0;
    const p99ResponseTime = durations[p99Index] || 0;

    // Calculate error rate
    const errorCount = recentMetrics.filter(m => m.metadata?.error).length;
    const errorRate = (errorCount / recentMetrics.length) * 100;

    // Find slowest endpoints
    const endpointStats = new Map<string, { total: number; count: number }>();
    
    recentMetrics.forEach(metric => {
      const existing = endpointStats.get(metric.name) || { total: 0, count: 0 };
      existing.total += metric.duration;
      existing.count += 1;
      endpointStats.set(metric.name, existing);
    });

    const slowestEndpoints = Array.from(endpointStats.entries())
      .map(([name, stats]) => ({
        name,
        avgTime: stats.total / stats.count,
        count: stats.count
      }))
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, 10);

    return {
      averageResponseTime,
      p95ResponseTime,
      p99ResponseTime,
      totalRequests: recentMetrics.length,
      errorRate,
      slowestEndpoints,
      systemMetrics: this.systemMetrics
    };
  }

  // Update system metrics
  private updateSystemMetrics(metric: PerformanceMetric): void {
    // Update API response times
    if (metric.tags?.includes('api')) {
      if (!this.systemMetrics.apiResponseTimes[metric.name]) {
        this.systemMetrics.apiResponseTimes[metric.name] = [];
      }
      this.systemMetrics.apiResponseTimes[metric.name].push(metric.duration);
      
      // Keep only last 100 measurements per endpoint
      if (this.systemMetrics.apiResponseTimes[metric.name].length > 100) {
        this.systemMetrics.apiResponseTimes[metric.name].shift();
      }
    }

    // Update database query times
    if (metric.tags?.includes('database')) {
      if (!this.systemMetrics.databaseQueryTimes[metric.name]) {
        this.systemMetrics.databaseQueryTimes[metric.name] = [];
      }
      this.systemMetrics.databaseQueryTimes[metric.name].push(metric.duration);
      
      // Keep only last 100 measurements per query type
      if (this.systemMetrics.databaseQueryTimes[metric.name].length > 100) {
        this.systemMetrics.databaseQueryTimes[metric.name].shift();
      }
    }
  }

  // Get metrics for a specific endpoint
  getEndpointMetrics(endpointName: string, timeRange?: number): {
    averageTime: number;
    minTime: number;
    maxTime: number;
    requestCount: number;
    errorCount: number;
    recentTrend: 'improving' | 'degrading' | 'stable';
  } {
    const cutoff = timeRange ? Date.now() - timeRange : 0;
    const endpointMetrics = this.metrics.filter(
      m => m.name === endpointName && m.timestamp > cutoff
    );

    if (endpointMetrics.length === 0) {
      return {
        averageTime: 0,
        minTime: 0,
        maxTime: 0,
        requestCount: 0,
        errorCount: 0,
        recentTrend: 'stable'
      };
    }

    const durations = endpointMetrics.map(m => m.duration);
    const averageTime = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const minTime = Math.min(...durations);
    const maxTime = Math.max(...durations);
    const errorCount = endpointMetrics.filter(m => m.metadata?.error).length;

    // Calculate trend (compare first half vs second half)
    const midpoint = Math.floor(endpointMetrics.length / 2);
    const firstHalf = endpointMetrics.slice(0, midpoint);
    const secondHalf = endpointMetrics.slice(midpoint);
    
    let recentTrend: 'improving' | 'degrading' | 'stable' = 'stable';
    
    if (firstHalf.length > 0 && secondHalf.length > 0) {
      const firstHalfAvg = firstHalf.reduce((sum, m) => sum + m.duration, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum, m) => sum + m.duration, 0) / secondHalf.length;
      const change = (secondHalfAvg - firstHalfAvg) / firstHalfAvg;
      
      if (change > 0.1) recentTrend = 'degrading';
      else if (change < -0.1) recentTrend = 'improving';
    }

    return {
      averageTime,
      minTime,
      maxTime,
      requestCount: endpointMetrics.length,
      errorCount,
      recentTrend
    };
  }

  // Clear old metrics
  clearOldMetrics(olderThan: number): void {
    const cutoff = Date.now() - olderThan;
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
  }

  // Export metrics for external monitoring
  exportMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  // Get system health status
  getHealthStatus(): {
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
  } {
    const stats = this.getStats(300000); // Last 5 minutes
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check response times
    if (stats.averageResponseTime > 2000) {
      issues.push('High average response time');
      recommendations.push('Consider optimizing slow endpoints or adding caching');
    }

    if (stats.p95ResponseTime > 5000) {
      issues.push('High P95 response time');
      recommendations.push('Investigate and optimize slowest 5% of requests');
    }

    // Check error rate
    if (stats.errorRate > 5) {
      issues.push('High error rate');
      recommendations.push('Review error logs and fix failing endpoints');
    }

    // Check for slow endpoints
    const slowEndpoints = stats.slowestEndpoints.filter(e => e.avgTime > 3000);
    if (slowEndpoints.length > 0) {
      issues.push(`${slowEndpoints.length} slow endpoints detected`);
      recommendations.push('Optimize database queries and add appropriate indexes');
    }

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (issues.length > 0) {
      status = stats.errorRate > 10 || stats.averageResponseTime > 5000 ? 'critical' : 'warning';
    }

    return {
      status,
      issues,
      recommendations
    };
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Middleware wrapper for API routes
export function withPerformanceMonitoring(handler: Function, routeName: string) {
  return async (req: any, res: any) => {
    const timer = performanceMonitor.createTimer(
      routeName,
      {
        method: req.method,
        url: req.url
      },
      ['api']
    );

    try {
      const result = await handler(req, res);
      timer.end();
      return result;
    } catch (error) {
      const duration = timer.end();
      performanceMonitor.recordMetric(
        routeName,
        duration,
        { method: req.method, url: req.url, error: true },
        ['api', 'error']
      );
      throw error;
    }
  };
}

// Database query monitoring wrapper
export async function monitorDatabaseQuery<T>(
  queryName: string,
  query: () => Promise<T>
): Promise<T> {
  return performanceMonitor.timeFunction(
    queryName,
    query,
    {},
    ['database']
  );
}
