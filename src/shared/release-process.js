// ==========================================================================
// Regex Tester Pro — Release Process & Migration
// MD 22 Agent 5: Release checklist, breaking change detection, data migration
// ==========================================================================

const ReleaseProcess = (() => {
    'use strict';

    // ── Pre-Release Checklist ──
    const PRE_RELEASE_CHECKLIST = {
        code: [
            'All tests passing',
            'No lint errors or warnings',
            'Bundle size within budget',
            'No console.log statements in production code',
            'All TODO items resolved or tracked'
        ],
        manifest: [
            'Version number bumped correctly',
            'Permissions unchanged or justified',
            'Content Security Policy current',
            'Host permissions minimized'
        ],
        store: [
            'Store description updated if needed',
            'Screenshots current',
            'Privacy practices disclosure accurate',
            'New permissions explained in description'
        ],
        testing: [
            'Manual testing on Chrome Stable',
            'Manual testing on Chrome Beta',
            'Tested fresh install flow',
            'Tested upgrade from previous version',
            'Accessibility audit passed',
            'Performance benchmarks met'
        ],
        rollout: [
            'Changelog entry written',
            'Rollout strategy determined (staged vs full)',
            'Rollback plan documented',
            'Monitoring dashboards ready',
            'Team notified of release'
        ]
    };

    // ── Breaking Change Detection ──
    const BREAKING_CHANGE_PATTERNS = [
        {
            pattern: 'Manifest permissions added',
            detection: (oldManifest, newManifest) => {
                const oldPerms = new Set([...(oldManifest.permissions || []), ...(oldManifest.host_permissions || [])]);
                const newPerms = [...(newManifest.permissions || []), ...(newManifest.host_permissions || [])];
                return newPerms.filter(p => !oldPerms.has(p));
            },
            severity: 'high',
            userAction: 'Extension may be disabled until user re-approves permissions'
        },
        {
            pattern: 'Storage schema changed',
            detection: (oldSchema, newSchema) => {
                const removed = Object.keys(oldSchema).filter(k => !(k in newSchema));
                const typeChanged = Object.keys(oldSchema).filter(k =>
                    k in newSchema && typeof oldSchema[k] !== typeof newSchema[k]
                );
                return [...removed.map(k => `Removed: ${k}`), ...typeChanged.map(k => `Type changed: ${k}`)];
            },
            severity: 'medium',
            userAction: 'User data may need migration'
        },
        {
            pattern: 'API endpoint changed',
            severity: 'low',
            userAction: 'Background requests may fail until extension updates'
        }
    ];

    // ── Data Migration System ──
    const MIGRATIONS = [];

    function registerMigration(fromVersion, toVersion, migrateFn) {
        MIGRATIONS.push({
            from: fromVersion,
            to: toVersion,
            migrate: migrateFn,
            registeredAt: Date.now()
        });
        // Keep sorted by version
        MIGRATIONS.sort((a, b) => compareVersions(a.from, b.from));
    }

    function compareVersions(a, b) {
        const pa = a.split('.').map(Number);
        const pb = b.split('.').map(Number);
        for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
            if ((pa[i] || 0) > (pb[i] || 0)) return 1;
            if ((pa[i] || 0) < (pb[i] || 0)) return -1;
        }
        return 0;
    }

    async function runPendingMigrations() {
        const { lastMigratedVersion } = await chrome.storage.local.get('lastMigratedVersion');
        const currentVersion = chrome.runtime.getManifest().version;

        if (lastMigratedVersion === currentVersion) return { migrated: false };

        const pending = MIGRATIONS.filter(m => {
            if (lastMigratedVersion && compareVersions(m.from, lastMigratedVersion) < 0) return false;
            return compareVersions(m.to, currentVersion) <= 0;
        });

        const results = [];
        for (const migration of pending) {
            try {
                await migration.migrate();
                results.push({ from: migration.from, to: migration.to, status: 'success' });
            } catch (error) {
                results.push({ from: migration.from, to: migration.to, status: 'error', error: error.message });
            }
        }

        await chrome.storage.local.set({ lastMigratedVersion: currentVersion });

        return {
            migrated: results.length > 0,
            results,
            from: lastMigratedVersion || 'fresh',
            to: currentVersion
        };
    }

    // ── Release Automation Helpers ──
    async function getExtensionStats() {
        const manifest = chrome.runtime.getManifest();
        const { versionHistory, featureRequests } = await chrome.storage.local.get(['versionHistory', 'featureRequests']);

        return {
            currentVersion: manifest.version,
            displayVersion: manifest.version_name || manifest.version,
            manifestVersion: manifest.manifest_version,
            permissions: manifest.permissions || [],
            hostPermissions: manifest.host_permissions || [],
            totalFiles: Object.keys(manifest.background || {}).length +
                (manifest.content_scripts?.reduce((sum, cs) => sum + cs.js.length, 0) || 0),
            versionHistory: versionHistory || [],
            pendingFeatureRequests: (featureRequests || []).filter(r => r.status === 'planned').length
        };
    }

    // ── Register Default Migrations ──
    // Example: migrate pattern history format from v0.x to v1.x
    registerMigration('0.9.0', '1.0.0', async () => {
        const { patternHistory } = await chrome.storage.local.get('patternHistory');
        if (patternHistory && Array.isArray(patternHistory)) {
            // Ensure each entry has the new format
            const migrated = patternHistory.map(entry => ({
                pattern: entry.pattern || entry,
                flags: entry.flags || 'g',
                testString: entry.testString || '',
                createdAt: entry.createdAt || Date.now(),
                lastUsedAt: entry.lastUsedAt || Date.now()
            }));
            await chrome.storage.local.set({ patternHistory: migrated });
        }
    });

    return {
        PRE_RELEASE_CHECKLIST,
        BREAKING_CHANGE_PATTERNS,
        registerMigration,
        runPendingMigrations,
        getExtensionStats
    };
})();
