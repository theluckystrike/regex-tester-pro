// ==========================================================================
// Regex Tester Pro — Screen Reader Support
// MD 21 Agent 3: Live regions, state announcer, ARIA helpers
// ==========================================================================

const ScreenReader = (() => {
    'use strict';

    // ── Live Region (invisible, announces to screen readers) ──
    class LiveRegion {
        constructor(options = {}) {
            this.politeness = options.politeness || 'polite';
            this.element = this._createRegion();
        }

        _createRegion() {
            const region = document.createElement('div');
            region.setAttribute('role', 'status');
            region.setAttribute('aria-live', this.politeness);
            region.setAttribute('aria-atomic', 'true');
            region.className = 'sr-only';
            region.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
            document.body.appendChild(region);
            return region;
        }

        announce(message, priority) {
            if (priority && priority !== this.politeness) {
                this.element.setAttribute('aria-live', priority);
            }

            // Clear then set — ensures screen reader picks up repeated messages
            this.element.textContent = '';
            requestAnimationFrame(() => {
                this.element.textContent = message;
            });
        }

        clear() {
            this.element.textContent = '';
        }

        destroy() {
            this.element.remove();
        }
    }

    // ── State Announcer (high-level facade) ──
    class StateAnnouncer {
        constructor() {
            this.polite = new LiveRegion({ politeness: 'polite' });
            this.assertive = new LiveRegion({ politeness: 'assertive' });
        }

        // Regex-specific announcements
        announceMatchCount(count) {
            this.polite.announce(`${count} match${count !== 1 ? 'es' : ''} found`);
        }

        announceNoMatch() {
            this.polite.announce('No matches found');
        }

        announceRegexError(errorMsg) {
            this.assertive.announce(`Regex error: ${errorMsg}`);
        }

        announcePatternSaved(name) {
            this.polite.announce(`Pattern "${name}" saved`);
        }

        announcePatternLoaded(name) {
            this.polite.announce(`Pattern "${name}" loaded`);
        }

        // Generic state changes
        announceToggle(featureName, isEnabled) {
            this.polite.announce(`${featureName} ${isEnabled ? 'enabled' : 'disabled'}`);
        }

        announceLoading(action) {
            this.polite.announce(`${action}...`);
        }

        announceLoadComplete(action, result) {
            this.polite.announce(`${action} complete. ${result}`);
        }

        announceError(fieldName, errorMessage) {
            this.assertive.announce(`Error in ${fieldName}: ${errorMessage}`);
        }

        announceSuccess(message) {
            this.polite.announce(message);
        }

        announcePageChange(pageName) {
            this.polite.announce(`Navigated to ${pageName}`);
        }

        destroy() {
            this.polite.destroy();
            this.assertive.destroy();
        }
    }

    // ── ARIA Helpers ──
    const AriaHelpers = {
        // Ensure all icon-only buttons have labels
        auditIconButtons() {
            const missing = [];
            document.querySelectorAll('button').forEach(btn => {
                const hasText = btn.textContent.trim().length > 0;
                const hasLabel = btn.getAttribute('aria-label') || btn.getAttribute('aria-labelledby');
                if (!hasText && !hasLabel) {
                    missing.push(btn);
                    btn.style.outline = '3px dashed red'; // visual debug hint
                }
            });
            return missing;
        },

        // Mark decorative SVGs as hidden
        hideDecorativeSVGs() {
            document.querySelectorAll('svg').forEach(svg => {
                if (!svg.getAttribute('role') && !svg.getAttribute('aria-label')) {
                    svg.setAttribute('aria-hidden', 'true');
                }
            });
        },

        // Set up proper landmark regions
        setupLandmarks() {
            const main = document.querySelector('main');
            if (main && !main.getAttribute('role')) main.setAttribute('role', 'main');

            const header = document.querySelector('header');
            if (header && !header.getAttribute('role')) header.setAttribute('role', 'banner');

            const nav = document.querySelector('nav');
            if (nav && !nav.getAttribute('role')) nav.setAttribute('role', 'navigation');
        },

        // Add aria-describedby hint to an element
        addDescription(element, descriptionText) {
            const id = `desc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
            const desc = document.createElement('span');
            desc.id = id;
            desc.className = 'sr-only';
            desc.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)';
            desc.textContent = descriptionText;
            element.parentNode.insertBefore(desc, element.nextSibling);
            element.setAttribute('aria-describedby', id);
        },

        // Ensure external links indicate they open in a new tab
        annotateExternalLinks() {
            document.querySelectorAll('a[target="_blank"]').forEach(link => {
                if (!link.querySelector('.sr-only')) {
                    const hint = document.createElement('span');
                    hint.className = 'sr-only';
                    hint.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)';
                    hint.textContent = ' (opens in new tab)';
                    link.appendChild(hint);
                }
                if (!link.getAttribute('rel')?.includes('noopener')) {
                    link.setAttribute('rel', 'noopener noreferrer');
                }
            });
        }
    };

    return { LiveRegion, StateAnnouncer, AriaHelpers };
})();
