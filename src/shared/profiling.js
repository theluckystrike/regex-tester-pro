// ==========================================================================
// Regex Tester Pro — Profiling & Performance Budgets
// MD 20 Agent 5: Debug utils, perf marks, budget enforcement
// ==========================================================================

const Profiling = (() => {
    'use strict';

    // ── Performance Budgets ──
    const BUDGETS = {
        timing: {
            popupOpen: 100,          // ms
            contentScriptInit: 50,   // ms
            backgroundWake: 100,     // ms
            regexExec: 10,           // ms for a single regex test
            storageRead: 50,         // ms
            apiResponse: 2000        // ms
        },
        size: {
            background: 100 * 1024,  // bytes
            popup: 150 * 1024,
            content: 50 * 1024,
            total: 500 * 1024
        },
        memory: {
            popup: 50 * 1024 * 1024, // 50MB
            background: 100 * 1024 * 1024
        }
    };

    function checkBudget(category, metric, value) {
        const budget = BUDGETS[category]?.[metric];
        if (!budget) return { ok: true, message: `No budget for ${category}.${metric}` };

        const ok = value <= budget;
        const percent = ((value / budget) * 100).toFixed(1);

        return {
            ok,
            value,
            budget,
            percent: `${percent}%`,
            message: ok
                ? `✓ ${metric}: ${percent}% of budget`
                : `✗ ${metric}: OVER BUDGET (${percent}%)`
        };
    }

    // ── Debug Logger — conditional logging stripped in production ──
    const IS_DEV = !('update_url' in (chrome.runtime.getManifest?.() || {}));

    const debug = {
        log: IS_DEV ? console.log.bind(console, '[RTP]') : () => { },
        warn: IS_DEV ? console.warn.bind(console, '[RTP]') : () => { },
        error: console.error.bind(console, '[RTP]'), // Always log errors
        time: IS_DEV ? console.time.bind(console) : () => { },
        timeEnd: IS_DEV ? console.timeEnd.bind(console) : () => { },

        // Async function measurement
        async measure(name, fn) {
            if (!IS_DEV) return fn();

            const start = performance.now();
            try {
                return await fn();
            } finally {
                const duration = performance.now() - start;
                const budget = checkBudget('timing', name, duration);
                console.log(`[RTP] ${name}: ${duration.toFixed(2)}ms ${budget.ok ? '✓' : '⚠️ OVER BUDGET'}`);
            }
        }
    };

    // ── Performance Mark Helpers ──
    function mark(name) {
        performance.mark(`rtp-${name}`);
    }

    function measureBetween(startMark, endMark, label) {
        performance.mark(`rtp-${endMark}`);
        try {
            performance.measure(
                label || `rtp:${startMark}->${endMark}`,
                `rtp-${startMark}`,
                `rtp-${endMark}`
            );
        } catch (e) {
            // Start mark doesn't exist
        }
    }

    function getAllMeasures() {
        return performance.getEntriesByType('measure')
            .filter(m => m.name.startsWith('rtp:'))
            .map(m => ({
                name: m.name,
                duration: `${m.duration.toFixed(2)}ms`
            }));
    }

    // ── Full Performance Report ──
    async function getFullReport() {
        const memory = performance.memory ? {
            usedMB: (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
            totalMB: (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2),
            limitMB: (performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2),
            budgetCheck: checkBudget('memory', 'popup', performance.memory.usedJSHeapSize)
        } : { available: false };

        // Storage check
        let storage = {};
        try {
            const bytesInUse = await new Promise(r => chrome.storage.local.getBytesInUse(null, r));
            storage = {
                bytesUsed: bytesInUse,
                mbUsed: (bytesInUse / 1024 / 1024).toFixed(2),
                percentOfQuota: ((bytesInUse / 10485760) * 100).toFixed(1)
            };
        } catch (e) {
            storage = { error: e.message };
        }

        return {
            memory,
            storage,
            measures: getAllMeasures(),
            version: chrome.runtime.getManifest?.()?.version || 'unknown',
            isDev: IS_DEV,
            timestamp: new Date().toISOString()
        };
    }

    // ── Pre-Release Performance Checklist ──
    const CHECKLIST = [
        { id: 'no_eval', label: 'No eval() usage', category: 'security' },
        { id: 'no_global_leaks', label: 'No global variable pollution', category: 'memory' },
        { id: 'listeners_cleaned', label: 'Event listeners cleaned up on unload', category: 'memory' },
        { id: 'debounced_handlers', label: 'Input/scroll handlers debounced or throttled', category: 'performance' },
        { id: 'batch_dom', label: 'DOM operations batched (reads then writes)', category: 'performance' },
        { id: 'lazy_init', label: 'Heavy modules lazy-initialized', category: 'performance' },
        { id: 'storage_batched', label: 'Storage writes batched/debounced', category: 'storage' },
        { id: 'network_cached', label: 'API responses cached with expiration', category: 'network' },
        { id: 'sw_fast_wake', label: 'Service worker cold start < 100ms', category: 'mv3' },
        { id: 'sw_state_persisted', label: 'State persisted to survive SW restarts', category: 'mv3' }
    ];

    return {
        BUDGETS,
        checkBudget,
        debug,
        mark,
        measureBetween,
        getAllMeasures,
        getFullReport,
        CHECKLIST,
        IS_DEV
    };
})();
