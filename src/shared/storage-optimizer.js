// ==========================================================================
// Regex Tester Pro — Storage Optimizer
// MD 20 Agent 2: Batch writes, chunked sync storage, data compression
// ==========================================================================

const StorageOptimizer = (() => {
    'use strict';

    // ── Batch Storage — debounced writes to minimize I/O ──
    class StorageBatch {
        constructor(storage = chrome.storage.local) {
            this.storage = storage;
            this.pending = {};
            this.flushTimer = null;
        }

        set(key, value) {
            this.pending[key] = value;
            this.scheduleFlush();
        }

        scheduleFlush() {
            if (this.flushTimer) return;
            this.flushTimer = setTimeout(() => this.flush(), 500);
        }

        async flush() {
            this.flushTimer = null;
            if (Object.keys(this.pending).length === 0) return;

            const toSave = { ...this.pending };
            this.pending = {};

            try {
                await this.storage.set(toSave);
            } catch (e) {
                // Re-queue on failure
                Object.assign(this.pending, toSave);
                console.error('[StorageBatch] Flush failed:', e);
            }
        }

        async get(keys) {
            const result = {};
            const fetchKeys = [];

            for (const key of (Array.isArray(keys) ? keys : [keys])) {
                if (key in this.pending) {
                    result[key] = this.pending[key];
                } else {
                    fetchKeys.push(key);
                }
            }

            if (fetchKeys.length > 0) {
                const stored = await this.storage.get(fetchKeys);
                Object.assign(result, stored);
            }

            return result;
        }
    }

    // ── Chunked Storage — split large objects for sync storage (8KB/item limit) ──
    class ChunkedStorage {
        constructor(key, storage = chrome.storage.sync) {
            this.key = key;
            this.storage = storage;
            this.CHUNK_SIZE = 8000;
        }

        async set(data) {
            const json = JSON.stringify(data);
            const chunks = [];

            for (let i = 0; i < json.length; i += this.CHUNK_SIZE) {
                chunks.push(json.slice(i, i + this.CHUNK_SIZE));
            }

            const toStore = {
                [`${this.key}_meta`]: { chunks: chunks.length, version: 1 }
            };

            chunks.forEach((chunk, i) => {
                toStore[`${this.key}_${i}`] = chunk;
            });

            await this.storage.set(toStore);
        }

        async get() {
            const metaKey = `${this.key}_meta`;
            const result = await this.storage.get(metaKey);
            const meta = result[metaKey];
            if (!meta) return null;

            const chunkKeys = Array.from({ length: meta.chunks }, (_, i) => `${this.key}_${i}`);
            const chunks = await this.storage.get(chunkKeys);
            const json = chunkKeys.map(k => chunks[k]).join('');

            try {
                return JSON.parse(json);
            } catch (e) {
                console.error('[ChunkedStorage] Parse error:', e);
                return null;
            }
        }
    }

    // ── Data Compression (gzip via CompressionStream API) ──
    async function compressData(data) {
        try {
            const json = JSON.stringify(data);
            const blob = new Blob([json]);
            const stream = blob.stream().pipeThrough(new CompressionStream('gzip'));
            const compressedBlob = await new Response(stream).blob();
            const buffer = await compressedBlob.arrayBuffer();
            return btoa(String.fromCharCode(...new Uint8Array(buffer)));
        } catch (e) {
            console.error('[compressData] Failed:', e);
            return JSON.stringify(data); // fallback
        }
    }

    async function decompressData(compressed) {
        try {
            const binary = atob(compressed);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

            const blob = new Blob([bytes]);
            const stream = blob.stream().pipeThrough(new DecompressionStream('gzip'));
            const text = await new Response(stream).text();
            return JSON.parse(text);
        } catch (e) {
            console.error('[decompressData] Failed:', e);
            return null;
        }
    }

    // ── Storage Quota Check ──
    async function getStorageUsage() {
        const bytesInUse = await new Promise(resolve => {
            chrome.storage.local.getBytesInUse(null, resolve);
        });
        const quotaBytes = chrome.storage.local.QUOTA_BYTES || 10485760; // 10MB default

        return {
            bytesUsed: bytesInUse,
            bytesUsedMB: (bytesInUse / 1024 / 1024).toFixed(2),
            quotaMB: (quotaBytes / 1024 / 1024).toFixed(2),
            percentUsed: ((bytesInUse / quotaBytes) * 100).toFixed(1),
            isNearQuota: bytesInUse > quotaBytes * 0.8
        };
    }

    return {
        StorageBatch,
        ChunkedStorage,
        compressData,
        decompressData,
        getStorageUsage
    };
})();
