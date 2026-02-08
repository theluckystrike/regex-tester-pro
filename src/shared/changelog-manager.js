// ==========================================================================
// Regex Tester Pro — Changelog Automation
// MD 22 Agent 4: Changelog generator, "What's New" UI, update notifications
// ==========================================================================

const ChangelogManager = (() => {
    'use strict';

    // ── Changelog Entry Types ──
    const CHANGE_TYPES = {
        FEATURE: { label: 'New', icon: '✨', color: '#22c55e' },
        IMPROVEMENT: { label: 'Improved', icon: '⚡', color: '#3b82f6' },
        FIX: { label: 'Fixed', icon: '🐛', color: '#ef4444' },
        SECURITY: { label: 'Security', icon: '🔒', color: '#f59e0b' },
        DEPRECATED: { label: 'Deprecated', icon: '⚠️', color: '#f97316' },
        BREAKING: { label: 'Breaking', icon: '💥', color: '#dc2626' }
    };

    // ── Changelog Data ──
    const CHANGELOG = [
        {
            version: '1.0.0',
            date: '2026-02-08',
            title: 'Initial Release',
            entries: [
                { type: 'FEATURE', text: 'Real-time regex testing with instant match highlighting' },
                { type: 'FEATURE', text: 'Capture group extraction and display' },
                { type: 'FEATURE', text: 'Find and replace mode' },
                { type: 'FEATURE', text: 'Pattern history with auto-save' },
                { type: 'FEATURE', text: 'Dark mode support' },
                { type: 'FEATURE', text: 'Keyboard shortcuts for power users' }
            ]
        }
    ];

    // ── Add New Release ──
    function addRelease(version, title, entries) {
        CHANGELOG.unshift({
            version,
            date: new Date().toISOString().split('T')[0],
            title,
            entries
        });
    }

    // ── Get Latest Release ──
    function getLatestRelease() {
        return CHANGELOG[0] || null;
    }

    // ── Get Releases Since Version ──
    function getReleasesSince(version) {
        const idx = CHANGELOG.findIndex(r => r.version === version);
        if (idx === -1) return CHANGELOG;
        return CHANGELOG.slice(0, idx);
    }

    // ── Generate "What's New" HTML ──
    function generateWhatsNewHTML(releases) {
        if (!releases || releases.length === 0) return '';

        return releases.map(release => {
            const entriesHTML = release.entries.map(entry => {
                const type = CHANGE_TYPES[entry.type] || CHANGE_TYPES.IMPROVEMENT;
                return `
          <div style="display:flex;align-items:flex-start;gap:8px;padding:6px 0">
            <span style="display:inline-block;padding:1px 6px;border-radius:4px;font-size:11px;font-weight:600;background:${type.color}20;color:${type.color};white-space:nowrap">${type.label}</span>
            <span style="font-size:13px;color:var(--text-primary,#e0e0e0)">${entry.text}</span>
          </div>
        `;
            }).join('');

            return `
        <div style="margin-bottom:16px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <span style="font-weight:600;font-size:14px;color:var(--text-primary,#e0e0e0)">v${release.version}</span>
            <span style="font-size:12px;color:var(--text-secondary,#888)">${release.date}</span>
          </div>
          ${release.title ? `<div style="font-size:13px;color:var(--text-secondary,#aaa);margin-bottom:8px">${release.title}</div>` : ''}
          ${entriesHTML}
        </div>
      `;
        }).join('<hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:12px 0">');
    }

    // ── Generate Markdown Changelog ──
    function generateMarkdown() {
        const lines = ['# Changelog', ''];

        CHANGELOG.forEach(release => {
            lines.push(`## ${release.version} (${release.date})`);
            if (release.title) lines.push(`> ${release.title}`);
            lines.push('');

            // Group entries by type
            const grouped = {};
            release.entries.forEach(entry => {
                if (!grouped[entry.type]) grouped[entry.type] = [];
                grouped[entry.type].push(entry.text);
            });

            for (const [type, items] of Object.entries(grouped)) {
                const label = CHANGE_TYPES[type]?.label || type;
                lines.push(`### ${label}`);
                items.forEach(item => lines.push(`- ${item}`));
                lines.push('');
            }
        });

        return lines.join('\n');
    }

    // ── Update Notification (show after version upgrade) ──
    async function checkAndShowUpdateNotification() {
        const { lastSeenVersion } = await chrome.storage.local.get('lastSeenVersion');
        const currentVersion = chrome.runtime.getManifest().version;

        if (lastSeenVersion === currentVersion) return null;

        const newReleases = lastSeenVersion ? getReleasesSince(lastSeenVersion) : [getLatestRelease()].filter(Boolean);

        if (newReleases.length > 0) {
            await chrome.storage.local.set({ lastSeenVersion: currentVersion });
            return {
                isUpdate: !!lastSeenVersion,
                releases: newReleases,
                html: generateWhatsNewHTML(newReleases)
            };
        }

        await chrome.storage.local.set({ lastSeenVersion: currentVersion });
        return null;
    }

    return {
        CHANGE_TYPES,
        CHANGELOG,
        addRelease,
        getLatestRelease,
        getReleasesSince,
        generateWhatsNewHTML,
        generateMarkdown,
        checkAndShowUpdateNotification
    };
})();
