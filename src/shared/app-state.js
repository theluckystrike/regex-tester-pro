// ==========================================================================
// Regex Tester Pro — Code Architecture Patterns
// MD 24: Module pattern, state management, event system
// ==========================================================================

const AppState = (() => {
    'use strict';

    // ── Centralized State Store (lightweight Redux-like) ──
    let _state = {
        pattern: '',
        testString: '',
        flags: 'g',
        matches: [],
        error: null,
        activeTab: 'test',    // test | replace | ai
        isPro: false,
        theme: 'system',
        historyOpen: false,
        settingsOpen: false
    };

    const _listeners = new Map();

    function getState() {
        return { ..._state };
    }

    function setState(updates) {
        const prev = { ..._state };
        _state = { ..._state, ...updates };

        // Notify listeners of changed keys
        for (const key of Object.keys(updates)) {
            if (prev[key] !== _state[key]) {
                const keyListeners = _listeners.get(key) || [];
                keyListeners.forEach(fn => fn(_state[key], prev[key]));
            }
        }
    }

    function subscribe(key, callback) {
        if (!_listeners.has(key)) {
            _listeners.set(key, []);
        }
        _listeners.get(key).push(callback);

        // Return unsubscribe function
        return () => {
            const arr = _listeners.get(key);
            const idx = arr.indexOf(callback);
            if (idx > -1) arr.splice(idx, 1);
        };
    }

    // ── Event Bus (for cross-component communication) ──
    const _eventHandlers = new Map();

    function emit(event, data) {
        const handlers = _eventHandlers.get(event) || [];
        handlers.forEach(fn => fn(data));
    }

    function on(event, handler) {
        if (!_eventHandlers.has(event)) {
            _eventHandlers.set(event, []);
        }
        _eventHandlers.get(event).push(handler);

        return () => {
            const arr = _eventHandlers.get(event);
            const idx = arr.indexOf(handler);
            if (idx > -1) arr.splice(idx, 1);
        };
    }

    // ── Predefined Events ──
    const EVENTS = {
        PATTERN_CHANGED: 'pattern_changed',
        TEST_COMPLETE: 'test_complete',
        MATCH_SELECTED: 'match_selected',
        HISTORY_SAVED: 'history_saved',
        THEME_CHANGED: 'theme_changed',
        PRO_STATUS_CHANGED: 'pro_status_changed',
        AI_GENERATED: 'ai_generated',
        ERROR_OCCURRED: 'error_occurred',
        PAYWALL_TRIGGERED: 'paywall_triggered'
    };

    return {
        getState,
        setState,
        subscribe,
        emit,
        on,
        EVENTS
    };
})();
