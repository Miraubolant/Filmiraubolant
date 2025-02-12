// Définition du type pour les entrées du cache
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class Cache {
  private static instance: Cache;
  private cache: Map<string, CacheEntry<any>>;
  private readonly DEFAULT_EXPIRATION = 5 * 60 * 1000; // 5 minutes par défaut

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  set(key: string, data: any, expiresIn: number = this.DEFAULT_EXPIRATION): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;

    const isExpired = Date.now() > entry.timestamp + entry.expiresIn;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    return this.cache.has(key) && !this.isExpired(key);
  }

  private isExpired(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return true;
    return Date.now() > entry.timestamp + entry.expiresIn;
  }

  clear(): void {
    this.cache.clear();
  }

  clearExpired(): void {
    for (const [key, entry] of this.cache.entries()) {
      if (Date.now() > entry.timestamp + entry.expiresIn) {
        this.cache.delete(key);
      }
    }
  }
}

export const cache = Cache.getInstance();