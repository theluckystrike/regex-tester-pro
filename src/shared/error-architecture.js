// ==========================================================================
// Regex Tester Pro — Error Handling Architecture
// MD 24 Agent 5: Error boundaries, retry logic, error reporting, recovery
// ==========================================================================

const ErrorArchitecture = (() => {
    'use strict';

    // ── Error Categories ──
    const ErrorCategory = {
        NETWORK: 'network',
        STORAGE: 'storage',
        REGEX: 'regex',
        PERMISSION: 'permission',
        EXTENSION: 'extension',
        USER_INPUT: 'user_input',
        UNKNOWN: 'unknown'
    };

    // ── Custom Extension Error ──
    class ExtensionError extends Error {
        constructor(message, category = ErrorCategory.UNKNOWN, metadata = {}) {
            super(message);
            this.name = 'ExtensionError';
            this.category = category;
            this.metadata = metadata;
            this.timestamp = Date.now();
            this.recoverable = metadata.recoverable !== false;
        }
    }

    // ── Error Classifier ──
    function classifyError(error) {
        const message = (error.message || '').toLowerCase();

        if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
            return ErrorCategory.NETWORK;
        }
        if (message.includes('storage') || message.includes('quota')) {
            return ErrorCategory.STORAGE;
        }
        if (message.includes('invalid regular expression') || message.includes('regex')) {
            return ErrorCategory.REGEX;
        }
        if (message.includes('permission') || message.includes('not allowed')) {
            return ErrorCategory.PERMISSION;
        }
        if (message.includes('extension context') || message.includes('manifest')) {
            return ErrorCategory.EXTENSION;
        }
        return ErrorCategory.UNKNOWN;
    }

    // ── Retry with Exponential Backoff ──
    async function retry(fn, options = {}) {
        const {
            maxAttempts = 3,
            baseDelay = 1000,
            maxDelay = 30000,
            backoffFactor = 2,
            retryOn = () => true,
            onRetry = null
        } = options;

        let lastError;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await fn(attempt);
            } catch (error) {
                lastError = error;

                if (attempt === maxAttempts || !retryOn(error, attempt)) {
                    throw error;
                }

                const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt - 1), maxDelay);
                const jitter = delay * 0.1 * Math.random();

                if (onRetry) onRetry(error, attempt, delay + jitter);
                await new Promise(resolve => setTimeout(resolve, delay + jitter));
            }
        }

        throw lastError;
    }

    // ── Error Boundary (wraps async functions) ──
    function errorBoundary(fn, options = {}) {
        const { fallback = null, onError = null, category = ErrorCategory.UNKNOWN } = options;

        return async function (...args) {
            try {
                return await fn.apply(this, args);
            } catch (error) {
                const classified = classifyError(error);
                const extensionError = error instanceof ExtensionError
                    ? error
                    : new ExtensionError(error.message, classified, { originalError: error });

                if (onError) onError(extensionError);

                // Log to error buffer
                await _bufferError(extensionError);

                if (fallback !== null) {
                    return typeof fallback === 'function' ? fallback(extensionError) : fallback;
                }

                throw extensionError;
            }
        };
    }

    // ── Circuit Breaker ──
    class CircuitBreaker {
        constructor(options = {}) {
            this._failureThreshold = options.failureThreshold || 5;
            this._resetTimeout = options.resetTimeout || 60000;
            this._failureCount = 0;
            this._state = 'closed'; // closed, open, half-open
            this._lastFailure = 0;
        }

        async execute(fn) {
            if (this._state === 'open') {
                if (Date.now() - this._lastFailure > this._resetTimeout) {
                    this._state = 'half-open';
                } else {
                    throw new ExtensionError('Circuit breaker is open', ErrorCategory.EXTENSION, { recoverable: true });
                }
            }

            try {
                const result = await fn();
                this._onSuccess();
                return result;
            } catch (error) {
                this._onFailure();
                throw error;
            }
        }

        _onSuccess() {
            this._failureCount = 0;
            this._state = 'closed';
        }

        _onFailure() {
            this._failureCount++;
            this._lastFailure = Date.now();
            if (this._failureCount >= this._failureThreshold) {
                this._state = 'open';
            }
        }

        getState() { return this._state; }
        getFailureCount() { return this._failureCount; }
    }

    // ── Error Buffer (collect errors for batch reporting) ──
    const ERROR_BUFFER_KEY = 'errorBuffer';
    const MAX_BUFFER_SIZE = 100;

    async function _bufferError(error) {
        try {
            const { [ERROR_BUFFER_KEY]: buffer = [] } = await chrome.storage.local.get(ERROR_BUFFER_KEY);
            buffer.push({
                message: error.message,
                category: error.category || classifyError(error),
                timestamp: error.timestamp || Date.now(),
                stack: (error.stack || '').substring(0, 300),
                version: chrome.runtime.getManifest?.()?.version || 'unknown'
            });

            // Keep buffer bounded
            if (buffer.length > MAX_BUFFER_SIZE) buffer.splice(0, buffer.length - MAX_BUFFER_SIZE);
            await chrome.storage.local.set({ [ERROR_BUFFER_KEY]: buffer });
        } catch {
            // Don't let error logging cause more errors
        }
    }

    async function getErrorBuffer() {
        const { [ERROR_BUFFER_KEY]: buffer = [] } = await chrome.storage.local.get(ERROR_BUFFER_KEY);
        return buffer;
    }

    async function clearErrorBuffer() {
        await chrome.storage.local.set({ [ERROR_BUFFER_KEY]: [] });
    }

    // ── Global Error Handler Setup ──
    function installGlobalHandler() {
        if (typeof self !== 'undefined') {
            self.addEventListener('error', event => {
                _bufferError(new ExtensionError(
                    event.message || 'Uncaught error',
                    ErrorCategory.UNKNOWN,
                    { filename: event.filename, lineno: event.lineno }
                ));
            });

            self.addEventListener('unhandledrejection', event => {
                const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
                _bufferError(new ExtensionError(
                    error.message,
                    classifyError(error),
                    { unhandledRejection: true }
                ));
            });
        }
    }

    return {
        ErrorCategory,
        ExtensionError,
        classifyError,
        retry,
        errorBoundary,
        CircuitBreaker,
        getErrorBuffer,
        clearErrorBuffer,
        installGlobalHandler
    };
})();
