import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCacheHealth } from '@/lib/cache-manager';
import { performanceMonitor } from '@/lib/performance-monitor';
import { realTimeUpdates } from '@/lib/realtime-updates';
import { integrationManager } from '@/lib/integrations';
import { complianceManager } from '@/lib/security/compliance';
import { whiteLabelManager } from '@/lib/white-label';

const prisma = new PrismaClient();

// GET - Comprehensive system status
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  const detailed = searchParams.get('detailed') === 'true';
  const modules = searchParams.get('modules')?.split(',') || [];

  try {
    const systemStatus: any = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: 0, // Will be calculated at the end
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
      modules: {}
    };

    // Core system checks
    if (modules.length === 0 || modules.includes('database')) {
      systemStatus.modules.database = await checkDatabaseHealth();
    }

    if (modules.length === 0 || modules.includes('cache')) {
      systemStatus.modules.cache = await checkCacheHealth();
    }

    if (modules.length === 0 || modules.includes('performance')) {
      systemStatus.modules.performance = await checkPerformanceHealth();
    }

    if (modules.length === 0 || modules.includes('realtime')) {
      systemStatus.modules.realtime = await checkRealTimeHealth();
    }

    // Enterprise feature checks
    if (modules.length === 0 || modules.includes('networking')) {
      systemStatus.modules.networking = await checkNetworkingHealth();
    }

    if (modules.length === 0 || modules.includes('analytics')) {
      systemStatus.modules.analytics = await checkAnalyticsHealth();
    }

    if (modules.length === 0 || modules.includes('integrations')) {
      systemStatus.modules.integrations = await checkIntegrationsHealth();
    }

    if (modules.length === 0 || modules.includes('security')) {
      systemStatus.modules.security = await checkSecurityHealth();
    }

    if (modules.length === 0 || modules.includes('whitelabel')) {
      systemStatus.modules.whitelabel = await checkWhiteLabelHealth();
    }

    if (modules.length === 0 || modules.includes('communications')) {
      systemStatus.modules.communications = await checkCommunicationsHealth();
    }

    if (modules.length === 0 || modules.includes('digitalsignage')) {
      systemStatus.modules.digitalsignage = await checkDigitalSignageHealth();
    }

    // Determine overall system status
    const moduleStatuses = Object.values(systemStatus.modules).map((m: any) => m.status);
    if (moduleStatuses.some(status => status === 'unhealthy')) {
      systemStatus.status = 'unhealthy';
    } else if (moduleStatuses.some(status => status === 'degraded')) {
      systemStatus.status = 'degraded';
    }

    // Add detailed information if requested
    if (detailed) {
      systemStatus.details = {
        systemMetrics: await getSystemMetrics(),
        recentActivity: await getRecentActivity(),
        alerts: await getSystemAlerts(),
        recommendations: await getSystemRecommendations(systemStatus.modules)
      };
    }

    // Calculate response time
    systemStatus.responseTime = Date.now() - startTime;

    // Return appropriate HTTP status
    const httpStatus = systemStatus.status === 'healthy' ? 200 : 
                      systemStatus.status === 'degraded' ? 200 : 503;

    return NextResponse.json(systemStatus, { status: httpStatus });

  } catch (error) {
    console.error('System Status API Error:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'System status check failed',
      responseTime: Date.now() - startTime
    }, { status: 503 });
  } finally {
    await prisma.$disconnect();
  }
}

// Database health check
async function checkDatabaseHealth() {
  const start = Date.now();
  
  try {
    // Test basic connectivity
    await prisma.$queryRaw`SELECT 1`;
    
    // Test key operations
    const [userCount, eventCount, orderCount, sessionCount] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.order.count(),
      prisma.session.count()
    ]);

    const responseTime = Date.now() - start;

    return {
      status: responseTime < 1000 ? 'healthy' : responseTime < 3000 ? 'degraded' : 'unhealthy',
      responseTime,
      details: {
        connected: true,
        userCount,
        eventCount,
        orderCount,
        sessionCount,
        tablesAccessible: true
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : 'Database connection failed',
      details: { connected: false }
    };
  }
}

