/**
 * ===========================================
 * REDIS CACHING LAYER (WITH MOCK SUPPORT)
 * ===========================================
 * 
 * This module provides a caching layer that can operate in two modes:
 * 1. MOCK MODE (default for development): Uses in-memory Map
 * 2. REDIS MODE (for production): Uses Upstash Redis
 * 
 * HOW TO GO LIVE WITH UPSTASH REDIS:
 * 1. Create account at https://upstash.com
 * 2. Create a new Redis database
 * 3. Copy the REST URL and Token
 * 4. Update .env file:
 *    - CACHE_MODE="redis"
 *    - UPSTASH_REDIS_REST_URL="https://your-url.upstash.io"
 *    - UPSTASH_REDIS_REST_TOKEN="your-token"
 * 5. Restart the application
 */

// ===========================================
// CACHE KEYS STRUCTURE
// ===========================================
export const CACHE_KEYS = {
  // Product caching
  product: (slug: string) => `product:${slug}`,
  productById: (id: string) => `product:id:${id}`,
  productHot: () => `products:hot`,           // Top 50 selling products
  productFeatured: () => `products:featured`, // Featured products
  productsByCategory: (categoryId: string) => `products:category:${categoryId}`,
  
  // Category caching
  category: (slug: string) => `category:${slug}`,
  categoryById: (id: string) => `category:id:${id}`,
  categoryTree: () => `categories:tree`,
  categoryList: () => `categories:list`,
  
  // User session & cart
  cart: (sessionId: string) => `cart:${sessionId}`,
  userCart: (userId: string) => `cart:user:${userId}`,
  
  // Search results
  searchResults: (query: string, filters: string) => 
    `search:${Buffer.from(query + filters).toString('base64')}`,
  
  // AI recommendations
  recommendations: (userId: string) => `recs:${userId}`,
  
  // Rate limiting
  rateLimit: (ip: string) => `rate:${ip}`,
  
  // Session
  session: (token: string) => `session:${token}`,
  
  // System config
  config: (key: string) => `config:${key}`,
} as const

// ===========================================
// CACHE TTLs (in seconds)
// ===========================================
export const CACHE_TTL = {
  product: 3600,          // 1 hour
  productHot: 300,        // 5 minutes - changes frequently
  productFeatured: 600,   // 10 minutes
  category: 7200,         // 2 hours
  categoryTree: 86400,    // 24 hours - rarely changes
  cart: 604800,           // 7 days
  searchResults: 1800,    // 30 minutes
  recommendations: 3600,  // 1 hour
  session: 2592000,       // 30 days
  rateLimit: 60,          // 1 minute
  config: 3600,           // 1 hour
} as const

// ===========================================
// MOCK CACHE IMPLEMENTATION
// ===========================================
/**
 * In-memory cache for development mode.
 * Stores data in a Map with automatic expiration.
 * 
 * LIMITATIONS vs Real Redis:
 * - Data lost on server restart
 * - Not shared across server instances
 * - No persistence
 * - Limited to single Node.js process
 */
class MockCache {
  private cache = new Map<string, { value: string; expiresAt: number }>()
  
  async get(key: string): Promise<string | null> {
    const item = this.cache.get(key)
    if (!item) return null
    
    // Check expiration
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key)
      return null
    }
    
    return item.value
  }
  
  async set(key: string, value: string, options?: { ex?: number }): Promise<void> {
    const ttl = options?.ex ?? 3600 // Default 1 hour
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + (ttl * 1000),
    })
  }
  
  async setex(key: string, seconds: number, value: string): Promise<void> {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + (seconds * 1000),
    })
  }
  
  async del(key: string): Promise<void> {
    this.cache.delete(key)
  }
  
  async exists(key: string): Promise<number> {
    const item = this.cache.get(key)
    if (!item || Date.now() > item.expiresAt) return 0
    return 1
  }
  
  async incr(key: string): Promise<number> {
    const current = await this.get(key)
    const newValue = (parseInt(current || '0', 10) + 1).toString()
    const item = this.cache.get(key)
    const ttl = item ? Math.max(0, (item.expiresAt - Date.now()) / 1000) : 3600
    await this.setex(key, ttl, newValue)
    return parseInt(newValue, 10)
  }
  
  async expire(key: string, seconds: number): Promise<void> {
    const item = this.cache.get(key)
    if (item) {
      item.expiresAt = Date.now() + (seconds * 1000)
    }
  }
  
  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$')
    const result: string[] = []
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        result.push(key)
      }
    }
    return result
  }
  
  async flushall(): Promise<void> {
    this.cache.clear()
  }
}

