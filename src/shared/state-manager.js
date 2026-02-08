// ==========================================================================
// Regex Tester Pro — State Management
// MD 24 Agent 2: Lightweight store, selectors, persistence, middleware
// ==========================================================================

const StateManager = (() => {
    'use strict';

    // ── Lightweight State Store ──
    class Store {
        constructor(initialState = {}) {
            this._state = { ...initialState };
            this._listeners = new Set();
            this._selectorListeners = new Map();
            this._middleware = [];
        }

        getState() {
            return this._state;
        }

        setState(partial) {
            const prevState = this._state;
            const updates = typeof partial === 'function' ? partial(this._state) : partial;

            // Run middleware
            let finalUpdates = updates;
            for (const mw of this._middleware) {
                finalUpdates = mw(this._state, finalUpdates) ?? finalUpdates;
            }

            this._state = { ...this._state, ...finalUpdates };

            // Notify general listeners
            this._listeners.forEach(listener => {
                try { listener(this._state, prevState); } catch (e) { console.error('Store listener error:', e); }
            });

            // Notify selector listeners only when selected value changes
            this._selectorListeners.forEach((listeners, selector) => {
                const prev = selector(prevState);
                const next = selector(this._state);
                if (prev !== next) {
                    listeners.forEach(listener => {
                        try { listener(next, prev); } catch (e) { console.error('Selector listener error:', e); }
                    });
                }
            });
        }

        subscribe(listener) {
            this._listeners.add(listener);
            return () => this._listeners.delete(listener);
        }

        select(selector, listener) {
            if (!this._selectorListeners.has(selector)) {
                this._selectorListeners.set(selector, new Set());
            }
            this._selectorListeners.get(selector).add(listener);
            return () => {
                const set = this._selectorListeners.get(selector);
                set?.delete(listener);
                if (set?.size === 0) this._selectorListeners.delete(selector);
            };
        }

        use(middleware) {
            this._middleware.push(middleware);
        }
    }

    // ── Persistence Middleware ──
    function persistenceMiddleware(storageKey, debounceMs = 500) {
        let timer = null;
        return (_state, updates) => {
            clearTimeout(timer);
            timer = setTimeout(async () => {
                try {
                    const fullState = { ..._state, ...updates };
                    await chrome.storage.local.set({ [storageKey]: fullState });
                } catch (e) {
                    console.error('State persistence error:', e);
                }
            }, debounceMs);
            return updates;
        };
    }

    // ── Logging Middleware (development) ──
    function loggingMiddleware(state, updates) {
        console.group('State Update');
        console.log('Previous:', state);
        console.log('Updates:', updates);
        console.log('Next:', { ...state, ...updates });
        console.groupEnd();
        return updates;
    }

    // ── Validation Middleware ──
    function validationMiddleware(validators) {
        return (state, updates) => {
            const validated = { ...updates };
            for (const [key, validator] of Object.entries(validators)) {
                if (key in validated) {
                    const result = validator(validated[key], state);
                    if (result === false) {
                        delete validated[key];
                        console.warn(`State validation failed for key: ${key}`);
                    } else if (result !== true && result !== undefined) {
                        validated[key] = result; // Transformed value
                    }
                }
            }
            return validated;
        };
    }

    // ── Restore State From Storage ──
    async function restoreState(store, storageKey) {
        const { [storageKey]: saved } = await chrome.storage.local.get(storageKey);
        if (saved && typeof saved === 'object') {
            store.setState(saved);
        }
    }

    // ── Default App State ──
    const DEFAULT_STATE = {
        // Regex engine state
        pattern: '',
        flags: 'g',
        testString: '',
        matches: [],
        matchCount: 0,
        isValid: true,
        error: null,

        // UI state
        activeTab: 'match',
        sidebarOpen: false,
        highlightEnabled: true,

        // User state
        isPro: false,
        theme: 'system'
    };

    function createAppStore() {
        const store = new Store(DEFAULT_STATE);
        store.use(persistenceMiddleware('appState'));
        return store;
    }

    return {
        Store,
        persistenceMiddleware,
        loggingMiddleware,
        validationMiddleware,
        restoreState,
        DEFAULT_STATE,
        createAppStore
    };
})();
