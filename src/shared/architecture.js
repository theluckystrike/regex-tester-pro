// ==========================================================================
// Regex Tester Pro — MV3 Architecture Patterns
// MD 12: Service worker lifecycle, message bus, alarm-based scheduling
// ==========================================================================

const Architecture = (() => {
    'use strict';

    // ── Message Bus (standardized message passing) ──
    const MESSAGE_TYPES = {
        GET_LICENSE_STATUS: 'get_license_status',
        VALIDATE_LICENSE: 'validate_license',
        LOG_EVENT: 'log_event',
        GET_SETTINGS: 'get_settings',
        SAVE_SETTINGS: 'save_settings',
        TEST_REGEX_SELECTION: 'test_regex_selection',
        REFRESH_LICENSE: 'refresh_license'
    };

    // ── Centralized message handler for service worker ──
    function setupMessageRouter(handlers = {}) {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (!message || !message.action) {
                sendResponse({ error: 'Invalid message format' });
                return false;
            }

            const handler = handlers[message.action];
            if (!handler) {
                sendResponse({ error: `Unknown action: ${message.action}` });
                return false;
            }

            // Handle async handlers
            const result = handler(message, sender);
            if (result instanceof Promise) {
                result
                    .then(data => sendResponse({ success: true, data }))
                    .catch(err => sendResponse({ success: false, error: err.message }));
                return true; // Keep message channel open for async
            }

            sendResponse({ success: true, data: result });
            return false;
        });
    }

    // ── Alarm-based scheduling (replaces setInterval in MV3) ──
    const ALARMS = {
        LICENSE_REFRESH: { name: 'license-refresh', periodMinutes: 1440 },    // 24h
        AI_QUOTA_RESET: { name: 'ai-quota-reset', periodMinutes: 1440 },       // 24h
        ANALYTICS_FLUSH: { name: 'analytics-flush', periodMinutes: 360 },      // 6h
        CLEANUP: { name: 'data-cleanup', periodMinutes: 10080 }                // 7 days
    };

    async function setupAlarms() {
        for (const alarm of Object.values(ALARMS)) {
            const existing = await chrome.alarms.get(alarm.name);
            if (!existing) {
                chrome.alarms.create(alarm.name, {
                    delayInMinutes: 1,
                    periodInMinutes: alarm.periodMinutes
                });
            }
        }
    }

    function setupAlarmHandlers(handlers = {}) {
        chrome.alarms.onAlarm.addListener((alarm) => {
            const handler = handlers[alarm.name];
            if (handler) {
                handler().catch(err => console.error(`[Alarm ${alarm.name}] Error:`, err));
            }
        });
    }

    // ── Service worker lifecycle helpers ──
    function onInstall(callback) {
        chrome.runtime.onInstalled.addListener(async (details) => {
            if (details.reason === 'install') {
                await callback(details);
            }
        });
    }

    function onUpdate(callback) {
        chrome.runtime.onInstalled.addListener(async (details) => {
            if (details.reason === 'update') {
                await callback(details);
            }
        });
    }

    return {
        MESSAGE_TYPES,
        ALARMS,
        setupMessageRouter,
        setupAlarms,
        setupAlarmHandlers,
        onInstall,
        onUpdate
    };
})();
