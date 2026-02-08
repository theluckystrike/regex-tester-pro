// ==========================================================================
// Regex Tester Pro — Accessibility Compliance (Unified Facade)
// MD 21: Combines focus management, keyboard shortcuts, screen reader,
//        visual accessibility, and WCAG audit modules
// ==========================================================================
//
// Individual modules:
//   focus-manager.js    → FocusController, FocusTrap, RovingTabindex
//   keyboard-shortcuts.js → KeyboardShortcuts, skip links
//   screen-reader.js    → LiveRegion, StateAnnouncer, AriaHelpers
//   visual-a11y.js      → Contrast checker, ThemeManager, ReducedMotion
//   a11y-audit.js       → Full WCAG 2.1 AA audit, checklist
//
// This file provides a single initialization entry point.
// ==========================================================================

const Accessibility = (() => {
    'use strict';

    function init() {
        // 1. Focus management — auto-focus first element in popup
        if (typeof FocusManager !== 'undefined') {
            FocusManager.setupPopupFocusManagement();
        }

        // 2. Keyboard shortcuts — register defaults and inject skip links
        if (typeof KeyboardShortcutManager !== 'undefined') {
            const shortcuts = new KeyboardShortcutManager.KeyboardShortcuts();
            KeyboardShortcutManager.registerDefaults(shortcuts);

            KeyboardShortcutManager.injectSkipLinks([
                { href: '#patternInput', label: 'Skip to regex input' },
                { href: '#testInput', label: 'Skip to test string' },
                { href: '#results', label: 'Skip to results' }
            ]);
        }

        // 3. Screen reader — set up ARIA helpers
        if (typeof ScreenReader !== 'undefined') {
            ScreenReader.AriaHelpers.hideDecorativeSVGs();
            ScreenReader.AriaHelpers.setupLandmarks();
            ScreenReader.AriaHelpers.annotateExternalLinks();
        }

        // 4. Visual accessibility — focus styles and reduced motion
        if (typeof VisualAccessibility !== 'undefined') {
            VisualAccessibility.injectFocusStyles();
            VisualAccessibility.ReducedMotion.applyReducedMotionOverrides();
        }
    }

    function runAudit() {
        if (typeof A11yAudit !== 'undefined') {
            return A11yAudit.runFullAudit();
        }
        return { error: 'A11yAudit module not loaded' };
    }

    function getAnnouncer() {
        if (typeof ScreenReader !== 'undefined') {
            return new ScreenReader.StateAnnouncer();
        }
        return null;
    }

    return { init, runAudit, getAnnouncer };
})();
