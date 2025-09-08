// High-performance caching system for WECON
// Supports in-memory caching with TTL and Redis-like functionality

interface CacheItem<T> {
  value: T;
  expiresAt: number;
  createdAt: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  evictions: number;
  totalItems: number;
  memoryUsage: number;
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    evictions: 0,
    totalItems: 0,
    memoryUsage: 0
  };
  private maxItems: number;
  private defaultTTL: number;
  private cleanupInterval: NodeJS.Timeout;

  constructor(maxItems = 10000, defaultTTL = 300000) { // 5 minutes default
    this.maxItems = maxItems;
    this.defaultTTL = defaultTTL;
    
    // Cleanup expired items every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  // Get item from cache
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.evictions++;
      return null;
    }

    // Update access stats
    item.accessCount++;
    item.lastAccessed = Date.now();
    this.stats.hits++;
    
    return item.value;
  }

  // Set item in cache
  set<T>(key: string, value: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    const now = Date.now();

    const item: CacheItem<T> = {
      value,
      expiresAt,
      createdAt: now,
      accessCount: 0,
      lastAccessed: now
    };

    // Check if we need to evict items
    if (this.cache.size >= this.maxItems && !this.cache.has(key)) {
      this.evictLRU();
    }

    this.cache.set(key, item);
    this.stats.sets++;
    this.updateStats();
  }

  // Delete item from cache
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.stats.deletes++;
      this.updateStats();
    }
    return deleted;
  }

  // Check if key exists
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
    this.stats.deletes += this.stats.totalItems;
    this.updateStats();
  }

  // Get cache statistics
  getStats(): CacheStats {
    this.updateStats();
    return { ...this.stats };
  }

  // Get all keys
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }

  // Cleanup expired items
  private cleanup(): void {
    const now = Date.now();
    let evicted = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
        evicted++;
      }
    }

    this.stats.evictions += evicted;
    this.updateStats();
  }

  // Evict least recently used item
  private evictLRU(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < oldestTime) {
        oldestTime = item.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  // Update statistics
  private updateStats(): void {
    this.stats.totalItems = this.cache.size;
    this.stats.memoryUsage = this.estimateMemoryUsage();
  }

  // Estimate memory usage
  private estimateMemoryUsage(): number {
    let size = 0;
    for (const [key, item] of this.cache.entries()) {
      size += key.length * 2; // String characters are 2 bytes
      size += JSON.stringify(item.value).length * 2;
      size += 64; // Estimated overhead per item
    }
    return size;
  }

  // Destroy cache and cleanup
  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }
}

// Cache manager with multiple cache instances
class CacheManager {
  private caches = new Map<string, MemoryCache>();
  private defaultCache: MemoryCache;

  constructor() {
    this.defaultCache = new MemoryCache();
    this.caches.set('default', this.defaultCache);
  }

  // Get or create cache instance
  getCache(name: string = 'default'): MemoryCache {
    if (!this.caches.has(name)) {
      this.caches.set(name, new MemoryCache());
    }
    return this.caches.get(name)!;
  }

  // Create specialized cache for different data types
  createCache(name: string, maxItems?: number, defaultTTL?: number): MemoryCache {
    const cache = new MemoryCache(maxItems, defaultTTL);
    this.caches.set(name, cache);
    return cache;
  }

  // Get all cache statistics
  getAllStats(): Record<string, CacheStats> {
    const stats: Record<string, CacheStats> = {};
    for (const [name, cache] of this.caches.entries()) {
      stats[name] = cache.getStats();
    }
    return stats;
  }

  // Clear all caches
  clearAll(): void {
    for (const cache of this.caches.values()) {
      cache.clear();
    }
  }

  // Destroy all caches
  destroy(): void {
    for (const cache of this.caches.values()) {
      cache.destroy();
    }
    this.caches.clear();
  }
}

// Global cache manager instance
export const cacheManager = new CacheManager();

// Specialized caches for different modules
export const userCache = cacheManager.createCache('users', 5000, 600000); // 10 minutes
export const eventCache = cacheManager.createCache('events', 1000, 1800000); // 30 minutes
export const ticketCache = cacheManager.createCache('tickets', 2000, 300000); // 5 minutes
export const sessionCache = cacheManager.createCache('sessions', 3000, 900000); // 15 minutes
export const analyticsCache = cacheManager.createCache('analytics', 500, 120000); // 2 minutes

// Cache key generators
export const CacheKeys = {
  user: (id: string) => `user:${id}`,
  userByEmail: (email: string) => `user:email:${email}`,
  event: (id: string) => `event:${id}`,
  eventTickets: (eventId: string) => `event:${eventId}:tickets`,
  session: (id: string) => `session:${id}`,
  sessionsByEvent: (eventId: string) => `sessions:event:${eventId}`,
  checkIns: (timeRange: string) => `checkins:${timeRange}`,
  analytics: (type: string, timeRange: string) => `analytics:${type}:${timeRange}`,
  notifications: (userId: string) => `notifications:${userId}`,
  digitalSignage: (displayId: string) => `signage:${displayId}`
};

// Cache decorators for API functions
export function cached<T extends (...args: any[]) => Promise<any>>(
  cache: MemoryCache,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl?: number
) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: Parameters<T>) {
      const key = keyGenerator(...args);
      
      // Try to get from cache first
      let result = cache.get(key);
      if (result !== null) {
        return result;
      }

      // Execute original method
      result = await method.apply(this, args);
      
      // Cache the result
      if (result !== null && result !== undefined) {
        cache.set(key, result, ttl);
      }

      return result;
    };

    return descriptor;
  };
}

// Helper function for cache warming
export async function warmCache() {
  console.log('Warming up caches...');
  
  try {
    // Warm up frequently accessed data
    // This would typically be called during application startup
    
    // Example: Pre-load active events
    // const events = await prisma.event.findMany({ where: { isActive: true } });
    // events.forEach(event => {
    //   eventCache.set(CacheKeys.event(event.id), event);
    // });

    console.log('Cache warming completed');
  } catch (error) {
    console.error('Cache warming failed:', error);
  }
}

// Cache monitoring and health check
export function getCacheHealth() {
  const allStats = cacheManager.getAllStats();
  const totalHits = Object.values(allStats).reduce((sum, stats) => sum + stats.hits, 0);
  const totalMisses = Object.values(allStats).reduce((sum, stats) => sum + stats.misses, 0);
  const hitRate = totalHits / (totalHits + totalMisses) || 0;

  return {
    hitRate: Math.round(hitRate * 100),
    totalItems: Object.values(allStats).reduce((sum, stats) => sum + stats.totalItems, 0),
    totalMemoryUsage: Object.values(allStats).reduce((sum, stats) => sum + stats.memoryUsage, 0),
    cacheStats: allStats,
    health: hitRate > 0.7 ? 'GOOD' : hitRate > 0.5 ? 'FAIR' : 'POOR'
  };
}
