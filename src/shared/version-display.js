// ==========================================================================
// Regex Tester Pro — Version Display & Comparison
// MD 22 Agent 1: Semantic versioning, version display, badge, comparison
// ==========================================================================

const VersionDisplay = (() => {
    'use strict';

    function getManifest() {
        return chrome.runtime.getManifest();
    }

    // Human-readable version (uses version_name if available)
    function getDisplayVersion() {
        const m = getManifest();
        return m.version_name || m.version;
    }

    // Numeric version string for comparisons
    function getNumericVersion() {
        return getManifest().version;
    }

    // Check if running a pre-release build
    function isPreRelease() {
        const versionName = getManifest().version_name || '';
        return /alpha|beta|rc|canary/i.test(versionName);
    }

    // Compare two version strings (a > b → 1, a < b → -1, equal → 0)
    function compareVersions(a, b) {
        const partsA = a.split('.').map(Number);
        const partsB = b.split('.').map(Number);
        const len = Math.max(partsA.length, partsB.length);

        for (let i = 0; i < len; i++) {
            const va = partsA[i] || 0;
            const vb = partsB[i] || 0;
            if (va > vb) return 1;
            if (va < vb) return -1;
        }
        return 0;
    }

    function isNewerThan(otherVersion) {
        return compareVersions(getNumericVersion(), otherVersion) > 0;
    }

    // Determine version type from version_name
    function getVersionType() {
        const name = (getManifest().version_name || '').toLowerCase();
        if (name.includes('alpha')) return 'alpha';
        if (name.includes('beta')) return 'beta';
        if (name.includes('rc')) return 'rc';
        if (name.includes('canary')) return 'canary';
        return 'stable';
    }

    // Generate HTML badge for popup/options display
    function getVersionBadge() {
        const version = getDisplayVersion();
        const type = getVersionType();
        const colors = {
            stable: { bg: '#e8f5e9', fg: '#2e7d32' },
            beta: { bg: '#fff3e0', fg: '#ef6c00' },
            alpha: { bg: '#ffebee', fg: '#c62828' },
            rc: { bg: '#e3f2fd', fg: '#1565c0' },
            canary: { bg: '#f3e5f5', fg: '#7b1fa2' }
        };
        const c = colors[type] || colors.stable;
        return `<span class="version-badge" style="display:inline-block;padding:2px 8px;border-radius:12px;font-size:12px;font-weight:500;background:${c.bg};color:${c.fg}">${version}</span>`;
    }

    // Bump version locally (for build scripts)
    function bumpVersion(currentVersion, type) {
        const parts = currentVersion.split('.').map(Number);
        while (parts.length < 4) parts.push(0);

        const index = { major: 0, minor: 1, patch: 2, build: 3 }[type];
        if (index === undefined) return currentVersion;

        parts[index]++;
        for (let i = index + 1; i < parts.length; i++) parts[i] = 0;

        // Remove trailing zeros
        while (parts.length > 1 && parts[parts.length - 1] === 0) parts.pop();

        return parts.join('.');
    }

    // Track version history for upgrade/migration detection
    async function trackVersionHistory() {
        const current = getNumericVersion();
        const { versionHistory } = await chrome.storage.local.get('versionHistory');
        const history = versionHistory || [];

        const last = history[history.length - 1];
        if (!last || last.version !== current) {
            history.push({
                version: current,
                displayVersion: getDisplayVersion(),
                type: getVersionType(),
                installedAt: Date.now()
            });

            // Keep last 20 versions
            if (history.length > 20) history.splice(0, history.length - 20);
            await chrome.storage.local.set({ versionHistory: history });
        }

        return {
            current,
            previous: last?.version || null,
            isUpgrade: last ? compareVersions(current, last.version) > 0 : false,
            isDowngrade: last ? compareVersions(current, last.version) < 0 : false,
            isFirstInstall: history.length === 1,
            history
        };
    }

    return {
        getDisplayVersion,
        getNumericVersion,
        isPreRelease,
        compareVersions,
        isNewerThan,
        getVersionType,
        getVersionBadge,
        bumpVersion,
        trackVersionHistory
    };
})();
