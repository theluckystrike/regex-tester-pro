// ==========================================================================
// Regex Tester Pro — Keyboard Shortcuts System
// MD 21 Agent 2: Shortcut registry, combo parser, help dialog, skip links
// ==========================================================================

const KeyboardShortcutManager = (() => {
    'use strict';

    class KeyboardShortcuts {
        constructor() {
            this.shortcuts = new Map();
            this.descriptions = new Map();
            this.enabled = true;
            this._init();
        }

        _init() {
            document.addEventListener('keydown', (e) => {
                if (!this.enabled) return;

                // Don't intercept when typing in inputs (unless Escape or modifier combos)
                const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);
                const hasModifier = e.ctrlKey || e.metaKey || e.altKey;
                if (isInput && !hasModifier && e.key !== 'Escape') return;

                const combo = this._getCombo(e);
                const handler = this.shortcuts.get(combo);

                if (handler) {
                    e.preventDefault();
                    e.stopPropagation();
                    handler(e);
                }
            });
        }

        _getCombo(e) {
            const parts = [];
            if (e.ctrlKey || e.metaKey) parts.push('mod');
            if (e.shiftKey) parts.push('shift');
            if (e.altKey) parts.push('alt');
            parts.push(e.key.toLowerCase());
            return parts.join('+');
        }

        register(combo, handler, description) {
            this.shortcuts.set(combo, handler);
            if (description) {
                this.descriptions.set(combo, description);
            }
            return this;
        }

        unregister(combo) {
            this.shortcuts.delete(combo);
            this.descriptions.delete(combo);
            return this;
        }

        disable() {
            this.enabled = false;
        }

        enable() {
            this.enabled = true;
        }

        getHelp() {
            return [...this.descriptions.entries()].map(([combo, desc]) => ({
                shortcut: combo.replace('mod', '⌘/Ctrl'),
                description: desc
            }));
        }

        showHelpDialog() {
            const existing = document.getElementById('shortcuts-help-dialog');
            if (existing) { existing.remove(); return; }

            const dialog = document.createElement('div');
            dialog.id = 'shortcuts-help-dialog';
            dialog.setAttribute('role', 'dialog');
            dialog.setAttribute('aria-label', 'Keyboard shortcuts');
            dialog.setAttribute('aria-modal', 'true');

            const help = this.getHelp();
            dialog.innerHTML = `
        <div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center">
          <div style="background:var(--bg-primary,#1a1a2e);color:var(--text-primary,#e0e0e0);padding:1.5rem;border-radius:12px;max-width:400px;width:90%;max-height:80vh;overflow-y:auto;box-shadow:0 8px 32px rgba(0,0,0,0.3)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
              <h2 style="margin:0;font-size:1.1rem">Keyboard Shortcuts</h2>
              <button id="close-shortcuts-help" aria-label="Close shortcuts help" style="background:none;border:none;color:inherit;font-size:1.5rem;cursor:pointer;padding:0.25rem">✕</button>
            </div>
            <table style="width:100%;border-collapse:collapse">
              <tbody>
                ${help.map(h => `
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.1)">
                    <td style="padding:0.5rem 0"><kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;font-family:monospace;font-size:0.85rem">${h.shortcut}</kbd></td>
                    <td style="padding:0.5rem 0">${h.description}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

            document.body.appendChild(dialog);

            const closeBtn = dialog.querySelector('#close-shortcuts-help');
            closeBtn.focus();
            closeBtn.addEventListener('click', () => dialog.remove());
            dialog.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') dialog.remove();
            });
        }
    }

    // ── Default Regex Tester Pro Shortcuts ──
    function registerDefaults(shortcuts) {
        shortcuts
            .register('mod+enter', () => {
                document.getElementById('patternInput')?.dispatchEvent(new Event('input'));
            }, 'Run regex test')
            .register('mod+h', () => {
                document.getElementById('historyBtn')?.click();
            }, 'Toggle history panel')
            .register('mod+shift+a', () => {
                document.getElementById('aiBtn')?.click();
            }, 'Open AI generator')
            .register('mod+s', () => {
                document.getElementById('saveBtn')?.click();
            }, 'Save current pattern')
            .register('mod+shift+c', () => {
                document.getElementById('clearBtn')?.click();
            }, 'Clear all fields')
            .register('escape', () => {
                const modals = document.querySelectorAll('.modal[open], .panel.open, [role="dialog"]:not([hidden])');
                modals.forEach(m => {
                    m.setAttribute('hidden', '');
                    m.classList.remove('open');
                });
            }, 'Close panel/modal')
            .register('?', () => {
                shortcuts.showHelpDialog();
            }, 'Show keyboard shortcuts');
    }

    // ── Skip Links ──
    function injectSkipLinks(links) {
        const container = document.createElement('div');
        container.className = 'skip-links';
        container.setAttribute('role', 'navigation');
        container.setAttribute('aria-label', 'Skip links');

        links.forEach(({ href, label }) => {
            const a = document.createElement('a');
            a.href = href;
            a.className = 'skip-link';
            a.textContent = label;
            a.style.cssText = `
        position:absolute;top:-40px;left:0;padding:8px 16px;
        background:var(--accent-primary,#6366f1);color:#fff;
        text-decoration:none;z-index:10000;transition:top 0.2s;
        border-radius:0 0 8px 0;font-size:0.875rem;
      `;
            a.addEventListener('focus', () => { a.style.top = '0'; });
            a.addEventListener('blur', () => { a.style.top = '-40px'; });
            container.appendChild(a);
        });

        document.body.prepend(container);
    }

    return { KeyboardShortcuts, registerDefaults, injectSkipLinks };
})();
