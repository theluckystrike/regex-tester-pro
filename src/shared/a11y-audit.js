// ==========================================================================
// Regex Tester Pro — Accessibility Audit & WCAG Compliance
// MD 21 Agent 5: Full WCAG 2.1 AA audit, checklist, accessible component checks
// ==========================================================================

const A11yAudit = (() => {
    'use strict';

    // ── WCAG 2.1 AA Criteria Relevant to Chrome Extensions ──
    const WCAG_CRITERIA = [
        { id: '1.1.1', name: 'Non-text Content', principle: 'Perceivable' },
        { id: '1.3.1', name: 'Info and Relationships', principle: 'Perceivable' },
        { id: '1.4.3', name: 'Contrast (Minimum)', principle: 'Perceivable' },
        { id: '1.4.11', name: 'Non-text Contrast', principle: 'Perceivable' },
        { id: '2.1.1', name: 'Keyboard', principle: 'Operable' },
        { id: '2.1.2', name: 'No Keyboard Trap', principle: 'Operable' },
        { id: '2.4.3', name: 'Focus Order', principle: 'Operable' },
        { id: '2.4.7', name: 'Focus Visible', principle: 'Operable' },
        { id: '3.2.1', name: 'On Focus', principle: 'Understandable' },
        { id: '3.3.1', name: 'Error Identification', principle: 'Understandable' },
        { id: '4.1.2', name: 'Name, Role, Value', principle: 'Robust' }
    ];

    // ── Full Automated Audit ──
    function runFullAudit() {
        const results = {
            timestamp: new Date().toISOString(),
            criteria: {},
            issues: [],
            warnings: [],
            passes: [],
            score: 0
        };

        // 1.1.1 Non-text content
        _auditNonTextContent(results);

        // 1.3.1 Semantic structure
        _auditSemanticStructure(results);

        // 2.1.1 Keyboard accessibility
        _auditKeyboard(results);

        // 2.4.3 Focus order
        _auditFocusOrder(results);

        // 2.4.7 Focus visible
        _auditFocusVisible(results);

        // 3.3.1 Error identification
        _auditErrorIdentification(results);

        // 4.1.2 Name, Role, Value
        _auditNameRoleValue(results);

        // Calculate score
        const total = results.issues.length + results.warnings.length + results.passes.length;
        results.score = total > 0 ? Math.round((results.passes.length / total) * 100) : 100;
        results.status = results.issues.length === 0 ? 'PASS' : 'NEEDS_FIXES';

        return results;
    }

    function _auditNonTextContent(results) {
        // Images without alt text
        document.querySelectorAll('img').forEach(img => {
            if (!img.alt && img.getAttribute('aria-hidden') !== 'true') {
                results.issues.push({
                    criterion: '1.1.1',
                    type: 'error',
                    element: _describeElement(img),
                    issue: 'Image missing alt text',
                    fix: 'Add alt attribute or aria-hidden="true" for decorative images'
                });
            } else {
                results.passes.push({ criterion: '1.1.1', element: _describeElement(img) });
            }
        });

        // SVGs without accessible names
        document.querySelectorAll('svg').forEach(svg => {
            if (svg.getAttribute('aria-hidden') !== 'true' && !svg.getAttribute('aria-label') && !svg.querySelector('title')) {
                results.warnings.push({
                    criterion: '1.1.1',
                    type: 'warning',
                    element: 'svg',
                    issue: 'SVG without aria-hidden, aria-label, or <title>',
                    fix: 'Add aria-hidden="true" for decorative SVGs or aria-label for meaningful ones'
                });
            }
        });
    }

    function _auditSemanticStructure(results) {
        // Check for heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let previousLevel = 0;
        headings.forEach(h => {
            const level = parseInt(h.tagName[1]);
            if (level > previousLevel + 1 && previousLevel > 0) {
                results.warnings.push({
                    criterion: '1.3.1',
                    type: 'warning',
                    element: _describeElement(h),
                    issue: `Heading level skipped (h${previousLevel} → h${level})`,
                    fix: 'Use sequential heading levels'
                });
            }
            previousLevel = level;
        });

        // Check for proper form structure
        document.querySelectorAll('input, select, textarea').forEach(input => {
            if (input.type === 'hidden') return;
            const hasLabel = input.id && document.querySelector(`label[for="${input.id}"]`);
            const hasAriaLabel = input.getAttribute('aria-label') || input.getAttribute('aria-labelledby');

            if (!hasLabel && !hasAriaLabel) {
                results.issues.push({
                    criterion: '1.3.1',
                    type: 'error',
                    element: _describeElement(input),
                    issue: 'Form control without associated label',
                    fix: 'Add <label for="id"> or aria-label'
                });
            } else {
                results.passes.push({ criterion: '1.3.1', element: _describeElement(input) });
            }
        });

        // Check for landmark regions
        const hasMain = !!document.querySelector('main, [role="main"]');
        if (!hasMain) {
            results.warnings.push({
                criterion: '1.3.1',
                type: 'warning',
                element: 'document',
                issue: 'No <main> landmark found',
                fix: 'Wrap primary content in <main> element'
            });
        }
    }

    function _auditKeyboard(results) {
        // Interactive elements that can't receive focus
        document.querySelectorAll('[onclick], [role="button"]').forEach(el => {
            if (el.tagName !== 'BUTTON' && el.tagName !== 'A' && el.getAttribute('tabindex') === null) {
                results.issues.push({
                    criterion: '2.1.1',
                    type: 'error',
                    element: _describeElement(el),
                    issue: 'Interactive element not keyboard accessible',
                    fix: 'Use <button> or add tabindex="0" and keyboard event handlers'
                });
            }
        });
    }

    function _auditFocusOrder(results) {
        // Check for positive tabindex (bad practice)
        document.querySelectorAll('[tabindex]').forEach(el => {
            const tabindex = parseInt(el.getAttribute('tabindex'));
            if (tabindex > 0) {
                results.issues.push({
                    criterion: '2.4.3',
                    type: 'error',
                    element: _describeElement(el),
                    issue: `Positive tabindex="${tabindex}" disrupts natural focus order`,
                    fix: 'Use tabindex="0" or "-1" only. Reorder DOM instead.'
                });
            }
        });
    }

    function _auditFocusVisible(results) {
        // Check if outline: none is used without replacement
        const styles = document.querySelectorAll('style');
        styles.forEach(style => {
            if (style.textContent.includes('outline: none') || style.textContent.includes('outline:none')) {
                if (!style.textContent.includes(':focus-visible') && !style.textContent.includes('box-shadow')) {
                    results.warnings.push({
                        criterion: '2.4.7',
                        type: 'warning',
                        element: 'stylesheet',
                        issue: 'outline:none found without focus-visible replacement',
                        fix: 'Use :focus-visible with custom outline or box-shadow'
                    });
                }
            }
        });
    }

    function _auditErrorIdentification(results) {
        // Check that required fields have proper aria attributes
        document.querySelectorAll('[required]').forEach(field => {
            if (!field.getAttribute('aria-required')) {
                results.warnings.push({
                    criterion: '3.3.1',
                    type: 'warning',
                    element: _describeElement(field),
                    issue: 'Required field missing aria-required attribute',
                    fix: 'Add aria-required="true"'
                });
            }
        });

        // Check invalid fields have aria-invalid
        document.querySelectorAll('.error, .invalid, .has-error').forEach(el => {
            const input = el.querySelector('input, select, textarea') || el;
            if (!input.getAttribute('aria-invalid')) {
                results.warnings.push({
                    criterion: '3.3.1',
                    type: 'warning',
                    element: _describeElement(input),
                    issue: 'Error state without aria-invalid',
                    fix: 'Add aria-invalid="true" when field has an error'
                });
            }
        });
    }

    function _auditNameRoleValue(results) {
        // Buttons without accessible names
        document.querySelectorAll('button').forEach(btn => {
            const hasText = btn.textContent.trim().length > 0;
            const hasLabel = btn.getAttribute('aria-label') || btn.getAttribute('aria-labelledby');
            const hasTitle = btn.getAttribute('title');

            if (!hasText && !hasLabel && !hasTitle) {
                results.issues.push({
                    criterion: '4.1.2',
                    type: 'error',
                    element: _describeElement(btn),
                    issue: 'Button without accessible name',
                    fix: 'Add text content, aria-label, or aria-labelledby'
                });
            } else {
                results.passes.push({ criterion: '4.1.2', element: _describeElement(btn) });
            }
        });

        // Links without accessible names
        document.querySelectorAll('a[href]').forEach(link => {
            const hasText = link.textContent.trim().length > 0;
            const hasLabel = link.getAttribute('aria-label');
            if (!hasText && !hasLabel) {
                results.issues.push({
                    criterion: '4.1.2',
                    type: 'error',
                    element: _describeElement(link),
                    issue: 'Link without accessible name',
                    fix: 'Add text content or aria-label'
                });
            }
        });

        // Custom controls need role
        document.querySelectorAll('[data-toggle], [data-dropdown], [data-modal]').forEach(el => {
            if (!el.getAttribute('role') && el.tagName !== 'BUTTON') {
                results.warnings.push({
                    criterion: '4.1.2',
                    type: 'warning',
                    element: _describeElement(el),
                    issue: 'Custom interactive element without ARIA role',
                    fix: 'Add appropriate role attribute (e.g., role="button")'
                });
            }
        });
    }

    function _describeElement(el) {
        let desc = el.tagName.toLowerCase();
        if (el.id) desc += `#${el.id}`;
        if (el.className && typeof el.className === 'string') {
            desc += `.${el.className.split(' ').slice(0, 2).join('.')}`;
        }
        return desc;
    }

    // ── Pre-Release Accessibility Checklist ──
    const CHECKLIST = {
        keyboard: [
            'All interactive elements reachable via Tab',
            'Tab order follows logical reading order',
            'No keyboard traps (focus can always escape)',
            'Escape closes modals/popups',
            'Arrow keys work in toolbars/menus/tabs',
            'Custom keyboard shortcuts documented'
        ],
        screenReader: [
            'All buttons have accessible names',
            'All form inputs have associated labels',
            'Dynamic content updates use aria-live regions',
            'Loading states are announced',
            'Error messages are announced assertively',
            'Decorative images/icons have aria-hidden'
        ],
        visual: [
            'Text contrast ratio >= 4.5:1 (normal) / 3:1 (large)',
            'UI component contrast ratio >= 3:1',
            'Dark mode maintains contrast requirements',
            'Focus indicators visible on all interactive elements',
            'Color is not sole means of conveying information',
            'Content readable at 200% zoom'
        ],
        motion: [
            'prefers-reduced-motion respected',
            'No content flashes more than 3 times per second',
            'Animations can be paused or disabled',
            'Auto-playing content has controls'
        ]
    };

    function getChecklistStatus() {
        const audit = runFullAudit();
        return {
            score: audit.score,
            status: audit.status,
            errorCount: audit.issues.length,
            warningCount: audit.warnings.length,
            passCount: audit.passes.length,
            checklist: CHECKLIST
        };
    }

    return {
        WCAG_CRITERIA,
        runFullAudit,
        CHECKLIST,
        getChecklistStatus
    };
})();
