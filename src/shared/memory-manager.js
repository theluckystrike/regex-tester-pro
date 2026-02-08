// ==========================================================================
// Regex Tester Pro — Memory Management
// MD 20 Agent 1: Memory monitor, WeakRef cache, event listener cleanup
// ==========================================================================

const MemoryManager = (() => {
    'use strict';

    // ── Memory Monitor ──
    class MemoryMonitor {
        constructor() {
            this.snapshots = [];
            this.leakThreshold = 10 * 1024 * 1024; // 10MB growth = potential leak
            this.interval = null;
        }

        takeSnapshot() {
            if (!performance.memory) return null;

            const snapshot = {
                timestamp: Date.now(),
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            };

            this.snapshots.push(snapshot);
            if (this.snapshots.length > 100) this.snapshots.shift();

            return snapshot;
        }

        detectLeak() {
            if (this.snapshots.length < 10) return { detected: false };

            const recent = this.snapshots.slice(-10);
            const oldest = recent[0].usedJSHeapSize;
            const newest = recent[recent.length - 1].usedJSHeapSize;
            const growth = newest - oldest;

            if (growth > this.leakThreshold) {
                return {
                    detected: true,
                    growth,
                    growthMB: (growth / 1024 / 1024).toFixed(2),
                    trend: 'increasing'
                };
            }

            return { detected: false, growth };
        }

        startMonitoring(intervalMs = 30000) {
            this.interval = setInterval(() => {
                this.takeSnapshot();
                const leak = this.detectLeak();
                if (leak.detected) {
                    console.warn('[MemoryMonitor] Potential memory leak:', leak);
                }
            }, intervalMs);
        }

        stopMonitoring() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
        }

        getReport() {
            const latest = this.snapshots[this.snapshots.length - 1];
            return {
                currentUsageMB: latest ? (latest.usedJSHeapSize / 1024 / 1024).toFixed(2) : 'N/A',
                heapLimitMB: latest ? (latest.jsHeapSizeLimit / 1024 / 1024).toFixed(2) : 'N/A',
                snapshotCount: this.snapshots.length,
                leakStatus: this.detectLeak()
            };
        }
    }

    // ── SoftCache — WeakRef-based, GC-friendly ──
    class SoftCache {
        constructor(maxSize = 100) {
            this.cache = new Map();
            this.maxSize = maxSize;
        }

        set(key, value) {
            if (this.cache.size >= this.maxSize) this.cleanup();
            if (typeof value === 'object' && value !== null) {
                this.cache.set(key, new WeakRef(value));
            } else {
                // Primitives can't be WeakRef'd, store directly
                this.cache.set(key, { deref: () => value, _primitive: true });
            }
        }

        get(key) {
            const ref = this.cache.get(key);
            if (!ref) return undefined;

            const value = ref.deref();
            if (value === undefined && !ref._primitive) {
                this.cache.delete(key); // GC'd, remove entry
            }
            return value;
        }

        cleanup() {
            for (const [key, ref] of this.cache) {
                if (!ref._primitive && ref.deref() === undefined) {
                    this.cache.delete(key);
                }
            }
        }

        get size() {
            return this.cache.size;
        }
    }

    // ── Event Manager — tracks and cleans up all listeners ──
    class EventManager {
        constructor() {
            this.listeners = [];
        }

        add(target, event, handler, options) {
            this.listeners.push({ target, event, handler, options });
            target.addEventListener(event, handler, options);
        }

        remove(target, event, handler) {
            const idx = this.listeners.findIndex(
                l => l.target === target && l.event === event && l.handler === handler
            );
            if (idx !== -1) {
                target.removeEventListener(event, handler);
                this.listeners.splice(idx, 1);
            }
        }

        removeAll() {
            for (const { target, event, handler, options } of this.listeners) {
                target.removeEventListener(event, handler, options);
            }
            this.listeners.length = 0;
        }

        get count() {
            return this.listeners.length;
        }
    }

    return {
        MemoryMonitor,
        SoftCache,
        EventManager
    };
})();
