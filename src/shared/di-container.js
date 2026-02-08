// ==========================================================================
// Regex Tester Pro — Dependency Injection Container
// MD 24 Agent 4: DI container, service registry, lifecycle management
// ==========================================================================

const DIContainer = (() => {
    'use strict';

    // ── Service Lifetimes ──
    const Lifetime = {
        SINGLETON: 'singleton',   // One instance for entire app
        TRANSIENT: 'transient',   // New instance every time
        SCOPED: 'scoped'          // One instance per scope (e.g., popup session)
    };

    // ── Container ──
    class Container {
        constructor() {
            this._registrations = new Map();
            this._singletons = new Map();
            this._scopes = new Map();
        }

        // Register a service
        register(name, factory, lifetime = Lifetime.SINGLETON) {
            this._registrations.set(name, { factory, lifetime });
            return this;
        }

        // Register a constant value
        registerValue(name, value) {
            this._registrations.set(name, { factory: () => value, lifetime: Lifetime.SINGLETON });
            this._singletons.set(name, value);
            return this;
        }

        // Resolve a service
        resolve(name) {
            const registration = this._registrations.get(name);
            if (!registration) {
                throw new Error(`Service not registered: ${name}`);
            }

            switch (registration.lifetime) {
                case Lifetime.SINGLETON:
                    if (!this._singletons.has(name)) {
                        this._singletons.set(name, registration.factory(this));
                    }
                    return this._singletons.get(name);

                case Lifetime.TRANSIENT:
                    return registration.factory(this);

                case Lifetime.SCOPED:
                    return this._resolveScoped(name, registration);

                default:
                    return registration.factory(this);
            }
        }

        _resolveScoped(name, registration) {
            const scopeId = this._currentScope || '__default__';
            if (!this._scopes.has(scopeId)) this._scopes.set(scopeId, new Map());
            const scope = this._scopes.get(scopeId);
            if (!scope.has(name)) scope.set(name, registration.factory(this));
            return scope.get(name);
        }

        // Create a scope
        createScope(scopeId) {
            const childContainer = Object.create(this);
            childContainer._currentScope = scopeId;
            childContainer._scopes = new Map();
            return childContainer;
        }

        // Dispose a scope
        disposeScope(scopeId) {
            const scope = this._scopes.get(scopeId);
            if (scope) {
                scope.forEach(instance => {
                    if (instance && typeof instance.dispose === 'function') {
                        instance.dispose();
                    }
                });
                this._scopes.delete(scopeId);
            }
        }

        // Check if service exists
        has(name) {
            return this._registrations.has(name);
        }

        // Get all registered service names
        getRegisteredServices() {
            return [...this._registrations.entries()].map(([name, reg]) => ({
                name,
                lifetime: reg.lifetime
            }));
        }

        // Reset container
        reset() {
            this._singletons.forEach(instance => {
                if (instance && typeof instance.dispose === 'function') {
                    instance.dispose();
                }
            });
            this._registrations.clear();
            this._singletons.clear();
            this._scopes.clear();
        }
    }

    // ── Pre-configured Container for Regex Tester Pro ──
    function createAppContainer() {
        const container = new Container();

        // Register core services
        container.register('eventBus', () => {
            return typeof DesignPatterns !== 'undefined'
                ? new DesignPatterns.EventBus()
                : { on() { }, off() { }, emit() { } };
        });

        container.register('messageBus', (c) => {
            if (typeof MessageBus !== 'undefined') {
                const mediator = new MessageBus.Mediator();
                mediator.initialize();
                return mediator;
            }
            return null;
        });

        container.register('store', () => {
            return typeof StateManager !== 'undefined'
                ? StateManager.createAppStore()
                : null;
        });

        container.register('patternRepository', () => {
            return typeof DesignPatterns !== 'undefined'
                ? new DesignPatterns.StorageRepository('savedPatterns')
                : null;
        });

        container.register('historyRepository', () => {
            return typeof DesignPatterns !== 'undefined'
                ? new DesignPatterns.StorageRepository('regexHistory')
                : null;
        });

        return container;
    }

    return {
        Lifetime,
        Container,
        createAppContainer
    };
})();
