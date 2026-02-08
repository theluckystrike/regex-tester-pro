// ==========================================================================
// Regex Tester Pro — Design Patterns Library
// MD 24 Agent 1: Singleton, Observer, Command, Factory, Repository patterns
// ==========================================================================

const DesignPatterns = (() => {
    'use strict';

    // ── Observer / Pub-Sub ──
    class EventBus {
        constructor() {
            this._listeners = new Map();
            this._onceListeners = new Map();
        }

        on(event, callback) {
            if (!this._listeners.has(event)) this._listeners.set(event, new Set());
            this._listeners.get(event).add(callback);
            return () => this.off(event, callback);
        }

        once(event, callback) {
            if (!this._onceListeners.has(event)) this._onceListeners.set(event, new Set());
            this._onceListeners.get(event).add(callback);
            return () => this._onceListeners.get(event)?.delete(callback);
        }

        off(event, callback) {
            this._listeners.get(event)?.delete(callback);
        }

        emit(event, data) {
            this._listeners.get(event)?.forEach(cb => {
                try { cb(data); } catch (e) { console.error(`EventBus [${event}]:`, e); }
            });
            const once = this._onceListeners.get(event);
            if (once) {
                once.forEach(cb => {
                    try { cb(data); } catch (e) { console.error(`EventBus [${event}]:`, e); }
                });
                once.clear();
            }
        }

        clear(event) {
            if (event) {
                this._listeners.delete(event);
                this._onceListeners.delete(event);
            } else {
                this._listeners.clear();
                this._onceListeners.clear();
            }
        }
    }

    // ── Command Pattern with Undo/Redo ──
    class CommandHistory {
        constructor(maxSize = 50) {
            this._history = [];
            this._position = -1;
            this._maxSize = maxSize;
        }

        async execute(command) {
            await command.execute();
            this._history = this._history.slice(0, this._position + 1);
            this._history.push(command);
            if (this._history.length > this._maxSize) this._history.shift();
            else this._position++;
            return command;
        }

        async undo() {
            if (this._position < 0) return null;
            const cmd = this._history[this._position];
            if (cmd.undo) {
                await cmd.undo();
                this._position--;
            }
            return cmd;
        }

        async redo() {
            if (this._position >= this._history.length - 1) return null;
            this._position++;
            const cmd = this._history[this._position];
            await cmd.execute();
            return cmd;
        }

        canUndo() { return this._position >= 0; }
        canRedo() { return this._position < this._history.length - 1; }
        getHistory() { return this._history.map((c, i) => ({ index: i, description: c.describe(), current: i === this._position })); }
    }

    // ── Repository Pattern for Storage ──
    class StorageRepository {
        constructor(storageKey) {
            this._key = storageKey;
        }

        async findAll() {
            const result = await chrome.storage.local.get(this._key);
            return result[this._key] || [];
        }

        async find(id) {
            const items = await this.findAll();
            return items.find(item => item.id === id) || null;
        }

        async save(item) {
            const items = await this.findAll();
            const index = items.findIndex(i => i.id === item.id);
            item.updatedAt = Date.now();
            if (index >= 0) {
                items[index] = item;
            } else {
                item.createdAt = item.createdAt || Date.now();
                items.push(item);
            }
            await chrome.storage.local.set({ [this._key]: items });
            return item;
        }

        async delete(id) {
            const items = await this.findAll();
            await chrome.storage.local.set({ [this._key]: items.filter(i => i.id !== id) });
        }

        async query(predicate) {
            const items = await this.findAll();
            return items.filter(predicate);
        }

        async count() {
            return (await this.findAll()).length;
        }

        async clear() {
            await chrome.storage.local.set({ [this._key]: [] });
        }
    }

    // ── Singleton Factory ──
    const _singletons = new Map();

    function singleton(key, factory) {
        if (!_singletons.has(key)) {
            _singletons.set(key, factory());
        }
        return _singletons.get(key);
    }

    // ── Pipeline / Chain of Responsibility ──
    class Pipeline {
        constructor() {
            this._steps = [];
        }

        use(step) {
            this._steps.push(step);
            return this;
        }

        async process(input) {
            let result = input;
            for (const step of this._steps) {
                result = await step(result);
                if (result === null || result === undefined) break;
            }
            return result;
        }
    }

    return {
        EventBus,
        CommandHistory,
        StorageRepository,
        singleton,
        Pipeline
    };
})();
