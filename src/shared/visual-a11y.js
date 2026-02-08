// ==========================================================================
// Regex Tester Pro — Visual Accessibility
// MD 21 Agent 4: Contrast, theme management, reduced motion, focus styles
// ==========================================================================

const VisualAccessibility = (() => {
    'use strict';

    // ── WCAG Contrast Ratio Calculator ──
    function getRelativeLuminance(hex) {
        const rgb = hex.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16) / 255);
        const [r, g, b] = rgb.map(c =>
            c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        );
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    function getContrastRatio(fg, bg) {
        const l1 = getRelativeLuminance(fg);
        const l2 = getRelativeLuminance(bg);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        return parseFloat(ratio.toFixed(2));
    }

    function checkContrast(fg, bg) {
        const ratio = getContrastRatio(fg, bg);
        return {
            ratio,
            AA_normal: ratio >= 4.5,   // Normal text (<18pt)
            AA_large: ratio >= 3,      // Large text (>=18pt or 14pt bold)
            AAA_normal: ratio >= 7,    // Enhanced
            AAA_large: ratio >= 4.5,
            uiComponents: ratio >= 3   // Non-text contrast
        };
    }

    // ── Accessible Color Palette (pre-validated WCAG AA) ──
    const A11Y_PALETTE = {
        light: {
            textPrimary: '#1a1a1a',     // 16:1 on white
            textSecondary: '#595959',    // 7:1 on white
            textDisabled: '#767676',     // 4.5:1 minimum
            bgPrimary: '#ffffff',
            bgSecondary: '#f5f5f5',
            accentPrimary: '#0052cc',    // 4.6:1 on white
            accentHover: '#003d99',      // 7:1 on white
            error: '#c41e3a',            // 5.9:1
            success: '#1a7f37',          // 4.7:1
            warning: '#9a6700',          // 4.5:1
            focusRing: '#0052cc'
        },
        dark: {
            textPrimary: '#f0f0f0',     // 15:1 on dark
            textSecondary: '#b0b0b0',    // 8:1 on dark
            textDisabled: '#8c8c8c',     // 4.5:1 on dark
            bgPrimary: '#1a1a1a',
            bgSecondary: '#2d2d2d',
            accentPrimary: '#66b3ff',    // 8:1 on dark
            accentHover: '#99ccff',      // 11:1 on dark
            error: '#ff6b6b',            // 6:1
            success: '#69db7c',          // 9:1
            warning: '#ffd43b',          // 12:1
            focusRing: '#66b3ff'
        }
    };

    // ── Theme Manager (respects system preference, supports manual toggle) ──
    class ThemeManager {
        constructor() {
            this.storageKey = 'rtp-theme-preference';
            this._init();
        }

        async _init() {
            // Load saved preference
            const { [this.storageKey]: saved } = await chrome.storage.local.get(this.storageKey);
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (saved) {
                this._applyTheme(saved);
            } else if (systemDark) {
                this._applyTheme('dark');
            } else {
                this._applyTheme('light');
            }

            // Listen for system changes
            window.matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change', async (e) => {
                    const { [this.storageKey]: userOverride } = await chrome.storage.local.get(this.storageKey);
                    if (!userOverride) {
                        this._applyTheme(e.matches ? 'dark' : 'light');
                    }
                });
        }

        _applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            document.documentElement.style.colorScheme = theme;
        }

        async toggle() {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            this._applyTheme(next);
            await chrome.storage.local.set({ [this.storageKey]: next });
            return next;
        }

        getCurrent() {
            return document.documentElement.getAttribute('data-theme') || 'light';
        }
    }

    // ── Reduced Motion Detection ──
    const ReducedMotion = {
        isPreferred() {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        },

        // Inject CSS to disable animations system-wide
        applyReducedMotionOverrides() {
            if (!this.isPreferred()) return;

            const style = document.createElement('style');
            style.id = 'reduced-motion-overrides';
            style.textContent = `
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `;
            document.head.appendChild(style);
        },

        // Listen for preference changes
        onChange(callback) {
            window.matchMedia('(prefers-reduced-motion: reduce)')
                .addEventListener('change', (e) => callback(e.matches));
        }
    };

    // ── Focus Style Injector ──
    function injectFocusStyles() {
        if (document.getElementById('a11y-focus-styles')) return;

        const style = document.createElement('style');
        style.id = 'a11y-focus-styles';
        style.textContent = `
      /* Keyboard-only focus indicators */
      :focus:not(:focus-visible) {
        outline: none;
      }

      :focus-visible {
        outline: 2px solid var(--focus-ring, #0052cc);
        outline-offset: 2px;
      }

      button:focus-visible {
        outline: 2px solid var(--focus-ring, #0052cc);
        outline-offset: 2px;
        box-shadow: 0 0 0 4px rgba(0, 82, 204, 0.25);
      }

      input:focus-visible,
      textarea:focus-visible,
      select:focus-visible {
        outline: 2px solid var(--focus-ring, #0052cc);
        border-color: var(--focus-ring, #0052cc);
      }

      a:focus-visible {
        outline: 2px solid var(--focus-ring, #0052cc);
        outline-offset: 4px;
      }

      /* High Contrast Mode support */
      @media (forced-colors: active) {
        button { border: 2px solid ButtonText; }
        button:focus { outline: 3px solid Highlight; outline-offset: 2px; }
        svg { stroke: currentColor; }
      }

      /* Increased contrast preference */
      @media (prefers-contrast: more) {
        :root {
          --text-primary: #000000;
          --text-secondary: #333333;
          --bg-primary: #ffffff;
          --accent-primary: #0000cc;
        }
      }
    `;
        document.head.appendChild(style);
    }

    // ── Audit All Visible Elements for Contrast Issues ──
    function auditPageContrast() {
        const issues = [];
        const textElements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button, label, td, th, li');

        textElements.forEach(el => {
            const style = window.getComputedStyle(el);
            const fg = style.color;
            const bg = style.backgroundColor;

            // Only check non-transparent backgrounds
            if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                const fgHex = rgbToHex(fg);
                const bgHex = rgbToHex(bg);
                if (fgHex && bgHex) {
                    const result = checkContrast(fgHex, bgHex);
                    if (!result.AA_normal) {
                        issues.push({
                            element: el.tagName.toLowerCase(),
                            text: el.textContent.substring(0, 40),
                            fg: fgHex,
                            bg: bgHex,
                            ratio: result.ratio,
                            required: 4.5
                        });
                    }
                }
            }
        });

        return issues;
    }

    function rgbToHex(rgb) {
        const match = rgb.match(/(\d+)/g);
        if (!match || match.length < 3) return null;
        return '#' + match.slice(0, 3).map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
    }

    return {
        getContrastRatio,
        checkContrast,
        A11Y_PALETTE,
        ThemeManager,
        ReducedMotion,
        injectFocusStyles,
        auditPageContrast
    };
})();
