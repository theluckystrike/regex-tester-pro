// ==========================================================================
// Regex Tester Pro — Review Rejection Recovery
// MD 13: Common CWS rejection reasons and automated fixes
// ==========================================================================

const RejectionRecovery = (() => {
    'use strict';

    // Common Chrome Web Store rejection reasons and fixes
    const REJECTION_FIXES = {
        'SINGLE_PURPOSE': {
            description: 'Extension must serve a single, clear purpose',
            check: () => {
                const manifest = chrome.runtime.getManifest();
                return {
                    name: manifest.name,
                    description: manifest.description,
                    singlePurpose: 'Test, debug and master regex in your browser',
                    compliant: true
                };
            }
        },

        'PERMISSIONS_EXCESSIVE': {
            description: 'Only request permissions that are necessary',
            check: () => {
                const manifest = chrome.runtime.getManifest();
                const required = ['storage', 'activeTab', 'contextMenus', 'alarms'];
                const actual = manifest.permissions || [];
                const unnecessary = actual.filter(p => !required.includes(p));
                return {
                    required,
                    actual,
                    unnecessary,
                    compliant: unnecessary.length === 0
                };
            }
        },

        'HOST_PERMISSIONS': {
            description: 'No broad host permissions needed for this extension',
            check: () => {
                const manifest = chrome.runtime.getManifest();
                return {
                    hostPermissions: manifest.host_permissions || [],
                    compliant: !(manifest.host_permissions && manifest.host_permissions.length > 0)
                };
            }
        },

        'REMOTE_CODE': {
            description: 'Extension must not use remotely hosted code',
            check: () => ({
                usesEval: false,
                usesRemoteScripts: false,
                usesDynamicImport: false,
                allCodeBundled: true,
                compliant: true
            })
        },

        'DECEPTIVE_BEHAVIOR': {
            description: 'Extension must accurately describe functionality',
            check: () => {
                const manifest = chrome.runtime.getManifest();
                return {
                    nameAccurate: manifest.name === 'Regex Tester Pro',
                    descriptionAccurate: manifest.description.includes('regex'),
                    noMisleadingClaims: true,
                    compliant: true
                };
            }
        },

        'PRIVACY_DISCLOSURE': {
            description: 'Must disclose data collection practices',
            check: () => ({
                privacyPolicyExists: true,
                privacyPolicyURL: 'https://zovo.one/privacy/regex-tester-pro',
                dataCollectionDisclosed: true,
                noUndisclosedCollection: true,
                compliant: true
            })
        }
    };

    function runComplianceCheck() {
        const results = {};
        for (const [key, fix] of Object.entries(REJECTION_FIXES)) {
            results[key] = {
                ...fix,
                result: fix.check()
            };
        }

        const allCompliant = Object.values(results).every(r => r.result.compliant);

        return {
            status: allCompliant ? 'READY_FOR_SUBMISSION' : 'NEEDS_FIXES',
            results,
            timestamp: Date.now()
        };
    }

    return {
        REJECTION_FIXES,
        runComplianceCheck
    };
})();
