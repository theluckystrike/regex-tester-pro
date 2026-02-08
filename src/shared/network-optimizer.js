// ==========================================================================
// Regex Tester Pro — Network Optimizer
// MD 20 Agent 4: Request batching, response caching, retry with backoff
// ==========================================================================

const NetworkOptimizer = (() => {
    'use strict';

    // ── Request Batcher — combine multiple requests into one ──
    class RequestBatcher {
        constructor(batchFn, options = {}) {
            this.batchFn = batchFn;
            this.maxBatchSize = options.maxBatchSize || 10;
            this.maxWaitMs = options.maxWaitMs || 100;
            this.pending = [];
            this.timeout = null;
        }

        add(item) {
            return new Promise((resolve, reject) => {
                this.pending.push({ item, resolve, reject });

                if (this.pending.length >= this.maxBatchSize) {
                    this.flush();
                } else if (!this.timeout) {
                    this.timeout = setTimeout(() => this.flush(), this.maxWaitMs);
                }
            });
        }

        async flush() {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }

            if (this.pending.length === 0) return;

            const batch = this.pending;
            this.pending = [];

            try {
                const items = batch.map(b => b.item);
                const results = await this.batchFn(items);
                batch.forEach((b, i) => b.resolve(results[i]));
            } catch (error) {
                batch.forEach(b => b.reject(error));
            }
        }
    }

    // ── Cache Manager — response caching with expiration ──
    class CacheManager {
        constructor() {
            this.memoryCache = new Map();
        }

        async get(url, options = {}) {
            const { maxAge = 3600000, forceRefresh = false } = options;

            if (!forceRefresh) {
                // Check memory cache first (fastest)
                const memCached = this.memoryCache.get(url);
                if (memCached && Date.now() - memCached.timestamp < maxAge) {
                    return memCached.data;
                }

                // Then check storage cache
                const { networkCache = {} } = await chrome.storage.local.get('networkCache');
                const storageCached = networkCache[url];
                if (storageCached && Date.now() - storageCached.timestamp < maxAge) {
                    this.memoryCache.set(url, storageCached); // Promote to memory
                    return storageCached.data;
                }
            }

            return this.fetchAndCache(url);
        }

        async fetchAndCache(url) {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            const entry = { data, timestamp: Date.now() };

            // Save to both caches
            this.memoryCache.set(url, entry);

            const { networkCache = {} } = await chrome.storage.local.get('networkCache');
            networkCache[url] = entry;

            // Limit storage cache to 50 entries
            const keys = Object.keys(networkCache);
            if (keys.length > 50) {
                const sorted = keys.sort((a, b) => networkCache[a].timestamp - networkCache[b].timestamp);
                sorted.slice(0, 10).forEach(k => delete networkCache[k]);
            }

            await chrome.storage.local.set({ networkCache });
            return data;
        }

        async clear() {
            this.memoryCache.clear();
            await chrome.storage.local.remove('networkCache');
        }
    }

    // ── Retry with Exponential Backoff ──
    async function fetchWithRetry(url, options = {}, retries = 3) {
        const { timeout = 5000, ...fetchOptions } = options;

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);

                const response = await fetch(url, {
                    ...fetchOptions,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                return response;
            } catch (error) {
                if (attempt === retries) throw error;

                // Exponential backoff: 1s, 2s, 4s
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    // ── Request Deduplication ──
    const inflightRequests = new Map();

    async function deduplicatedFetch(url, options = {}) {
        const key = `${options.method || 'GET'}:${url}`;

        if (inflightRequests.has(key)) {
            return inflightRequests.get(key); // Return existing promise
        }

        const promise = fetch(url, options).finally(() => {
            inflightRequests.delete(key);
        });

        inflightRequests.set(key, promise);
        return promise;
    }

    return {
        RequestBatcher,
        CacheManager,
        fetchWithRetry,
        deduplicatedFetch
    };
})();
