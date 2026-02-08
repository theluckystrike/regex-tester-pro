// ==========================================================================
// Regex Tester Pro — Message Bus Architecture
// MD 24 Agent 3: Typed message passing, mediator, request/response
// ==========================================================================

const MessageBus = (() => {
    'use strict';

    // ── Message Types Registry ──
    const MESSAGE_TYPES = {
        // Regex operations
        EXECUTE_REGEX: 'EXECUTE_REGEX',
        REGEX_RESULT: 'REGEX_RESULT',
        VALIDATE_PATTERN: 'VALIDATE_PATTERN',

        // Storage operations
        GET_SETTINGS: 'GET_SETTINGS',
        SAVE_SETTINGS: 'SAVE_SETTINGS',
        SETTINGS_UPDATED: 'SETTINGS_UPDATED',

        // Pattern management
        SAVE_PATTERN: 'SAVE_PATTERN',
        DELETE_PATTERN: 'DELETE_PATTERN',
        GET_PATTERNS: 'GET_PATTERNS',
        PATTERNS_UPDATED: 'PATTERNS_UPDATED',

        // License
        CHECK_LICENSE: 'CHECK_LICENSE',
        LICENSE_STATUS: 'LICENSE_STATUS',

        // Feature flags
        GET_FEATURE_FLAGS: 'GET_FEATURE_FLAGS',

        // Analytics
        TRACK_EVENT: 'TRACK_EVENT',

        // Lifecycle
        EXTENSION_INSTALLED: 'EXTENSION_INSTALLED',
        EXTENSION_UPDATED: 'EXTENSION_UPDATED'
    };

    // ── Message Mediator ──
    class Mediator {
        constructor() {
            this._handlers = new Map();
            this._interceptors = [];
            this._initialized = false;
        }

        initialize() {
            if (this._initialized) return;

            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                if (!message || !message.type) return false;

                const handler = this._handlers.get(message.type);
                if (!handler) return false;

                // Run interceptors
                for (const interceptor of this._interceptors) {
                    const result = interceptor(message, sender);
                    if (result === false) {
                        sendResponse({ error: 'Blocked by interceptor' });
                        return false;
                    }
                }

                handler(message.payload, sender)
                    .then(response => sendResponse({ success: true, data: response }))
                    .catch(error => sendResponse({ success: false, error: error.message }));

                return true; // Keep channel open for async
            });

            this._initialized = true;
        }

        register(type, handler) {
            this._handlers.set(type, handler);
        }

        unregister(type) {
            this._handlers.delete(type);
        }

        addInterceptor(fn) {
            this._interceptors.push(fn);
        }

        // Send message to background service worker
        async send(type, payload) {
            try {
                const response = await chrome.runtime.sendMessage({ type, payload });
                if (response && response.success === false) {
                    throw new Error(response.error || 'Request failed');
                }
                return response?.data ?? response;
            } catch (error) {
                if (error.message?.includes('Extension context invalidated')) {
                    console.warn('Extension context lost, message dropped:', type);
                    return null;
                }
                throw error;
            }
        }

        // Send message to a specific tab's content script
        async sendToTab(tabId, type, payload) {
            try {
                return await chrome.tabs.sendMessage(tabId, { type, payload });
            } catch {
                // Tab may not have content script
                return null;
            }
        }

        // Broadcast to all tabs
        async broadcast(type, payload) {
            const tabs = await chrome.tabs.query({});
            const results = [];
            for (const tab of tabs) {
                if (tab.id) {
                    try {
                        const result = await chrome.tabs.sendMessage(tab.id, { type, payload });
                        results.push({ tabId: tab.id, result });
                    } catch {
                        // Tab without content script
                    }
                }
            }
            return results;
        }

        getRegisteredTypes() {
            return [...this._handlers.keys()];
        }
    }

    // ── Rate Limiter for Messages ──
    class MessageRateLimiter {
        constructor(maxPerSecond = 10) {
            this._maxPerSecond = maxPerSecond;
            this._messageCount = 0;
            this._queue = [];
            this._resetInterval = setInterval(() => {
                this._messageCount = 0;
                this._processQueue();
            }, 1000);
        }

        async throttle(sendFn) {
            if (this._messageCount < this._maxPerSecond) {
                this._messageCount++;
                return sendFn();
            }
            return new Promise((resolve, reject) => {
                this._queue.push({ sendFn, resolve, reject });
            });
        }

        _processQueue() {
            while (this._queue.length > 0 && this._messageCount < this._maxPerSecond) {
                const { sendFn, resolve, reject } = this._queue.shift();
                this._messageCount++;
                sendFn().then(resolve).catch(reject);
            }
        }

        destroy() {
            clearInterval(this._resetInterval);
        }
    }

    // ── Connection Manager (for long-lived connections) ──
    class PortManager {
        constructor() {
            this._ports = new Map();
        }

        listen(onConnect) {
            chrome.runtime.onConnect.addListener(port => {
                this._ports.set(port.name, port);

                port.onDisconnect.addListener(() => {
                    this._ports.delete(port.name);
                });

                if (onConnect) onConnect(port);
            });
        }

        connect(name) {
            const port = chrome.runtime.connect({ name });
            this._ports.set(name, port);
            return port;
        }

        send(portName, message) {
            const port = this._ports.get(portName);
            if (port) port.postMessage(message);
        }

        getActiveConnections() {
            return [...this._ports.keys()];
        }
    }

    return {
        MESSAGE_TYPES,
        Mediator,
        MessageRateLimiter,
        PortManager
    };
})();
