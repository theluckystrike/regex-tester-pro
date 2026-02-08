// ==========================================================================
// Regex Tester Pro — Service Worker Optimizer
// MD 20 Agent 3: Persistent state, alarm scheduler, cold start prevention
// ==========================================================================

const ServiceWorkerOptimizer = (() => {
    'use strict';

    // ── Persistent State — survives service worker restarts (MV3) ──
    class PersistentState {
        constructor(key) {
            this.key = key;
            this.state = null;
            this.saveTimer = null;
        }

        async init() {
            const result = await chrome.storage.local.get(this.key);
            this.state = result[this.key] || this._defaults();
            return this.state;
        }

        _defaults() {
            return { settings: {}, cache: {}, lastUpdated: null };
        }

        async get(path) {
            if (!this.state) await this.init();
            return path.split('.').reduce((o, k) => o?.[k], this.state);
        }

        async set(path, value) {
            if (!this.state) await this.init();

            const keys = path.split('.');
            const last = keys.pop();
            const target = keys.reduce((o, k) => o[k] = o[k] || {}, this.state);
            target[last] = value;
            this.state.lastUpdated = Date.now();

            // Debounce saves (1s)
            clearTimeout(this.saveTimer);
            this.saveTimer = setTimeout(() => this.save(), 1000);
        }

        async save() {
            await chrome.storage.local.set({ [this.key]: this.state });
        }
    }

    // ── Alarm Scheduler — single alarm + task queue (instead of many alarms) ──
    class AlarmScheduler {
        constructor(alarmName = 'task-processor') {
            this.alarmName = alarmName;
            this.tasks = [];
            this.handlers = {};
        }

        async init() {
            const { pendingTasks } = await chrome.storage.local.get('pendingTasks');
            this.tasks = pendingTasks || [];

            chrome.alarms.onAlarm.addListener(alarm => {
                if (alarm.name === this.alarmName) this.processTasks();
            });

            if (this.tasks.length > 0) this.scheduleNext();
        }

        registerHandler(type, handler) {
            this.handlers[type] = handler;
        }

        async addTask(type, data = {}, delayMs = 0) {
            this.tasks.push({
                type,
                data,
                scheduledFor: Date.now() + delayMs,
                addedAt: Date.now()
            });
            this.tasks.sort((a, b) => a.scheduledFor - b.scheduledFor);
            await this.persist();
            this.scheduleNext();
        }

        scheduleNext() {
            if (this.tasks.length === 0) return;
            const next = this.tasks[0];
            const delayMin = Math.max(1, (next.scheduledFor - Date.now()) / 60000);
            chrome.alarms.create(this.alarmName, { delayInMinutes: delayMin });
        }

        async processTasks() {
            const now = Date.now();
            const due = this.tasks.filter(t => t.scheduledFor <= now);
            this.tasks = this.tasks.filter(t => t.scheduledFor > now);

            for (const task of due) {
                const handler = this.handlers[task.type];
                if (handler) {
                    try { await handler(task.data); }
                    catch (e) { console.error(`[AlarmScheduler] Task ${task.type} failed:`, e); }
                }
            }

            await this.persist();
            this.scheduleNext();
        }

        async persist() {
            await chrome.storage.local.set({ pendingTasks: this.tasks });
        }
    }

    // ── Cold Start Optimization — precompute critical data on install ──
    function setupColdStartCache(computeFn, cacheKey = 'cachedStartupData') {
        chrome.runtime.onInstalled.addListener(async () => {
            const data = await computeFn();
            await chrome.storage.local.set({ [cacheKey]: data });
        });

        return async function getCachedOrCompute() {
            const result = await chrome.storage.local.get(cacheKey);
            if (result[cacheKey]) return result[cacheKey];

            const data = await computeFn();
            await chrome.storage.local.set({ [cacheKey]: data });
            return data;
        };
    }

    return {
        PersistentState,
        AlarmScheduler,
        setupColdStartCache
    };
})();
