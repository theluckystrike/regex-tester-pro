// ==========================================================================
// Regex Tester Pro — Customer Support Automation
// MD 19: Self-service diagnostics, issue templates, FAQ
// ==========================================================================

const SupportAutomation = (() => {
    'use strict';

    // ── Self-Service Diagnostics ──
    async function generateDiagnosticReport() {
        const manifest = chrome.runtime.getManifest();
        const { settings, usage, zovoLicense, crashLogs, streakData } = await chrome.storage.local.get([
            'settings', 'usage', 'zovoLicense', 'crashLogs', 'streakData'
        ]);

        return {
            extension: {
                name: manifest.name,
                version: manifest.version,
                manifestVersion: manifest.manifest_version,
                id: chrome.runtime.id
            },
            environment: {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                timestamp: new Date().toISOString()
            },
            license: {
                hasPro: zovoLicense?.valid || false,
                tier: zovoLicense?.tier || 'free',
                lastChecked: zovoLicense?.lastChecked ? new Date(zovoLicense.lastChecked).toISOString() : null
            },
            usage: {
                sessionCount: usage?.sessionCount || 0,
                totalTests: usage?.totalTests || 0,
                currentStreak: streakData?.currentStreak || 0
            },
            health: {
                recentCrashes: (crashLogs || []).filter(l => l.timestamp > Date.now() - 86400000).length,
                totalCrashes: (crashLogs || []).length,
                settingsIntact: typeof settings === 'object',
                storageWorking: true
            }
        };
    }

    // ── Issue Templates ──
    const ISSUE_TEMPLATES = {
        bug: {
            subject: '[Bug] Regex Tester Pro v{version}',
            body: `Bug Report
---
Extension: Regex Tester Pro v{version}
Browser: {userAgent}
Platform: {platform}

What happened:
[Describe the issue]

Expected behavior:
[What you expected to happen]

Steps to reproduce:
1.
2.
3.

Diagnostic ID: {diagnosticId}
`
        },
        feature: {
            subject: '[Feature Request] Regex Tester Pro',
            body: `Feature Request
---
What would you like to see:
[Describe the feature]

Why it would be useful:
[Your use case]

Current workaround (if any):
[How you handle it now]
`
        }
    };

    function getIssueTemplate(type, data = {}) {
        const template = ISSUE_TEMPLATES[type];
        if (!template) return null;

        let body = template.body;
        Object.keys(data).forEach(key => {
            body = body.replace(`{${key}}`, data[key]);
        });

        return {
            subject: template.subject.replace('{version}', data.version || ''),
            body,
            mailto: `mailto:support@zovo.one?subject=${encodeURIComponent(template.subject.replace('{version}', data.version || ''))}&body=${encodeURIComponent(body)}`
        };
    }

    // ── FAQ Knowledge Base ──
    const FAQ = [
        {
            q: 'How do I use the AI regex generator?',
            a: 'Click the sparkle icon, describe your pattern in plain English, and click Generate. Free users get 3 generations per day.'
        },
        {
            q: 'What regex flags are available?',
            a: 'g (Global), i (Case Insensitive), m (Multiline), s (Dot All), u (Unicode), y (Sticky). Toggle them with one click.'
        },
        {
            q: 'How do I test regex on page text?',
            a: 'Select text on any webpage, right-click, and choose "Test regex on selection" from the context menu.'
        },
        {
            q: 'Where is my pattern history stored?',
            a: 'Locally on your device only. It never leaves your browser. You can clear it from the History panel.'
        },
        {
            q: 'What\'s included in Pro?',
            a: 'Unlimited AI generations, multi-flavor regex support, unlimited history, export to multiple formats, and priority support.'
        },
        {
            q: 'How do I enter my license key?',
            a: 'Click the settings icon → scroll to License → paste your key → click Validate.'
        }
    ];

    return {
        generateDiagnosticReport,
        ISSUE_TEMPLATES,
        getIssueTemplate,
        FAQ
    };
})();
