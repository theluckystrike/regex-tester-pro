// ==========================================================================
// Regex Tester Pro — Cross-Browser Compatibility
// MD 16: Browser detection, API polyfills, compatibility layer
// ==========================================================================

const CrossBrowser = (() => {
    'use strict';

    // ── Browser Detection ──
    function detectBrowser() {
        const ua = navigator.userAgent;
        if (ua.includes('Edg/')) return 'edge';
        if (ua.includes('OPR/') || ua.includes('Opera')) return 'opera';
        if (ua.includes('Brave')) return 'brave';
        if (ua.includes('Chrome')) return 'chrome';
        if (ua.includes('Firefox')) return 'firefox';
        if (ua.includes('Safari') && !ua.includes('Chrome')) return 'safari';
        return 'unknown';
    }

    // ── API Compatibility Layer ──
    const browserAPI = typeof chrome !== 'undefined' ? chrome :
        typeof browser !== 'undefined' ? browser : null;

    // Polyfill for promise-based API (Firefox uses browser.* with promises natively)
    function getStorage(key) {
        return new Promise((resolve, reject) => {
            if (browserAPI?.storage?.local) {
                browserAPI.storage.local.get(key, (result) => {
                    if (browserAPI.runtime?.lastError) {
                        reject(browserAPI.runtime.lastError);
                    } else {
                        resolve(result);
                    }
                });
            } else {
                reject(new Error('Storage API not available'));
            }
        });
    }

    // ── Feature Detection ──
    const FEATURES = {
        hasNamedGroups: (() => {
            try { new RegExp('(?<test>test)'); return true; } catch (e) { return false; }
        })(),
        hasLookbehind: (() => {
            try { new RegExp('(?<=test)'); return true; } catch (e) { return false; }
        })(),
        hasDotAllFlag: (() => {
            try { new RegExp('.', 's'); return true; } catch (e) { return false; }
        })(),
        hasUnicodeProperty: (() => {
            try { new RegExp('\\p{Letter}', 'u'); return true; } catch (e) { return false; }
        })()
    };

    function getCompatibilityReport() {
        return {
            browser: detectBrowser(),
            userAgent: navigator.userAgent,
            features: FEATURES,
            apiAvailable: !!browserAPI,
            manifestVersion: browserAPI?.runtime?.getManifest?.()?.manifest_version || 'unknown'
        };
    }

    return {
        detectBrowser,
        browserAPI,
        getStorage,
        FEATURES,
        getCompatibilityReport
    };
})();