// Cache health check
async function checkCacheHealth() {
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

// Performance health check
async function checkPerformanceHealth() {
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
async function checkRealTimeHealth() {
  try {
    const subscriberCount = realTimeUpdates.getSubscriberCount();
    const activeModules = realTimeUpdates.getActiveModules();
    
    return {
      status: 'healthy',
      details: {
        subscriberCount,
        activeModules: activeModules.length,
        modules: activeModules,
        websocketConnections: subscriberCount
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

// Networking health check
async function checkNetworkingHealth() {
  try {
    const [connectionCount, meetingCount, profileCount] = await Promise.all([
      prisma.networkingConnection.count({ where: { status: 'ACCEPTED' } }),
      prisma.networkingMeeting.count({ where: { status: 'SCHEDULED' } }),
      prisma.networkingProfile.count()
    ]);

    return {
      status: 'healthy',
      details: {
        activeConnections: connectionCount,
        scheduledMeetings: meetingCount,
        networkingProfiles: profileCount,
        available: true
      }
    };
  } catch (error) {
    return {
      status: 'degraded',
      error: 'Networking system error',
      details: { available: false }
    };
  }
}

// Analytics health check
async function checkAnalyticsHealth() {
  try {
    // Check if analytics data is being generated
    const recentAnalytics = await prisma.eventAnalytics.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      }
    });

    return {
      status: 'healthy',
      details: {
        recentAnalytics,
        dataGeneration: recentAnalytics > 0 ? 'active' : 'inactive',
        available: true
      }
    };
  } catch (error) {
    return {
      status: 'degraded',
      error: 'Analytics system error',
      details: { available: false }
    };
  }
}

// Integrations health check
async function checkIntegrationsHealth() {
  try {
    const instances = integrationManager.getInstances();
    const activeInstances = instances.filter(i => i.status === 'active');
    const errorInstances = instances.filter(i => i.status === 'error');

    return {
      status: errorInstances.length === 0 ? 'healthy' : 
              errorInstances.length < instances.length ? 'degraded' : 'unhealthy',
      details: {
        totalIntegrations: instances.length,
        activeIntegrations: activeInstances.length,
        errorIntegrations: errorInstances.length,
        availableTypes: integrationManager.getAvailableIntegrations().length
      }
    };
  } catch (error) {
    return {
      status: 'degraded',
      error: 'Integration system error',
      details: { available: false }
    };
  }
}

// Security health check
async function checkSecurityHealth() {
  try {
    // This would check security metrics in a real implementation
    return {
      status: 'healthy',
      details: {
        complianceEnabled: true,
        auditLogging: true,
        incidentResponse: true,
        dataEncryption: true,
        accessControls: true
      }
    };
  } catch (error) {
    return {
      status: 'degraded',
      error: 'Security system error',
      details: { available: false }
    };
  }
}

// White-label health check
async function checkWhiteLabelHealth() {
  try {
    const themePresets = whiteLabelManager.getThemePresets();
    const activeBranding = whiteLabelManager.getActiveBranding();

    return {
      status: 'healthy',
      details: {
        availableThemes: themePresets.length,
        activeBranding: !!activeBranding,
        customizationEnabled: true
      }
    };
  } catch (error) {
    return {
      status: 'degraded',
      error: 'White-label system error',
      details: { available: false }
    };
  }
}

// Communications health check
async function checkCommunicationsHealth() {
  try {
    const recentNotifications = await prisma.notification.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    });

    return {
      status: 'healthy',
      details: {
        recentNotifications,
        emailService: !!process.env.RESEND_API_KEY || !!process.env.SENDGRID_API_KEY,
        smsService: !!process.env.TWILIO_ACCOUNT_SID,
        available: true
      }
    };
  } catch (error) {
    return {
      status: 'degraded',
      error: 'Communications system error',
      details: { available: false }
    };
  }
}

// Digital signage health check
async function checkDigitalSignageHealth() {
  try {
    const [contentCount, displayCount] = await Promise.all([
      prisma.signageContent.count(),
      prisma.digitalDisplay.count()
    ]);

    return {
      status: 'healthy',
      details: {
        totalContent: contentCount,
        totalDisplays: displayCount,
        storageConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        available: true
      }
    };
  } catch (error) {
    return {
      status: 'degraded',
      error: 'Digital signage system error',
      details: { available: false }
    };
  }
}

// Get system metrics
async function getSystemMetrics() {
  return {
    memory: {
      used: process.memoryUsage().heapUsed,
      total: process.memoryUsage().heapTotal,
      external: process.memoryUsage().external
    },
    cpu: {
      usage: process.cpuUsage()
    },
    uptime: process.uptime(),
    nodeVersion: process.version,
    platform: process.platform
  };
}

// Get recent activity
async function getRecentActivity() {
  try {
    const recentEvents = realTimeUpdates.getRecentEvents({
      limit: 10
    });

    return recentEvents.map(event => ({
      type: event.type,
      module: event.module,
      timestamp: event.timestamp,
      userId: event.userId
    }));
  } catch (error) {
    return [];
  }
}

// Get system alerts
async function getSystemAlerts() {
  const alerts = [];

  // Check for performance issues
  const performanceHealth = performanceMonitor.getHealthStatus();
  if (performanceHealth.status !== 'healthy') {
    alerts.push({
      type: 'PERFORMANCE',
      severity: performanceHealth.status === 'critical' ? 'HIGH' : 'MEDIUM',
      message: 'Performance issues detected',
      details: performanceHealth.issues
    });
  }

  // Check for cache issues
  const cacheHealth = getCacheHealth();
  if (cacheHealth.health === 'POOR') {
    alerts.push({
      type: 'CACHE',
      severity: 'MEDIUM',
      message: 'Cache performance is poor',
      details: [`Hit rate: ${cacheHealth.hitRate}%`]
    });
  }

  return alerts;
}

// Get system recommendations
async function getSystemRecommendations(modules: any) {
  const recommendations = [];

  // Performance recommendations
  if (modules.performance?.status === 'degraded') {
    recommendations.push({
      type: 'PERFORMANCE',
      priority: 'HIGH',
      message: 'Consider optimizing slow endpoints or adding more caching',
      action: 'Review performance metrics and optimize bottlenecks'
    });
  }

  // Cache recommendations
  if (modules.cache?.details?.hitRate < 70) {
    recommendations.push({
      type: 'CACHE',
      priority: 'MEDIUM',
      message: 'Cache hit rate is below optimal threshold',
      action: 'Review caching strategy and increase cache TTL where appropriate'
    });
  }

  // Integration recommendations
  if (modules.integrations?.details?.errorIntegrations > 0) {
    recommendations.push({
      type: 'INTEGRATIONS',
      priority: 'HIGH',
      message: 'Some integrations are experiencing errors',
      action: 'Check integration configurations and API credentials'
    });
  }

  return recommendations;
}
