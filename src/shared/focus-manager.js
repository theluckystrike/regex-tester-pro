// ==========================================================================
// Regex Tester Pro — Focus Management System
// MD 21 Agent 1: FocusManager, FocusTrap, RovingTabindex
// ==========================================================================

const FocusManager = (() => {
    'use strict';

    const FOCUSABLE_SELECTOR = [
        'button:not([disabled])',
        'a[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    // ── Core Focus Manager ──
    class FocusController {
        constructor(container) {
            this.container = container || document.body;
        }

        getFocusableElements() {
            return [...this.container.querySelectorAll(FOCUSABLE_SELECTOR)]
                .filter(el => el.offsetParent !== null); // visible only
        }

        getFirst() {
            return this.getFocusableElements()[0] || null;
        }

        getLast() {
            const els = this.getFocusableElements();
            return els[els.length - 1] || null;
        }

        focusFirst() {
            const first = this.getFirst();
            if (first) first.focus();
            return first;
        }

        focusLast() {
            const last = this.getLast();
            if (last) last.focus();
            return last;
        }

        // Move focus to next/previous focusable element
        focusNext(current) {
            const els = this.getFocusableElements();
            const idx = els.indexOf(current || document.activeElement);
            const next = els[idx + 1] || els[0];
            if (next) next.focus();
            return next;
        }

        focusPrevious(current) {
            const els = this.getFocusableElements();
            const idx = els.indexOf(current || document.activeElement);
            const prev = els[idx - 1] || els[els.length - 1];
            if (prev) prev.focus();
            return prev;
        }
    }

    // ── Focus Trap (for modals, dialogs, panels) ──
    class FocusTrap {
        constructor(element) {
            this.element = element;
            this.controller = new FocusController(element);
            this.previouslyFocused = null;
            this._handleKeyDown = this._handleKeyDown.bind(this);
        }

        activate() {
            this.previouslyFocused = document.activeElement;
            this.element.addEventListener('keydown', this._handleKeyDown);
            this.controller.focusFirst();
        }

        deactivate() {
            this.element.removeEventListener('keydown', this._handleKeyDown);
            if (this.previouslyFocused && this.previouslyFocused.focus) {
                this.previouslyFocused.focus();
            }
        }

        _handleKeyDown(e) {
            if (e.key !== 'Tab') return;

            const focusables = this.controller.getFocusableElements();
            if (focusables.length === 0) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    }

    // ── Roving Tabindex (for toolbars, tabs, menus) ──
    class RovingTabindex {
        constructor(container, itemSelector, options = {}) {
            this.container = container;
            this.itemSelector = itemSelector;
            this.orientation = options.orientation || 'horizontal';
            this.wrap = options.wrap !== false;
            this._init();
        }

        _init() {
            const items = this._getItems();
            items.forEach((item, index) => {
                item.setAttribute('tabindex', index === 0 ? '0' : '-1');
            });

            this.container.addEventListener('keydown', (e) => this._handleKeyDown(e));
            this.container.addEventListener('click', (e) => {
                const item = e.target.closest(this.itemSelector);
                if (item) this._setActive(item);
            });
        }

        _getItems() {
            return [...this.container.querySelectorAll(this.itemSelector)]
                .filter(item => !item.disabled && !item.hidden);
        }

        _handleKeyDown(e) {
            const items = this._getItems();
            const currentIndex = items.indexOf(document.activeElement);
            if (currentIndex === -1) return;

            const isHorizontal = this.orientation === 'horizontal';
            const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
            const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';

            let nextIndex;

            switch (e.key) {
                case prevKey:
                    e.preventDefault();
                    nextIndex = currentIndex - 1;
                    if (nextIndex < 0) nextIndex = this.wrap ? items.length - 1 : 0;
                    break;

                case nextKey:
                    e.preventDefault();
                    nextIndex = currentIndex + 1;
                    if (nextIndex >= items.length) nextIndex = this.wrap ? 0 : items.length - 1;
                    break;

                case 'Home':
                    e.preventDefault();
                    nextIndex = 0;
                    break;

                case 'End':
                    e.preventDefault();
                    nextIndex = items.length - 1;
                    break;

                default:
                    return;
            }

            this._setActive(items[nextIndex]);
        }

        _setActive(item) {
            const items = this._getItems();
            items.forEach(i => i.setAttribute('tabindex', '-1'));
            item.setAttribute('tabindex', '0');
            item.focus();
        }
    }

    // ── Popup Focus Restoration ──
    function setupPopupFocusManagement() {
        const controller = new FocusController(document.body);

        document.addEventListener('DOMContentLoaded', () => {
            // Auto-focus first focusable element when popup opens
            requestAnimationFrame(() => controller.focusFirst());
        });

        // Ensure focus doesn't leave popup (Chrome extension popups)
        document.addEventListener('focusout', (e) => {
            if (!document.body.contains(e.relatedTarget) && e.relatedTarget !== null) {
                controller.focusFirst();
            }
        });
    }

    return {
        FocusController,
        FocusTrap,
        RovingTabindex,
        FOCUSABLE_SELECTOR,
        setupPopupFocusManagement
    };
})();