// ===========================================
// REDIS CLIENT FACTORY
// ===========================================

/**
 * Creates appropriate cache client based on environment.
 * 
 * In MOCK mode:
 * - Uses MockCache class above
 * - Perfect for local development
 * - No external dependencies
 * 
 * In REDIS mode (production):
 * - Uses @upstash/redis
 * - Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
 */
function createRedisClient() {
  const cacheMode = process.env.CACHE_MODE || 'mock'
  
  if (cacheMode === 'mock') {
    console.log('[Cache] Running in MOCK mode - data stored in memory')
    return new MockCache()
  }
  
  // For production with Upstash Redis
  // Uncomment below when going live:
  /*
  const { Redis } = require('@upstash/redis')
  
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn('[Cache] Redis credentials not found, falling back to mock mode')
    return new MockCache()
  }
  
  console.log('[Cache] Running in REDIS mode - connected to Upstash')
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
  */
  
  // Fallback to mock for now
  console.log('[Cache] Redis mode requested but not configured, using mock')
  return new MockCache()
}

// Create singleton instance
const globalForRedis = globalThis as unknown as {
  redis: MockCache | undefined
}

export const redis = globalForRedis.redis ?? createRedisClient()

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis
}

// ===========================================
// CACHE HELPER FUNCTIONS
// ===========================================

/**
 * Get cached data or fetch from source.
 * Implements cache-aside pattern.
 * 
 * @param key - Cache key
 * @param fetcher - Function to fetch data if not in cache
 * @param ttl - Time to live in seconds
 */
export async function getOrSet<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_TTL.product
): Promise<T> {
  try {
    const cached = await redis.get(key)
    if (cached) {
      return JSON.parse(cached) as T
    }
  } catch (error) {
    console.error('[Cache] Error reading from cache:', error)
  }
  
  // Fetch fresh data
  const data = await fetcher()
  
  try {
    await redis.setex(key, ttl, JSON.stringify(data))
  } catch (error) {
    console.error('[Cache] Error writing to cache:', error)
  }
  
  return data
}

/**
 * Invalidate cache by key.
 * @param key - Cache key to invalidate
 */
export async function invalidateCache(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    console.error('[Cache] Error invalidating cache:', error)
  }
}

/**
 * Invalidate multiple cache keys by pattern.
 * @param pattern - Pattern to match (e.g., "product:*")
 */
export async function invalidateCacheByPattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern)
    for (const key of keys) {
      await redis.del(key)
    }
  } catch (error) {
    console.error('[Cache] Error invalidating cache by pattern:', error)
  }
}

/**
 * Rate limiting helper.
 * Returns true if request should be allowed, false if rate limited.
 * 
 * @param identifier - Usually IP address or user ID
 * @param limit - Max requests per window
 * @param windowSeconds - Time window in seconds
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const key = CACHE_KEYS.rateLimit(identifier)
  
  try {
    const current = await redis.incr(key)
    
    if (current === 1) {
      await redis.expire(key, windowSeconds)
    }
    
    return {
      allowed: current <= limit,
      remaining: Math.max(0, limit - current),
      resetIn: windowSeconds,
    }
  } catch (error) {
    console.error('[Cache] Rate limit check failed:', error)
    return { allowed: true, remaining: limit, resetIn: windowSeconds }
  }
}

export default redis
