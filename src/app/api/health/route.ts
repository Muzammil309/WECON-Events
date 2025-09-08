import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCacheHealth } from '@/lib/cache-manager';
import { performanceMonitor } from '@/lib/performance-monitor';
import { realTimeUpdates } from '@/lib/realtime-updates';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  const detailed = searchParams.get('detailed') === 'true';

  try {
    // Basic health checks
    const healthChecks = await Promise.allSettled([
      checkDatabase(),
      checkCache(),
      checkPerformance(),
      checkRealTimeSystem(),
      checkStorage(),
      checkExternalServices()
    ]);

    const [
      databaseResult,
      cacheResult,
      performanceResult,
      realTimeResult,
      storageResult,
      externalResult
    ] = healthChecks;

    // Compile health status
    const health = {
      status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: Date.now() - startTime,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      components: {
        database: getResultStatus(databaseResult),
        cache: getResultStatus(cacheResult),
        performance: getResultStatus(performanceResult),
        realTime: getResultStatus(realTimeResult),
        storage: getResultStatus(storageResult),
        external: getResultStatus(externalResult)
      },
      ...(detailed && {
        details: {
          database: getResultValue(databaseResult),
          cache: getResultValue(cacheResult),
          performance: getResultValue(performanceResult),
          realTime: getResultValue(realTimeResult),
          storage: getResultValue(storageResult),
          external: getResultValue(externalResult)
        }
      })
    };

    // Determine overall status
    const componentStatuses = Object.values(health.components);
    if (componentStatuses.some(status => status === 'unhealthy')) {
      health.status = 'unhealthy';
    } else if (componentStatuses.some(status => status === 'degraded')) {
      health.status = 'degraded';
    }

    // Return appropriate HTTP status
    const httpStatus = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503;

    return NextResponse.json(health, { status: httpStatus });

  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      responseTime: Date.now() - startTime
    }, { status: 503 });
  } finally {
    await prisma.$disconnect();
  }
}

// Database health check
async function checkDatabase() {
  const start = Date.now();
  
  try {
    // Test basic connectivity
    await prisma.$queryRaw`SELECT 1`;
    
    // Test key tables
    const [userCount, eventCount, orderCount] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.order.count()
    ]);

    const responseTime = Date.now() - start;

    return {
      status: responseTime < 1000 ? 'healthy' : 'degraded',
      responseTime,
      details: {
        connected: true,
        userCount,
        eventCount,
        orderCount,
        tablesAccessible: true
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : 'Database connection failed',
      details: {
        connected: false
      }
    };
  }
}

// Cache health check
async function checkCache() {
  try {
    const cacheHealth = getCacheHealth();
    
    return {
      status: cacheHealth.health === 'GOOD' ? 'healthy' : 
              cacheHealth.health === 'FAIR' ? 'degraded' : 'unhealthy',
      details: {
        hitRate: cacheHealth.hitRate,
        totalItems: cacheHealth.totalItems,
        memoryUsage: cacheHealth.totalMemoryUsage,
        health: cacheHealth.health
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: 'Cache system error',
      details: { available: false }
    };
  }
}

// Performance monitoring health check
async function checkPerformance() {
  try {
    const stats = performanceMonitor.getStats(300000); // Last 5 minutes
    const healthStatus = performanceMonitor.getHealthStatus();
    
    return {
      status: healthStatus.status === 'healthy' ? 'healthy' :
              healthStatus.status === 'warning' ? 'degraded' : 'unhealthy',
      details: {
        averageResponseTime: stats.averageResponseTime,
        p95ResponseTime: stats.p95ResponseTime,
        errorRate: stats.errorRate,
        totalRequests: stats.totalRequests,
        issues: healthStatus.issues,
        recommendations: healthStatus.recommendations
      }
    };
  } catch (error) {
    return {
      status: 'degraded',
      error: 'Performance monitoring unavailable',
      details: { available: false }
    };
  }
}

// Real-time system health check
async function checkRealTimeSystem() {
  try {
    const subscriberCount = realTimeUpdates.getSubscriberCount();
    const activeModules = realTimeUpdates.getActiveModules();
    
    return {
      status: 'healthy',
      details: {
        subscriberCount,
        activeModules: activeModules.length,
        modules: activeModules
      }
    };
  } catch (error) {
    return {
      status: 'degraded',
      error: 'Real-time system error',
      details: { available: false }
    };
  }
}

// Storage health check
async function checkStorage() {
  try {
    // Check if Supabase storage is configured
    const hasStorageConfig = !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    if (!hasStorageConfig) {
      return {
        status: 'degraded',
        details: {
          configured: false,
          message: 'Storage service not configured'
        }
      };
    }

    // In a real implementation, you might test actual storage operations
    return {
      status: 'healthy',
      details: {
        configured: true,
        provider: 'Supabase',
        available: true
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: 'Storage system error',
      details: { available: false }
    };
  }
}

// External services health check
async function checkExternalServices() {
  const services = {
    supabase: checkSupabaseConnection(),
    // Add other external services here
  };

  try {
    const results = await Promise.allSettled(Object.values(services));
    const serviceNames = Object.keys(services);
    
    const serviceStatuses = results.map((result, index) => ({
      name: serviceNames[index],
      status: result.status === 'fulfilled' ? 'healthy' : 'unhealthy',
      ...(result.status === 'rejected' && { error: result.reason })
    }));

    const allHealthy = serviceStatuses.every(s => s.status === 'healthy');
    const anyUnhealthy = serviceStatuses.some(s => s.status === 'unhealthy');

    return {
      status: allHealthy ? 'healthy' : anyUnhealthy ? 'degraded' : 'healthy',
      details: {
        services: serviceStatuses,
        totalServices: serviceStatuses.length,
        healthyServices: serviceStatuses.filter(s => s.status === 'healthy').length
      }
    };
  } catch (error) {
    return {
      status: 'degraded',
      error: 'External services check failed',
      details: { available: false }
    };
  }
}

// Check Supabase connection
async function checkSupabaseConnection() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Supabase URL not configured');
  }

  // Simple connectivity test
  const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
    headers: {
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`
    }
  });

  if (!response.ok) {
    throw new Error(`Supabase connection failed: ${response.status}`);
  }

  return { connected: true };
}

// Helper functions
function getResultStatus(result: PromiseSettledResult<any>): 'healthy' | 'degraded' | 'unhealthy' {
  if (result.status === 'rejected') return 'unhealthy';
  return result.value?.status || 'unhealthy';
}

function getResultValue(result: PromiseSettledResult<any>): any {
  if (result.status === 'rejected') {
    return { error: result.reason };
  }
  return result.value;
}

// POST endpoint for running health checks with specific parameters
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { checks = [], detailed = false } = body;

    const results: Record<string, any> = {};

    // Run specific health checks
    if (checks.includes('database') || checks.length === 0) {
      results.database = await checkDatabase();
    }
    
    if (checks.includes('cache') || checks.length === 0) {
      results.cache = await checkCache();
    }
    
    if (checks.includes('performance') || checks.length === 0) {
      results.performance = await checkPerformance();
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      requestedChecks: checks.length > 0 ? checks : ['all'],
      results,
      detailed
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to run health checks' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
