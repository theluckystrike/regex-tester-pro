// ==========================================================================
// Regex Tester Pro — Version & Release Management
// MD 22: Semantic versioning, changelog, migration runner
// ==========================================================================

const VersionManager = (() => {
    'use strict';

    // ── Semantic Version Helpers ──
    function parseVersion(versionStr) {
        const [major, minor, patch] = versionStr.split('.').map(Number);
        return { major, minor, patch };
    }

    function compareVersions(a, b) {
        const va = parseVersion(a);
        const vb = parseVersion(b);
        if (va.major !== vb.major) return va.major - vb.major;
        if (va.minor !== vb.minor) return va.minor - vb.minor;
        return va.patch - vb.patch;
    }

    function isNewerVersion(current, previous) {
        return compareVersions(current, previous) > 0;
    }

    // ── Migration Runner ──
    const MIGRATIONS = {
        '1.1.0': async () => {
            // Example: Add new default settings introduced in v1.1.0
            const { settings } = await chrome.storage.local.get('settings');
            if (settings && !settings.hasOwnProperty('autoSave')) {
                settings.autoSave = true;
                await chrome.storage.local.set({ settings });
            }
        },
        '1.2.0': async () => {
            // Example: Restructure history format
            const { history } = await chrome.storage.local.get('history');
            if (Array.isArray(history) && history.length > 0 && typeof history[0] === 'string') {
                // Migrate from string format to object format
                const migrated = history.map(pattern => ({
                    pattern,
                    flags: 'g',
                    testString: '',
                    savedAt: Date.now()
                }));
                await chrome.storage.local.set({ history: migrated });
            }
        }
    };

    async function runMigrations(fromVersion, toVersion) {
        const migrationVersions = Object.keys(MIGRATIONS).sort(compareVersions);
        const toRun = migrationVersions.filter(v =>
            compareVersions(v, fromVersion) > 0 && compareVersions(v, toVersion) <= 0
        );

        for (const version of toRun) {
            try {
                await MIGRATIONS[version]();
                console.log(`[VersionManager] Migration ${version} completed`);
            } catch (e) {
                console.error(`[VersionManager] Migration ${version} failed:`, e);
            }
        }

        // Record successful migration
        await chrome.storage.local.set({
            lastMigratedVersion: toVersion,
            lastMigrationDate: Date.now()
        });
    }

    // ── Changelog ──
    const CHANGELOG = [
        {
            version: '1.0.0',
            date: '2026-02-07',
            changes: [
                'Initial release',
                'Real-time regex testing with match highlighting',
                'Capture group viewer (named + numbered)',
                'AI regex generation (3/day free tier)',
                'Pattern history with auto-save',
                'Find & replace with backreferences',
                'Context menu for testing selection',
                'Dark mode support',
                'Zovo Pro integration'
            ]
        }
    ];

    function getChangelog(sinceVersion = null) {
        if (!sinceVersion) return CHANGELOG;
        return CHANGELOG.filter(entry => compareVersions(entry.version, sinceVersion) > 0);
    }

    return {
        parseVersion,
        compareVersions,
        isNewerVersion,
        runMigrations,
        CHANGELOG,
        getChangelog
    };
})();
