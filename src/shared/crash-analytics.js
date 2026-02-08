// ==========================================================================
// Regex Tester Pro — Crash Analytics & Monitoring
// MD 11: Error telemetry, crash reporting, health monitoring
// ==========================================================================

const CrashAnalytics = (() => {
    'use strict';

    const MAX_CRASH_LOGS = 50;
    const SEVERITY_LEVELS = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high', CRITICAL: 'critical' };

    async function logCrash(error, context = {}) {
        try {
            const { crashLogs } = await chrome.storage.local.get('crashLogs');
            const logs = crashLogs || [];

            logs.push({
                message: error.message || String(error),
                stack: error.stack || null,
                severity: context.severity || SEVERITY_LEVELS.MEDIUM,
                component: context.component || 'unknown',
                action: context.action || 'unknown',
                version: chrome.runtime.getManifest().version,
                timestamp: Date.now(),
                userAgent: navigator.userAgent
            });

            // Cap at MAX_CRASH_LOGS
            if (logs.length > MAX_CRASH_LOGS) {
                logs.splice(0, logs.length - MAX_CRASH_LOGS);
            }

            await chrome.storage.local.set({ crashLogs: logs });
        } catch (e) {
            console.error('[CrashAnalytics] Failed to log crash:', e);
        }
    }

    async function getHealthReport() {
        const { crashLogs, usage } = await chrome.storage.local.get(['crashLogs', 'usage']);
        const logs = crashLogs || [];
        const last24h = Date.now() - 86400000;
        const recentCrashes = logs.filter(l => l.timestamp > last24h);

        return {
            totalCrashes: logs.length,
            recentCrashes: recentCrashes.length,
            criticalCrashes: recentCrashes.filter(l => l.severity === SEVERITY_LEVELS.CRITICAL).length,
            mostFrequentError: getMostFrequent(logs.map(l => l.message)),
            lastCrash: logs.length > 0 ? logs[logs.length - 1] : null,
            extensionVersion: chrome.runtime.getManifest().version,
            uptimeSessions: usage?.sessionCount || 0
        };
    }

    function getMostFrequent(arr) {
        if (arr.length === 0) return null;
        const counts = {};
        arr.forEach(item => { counts[item] = (counts[item] || 0) + 1; });
        return Object.entries(counts).sort(([, a], [, b]) => b - a)[0]?.[0] || null;
    }

    async function clearCrashLogs() {
        await chrome.storage.local.set({ crashLogs: [] });
    }

    // Global error boundary installer
    function installCrashHandler() {
        if (typeof window !== 'undefined') {
            window.addEventListener('error', (event) => {
                logCrash(event.error || new Error(event.message), {
                    component: 'popup',
                    action: 'uncaught_error',
                    severity: SEVERITY_LEVELS.HIGH
                });
            });

            window.addEventListener('unhandledrejection', (event) => {
                logCrash(event.reason || new Error('Unhandled rejection'), {
                    component: 'popup',
                    action: 'unhandled_rejection',
                    severity: SEVERITY_LEVELS.HIGH
                });
            });
        }
    }

    return {
        SEVERITY_LEVELS,
        logCrash,
        getHealthReport,
        clearCrashLogs,
        installCrashHandler
    };
})();
