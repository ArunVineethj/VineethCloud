package com.arunvineeth.portfolio.util;

import net.spy.memcached.MemcachedClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.InetSocketAddress;

/**
 * MemcachedUtil – manages a single shared MemcachedClient.
 *
 * Environment variables:
 *   MEMCACHED_HOST – default "memcached"
 *   MEMCACHED_PORT – default "11211"
 *
 * If Memcached is unavailable the client field stays null and all
 * callers must handle that gracefully (fall back to MySQL).
 */
public class MemcachedUtil {

    private static final Logger log = LoggerFactory.getLogger(MemcachedUtil.class);

    /** Default TTL (seconds) for cached portfolio data = 5 minutes */
    public static final int DEFAULT_TTL = 300;

    private static MemcachedClient client;

    static {
        String host = getEnv("MEMCACHED_HOST", "memcached");
        int    port = Integer.parseInt(getEnv("MEMCACHED_PORT", "11211"));
        try {
            client = new MemcachedClient(new InetSocketAddress(host, port));
            log.info("Connected to Memcached at {}:{}", host, port);
        } catch (IOException e) {
            log.warn("Could not connect to Memcached at {}:{} – caching disabled. {}", host, port, e.getMessage());
            client = null;
        }
    }

    /** Returns the shared client, or null if unavailable. */
    public static MemcachedClient getClient() {
        return client;
    }

    /**
     * Store a value.
     * @param key  cache key
     * @param ttl  time-to-live in seconds
     * @param value serialisable object to cache
     */
    public static void set(String key, int ttl, Object value) {
        if (client == null) return;
        try {
            client.set(key, ttl, value);
        } catch (Exception e) {
            log.warn("Memcached SET failed for key '{}': {}", key, e.getMessage());
        }
    }

    /**
     * Retrieve a value.
     * @return the cached object, or null on miss / error.
     */
    public static Object get(String key) {
        if (client == null) return null;
        try {
            return client.get(key);
        } catch (Exception e) {
            log.warn("Memcached GET failed for key '{}': {}", key, e.getMessage());
            return null;
        }
    }

    /**
     * Delete a cache entry (cache invalidation).
     */
    public static void delete(String key) {
        if (client == null) return;
        try {
            client.delete(key);
            log.info("Memcached: deleted key '{}'", key);
        } catch (Exception e) {
            log.warn("Memcached DELETE failed for key '{}': {}", key, e.getMessage());
        }
    }

    private static String getEnv(String key, String defaultValue) {
        String value = System.getenv(key);
        return (value != null && !value.isBlank()) ? value : defaultValue;
    }

    private MemcachedUtil() { /* utility class */ }
}
