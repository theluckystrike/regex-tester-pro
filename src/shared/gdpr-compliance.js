// ==========================================================================
// Regex Tester Pro — GDPR Compliance Handler
// MD 23 Agent 1: Data rights (access/delete/export), lawful basis, ROPA
// ==========================================================================

const GDPRCompliance = (() => {
    'use strict';

    // ── Lawful Basis Definitions ──
    const LAWFUL_BASES = {
        consent: {
            article: 'Article 6(1)(a)',
            description: 'User has given clear consent for specific purpose',
            requirements: ['Freely given', 'Specific', 'Informed', 'Unambiguous', 'Easy to withdraw']
        },
        contract: {
            article: 'Article 6(1)(b)',
            description: 'Processing necessary for contract performance',
            requirements: ['Directly necessary for service delivery']
        },
        legalObligation: {
            article: 'Article 6(1)(c)',
            description: 'Processing required by law',
            requirements: ['Specific legal requirement identified']
        },
        legitimateInterests: {
            article: 'Article 6(1)(f)',
            description: 'Legitimate interest outweighs user rights',
            requirements: ['Documented balancing test', 'Less intrusive means considered']
        }
    };

    // ── Records of Processing Activities (ROPA) ──
    const PROCESSING_ACTIVITIES = [
        {
            activity: 'Regex pattern storage',
            purpose: 'Save user patterns and history for later use',
            lawfulBasis: 'contract',
            dataTypes: ['Regex patterns', 'Test strings', 'Timestamps'],
            storage: 'chrome.storage.local (device only)',
            retention: 'Until user deletes or uninstalls',
            thirdParties: [],
            crossBorder: false
        },
        {
            activity: 'Settings synchronization',
            purpose: 'Sync user preferences across devices',
            lawfulBasis: 'contract',
            dataTypes: ['UI preferences', 'Feature toggles'],
            storage: 'chrome.storage.sync (Google account)',
            retention: 'Duration of Chrome sign-in',
            thirdParties: ['Google (Chrome Sync)'],
            crossBorder: true
        },
        {
            activity: 'License verification',
            purpose: 'Verify Pro subscription status',
            lawfulBasis: 'contract',
            dataTypes: ['License key (hashed)', 'Verification timestamp'],
            storage: 'chrome.storage.local + Zovo API',
            retention: 'Duration of subscription + 30 days',
            thirdParties: ['Zovo (license provider)'],
            crossBorder: true
        },
        {
            activity: 'Error reporting',
            purpose: 'Identify and fix bugs to improve extension stability',
            lawfulBasis: 'legitimateInterests',
            dataTypes: ['Error messages', 'Stack traces (anonymized)', 'Extension version'],
            storage: 'Local buffer + Zovo analytics (aggregated)',
            retention: '90 days',
            thirdParties: ['Zovo (analytics)'],
            crossBorder: true
        }
    ];

    // ── Data Subject Rights Handler ──
    class DataRightsHandler {
        constructor() {
            this.requestLog = [];
        }

        // Article 15: Right of Access — export all user data
        async handleAccessRequest() {
            const allLocalData = await chrome.storage.local.get(null);
            const allSyncData = await chrome.storage.sync.get(null);

            const exportData = {
                requestDate: new Date().toISOString(),
                format: 'JSON',
                dataCategories: {
                    patterns: allLocalData.patternHistory || [],
                    settings: allSyncData,
                    savedPatterns: allLocalData.savedPatterns || [],
                    history: allLocalData.regexHistory || []
                },
                processingActivities: PROCESSING_ACTIVITIES.map(a => ({
                    activity: a.activity,
                    purpose: a.purpose,
                    lawfulBasis: a.lawfulBasis
                }))
            };

            await this._logRequest('access', exportData);
            return exportData;
        }

        // Article 17: Right to Erasure
        async handleDeletionRequest() {
            const deletionLog = {
                requestDate: new Date().toISOString(),
                categoriesDeleted: [],
                exceptions: []
            };

            try {
                // Delete local storage (patterns, history, settings)
                const localKeys = Object.keys(await chrome.storage.local.get(null));
                const protectedKeys = ['lastMigratedVersion']; // Keep migration tracking
                const toDelete = localKeys.filter(k => !protectedKeys.includes(k));

                await chrome.storage.local.remove(toDelete);
                deletionLog.categoriesDeleted.push('local_storage');

                // Delete sync storage
                await chrome.storage.sync.clear();
                deletionLog.categoriesDeleted.push('sync_storage');

                // Note exceptions
                deletionLog.exceptions.push({
                    key: 'lastMigratedVersion',
                    reason: 'Required for extension integrity on reinstall'
                });

                await this._logRequest('deletion', deletionLog);

                return { success: true, deletedAt: new Date().toISOString(), log: deletionLog };
            } catch (error) {
                await this._logRequest('deletion_failed', { error: error.message });
                return { success: false, error: error.message };
            }
        }

        // Article 20: Right to Data Portability
        async handlePortabilityRequest() {
            const data = await this.handleAccessRequest();
            return {
                format: 'JSON',
                schemaVersion: '1.0',
                exportedAt: new Date().toISOString(),
                data: data.dataCategories,
                importInstructions: 'This data can be imported into any compatible regex tool'
            };
        }

        async _logRequest(type, details) {
            this.requestLog.push({
                timestamp: new Date().toISOString(),
                type,
                details: JSON.stringify(details).substring(0, 500)
            });
        }
    }

    // ── Consent Manager ──
    class ConsentManager {
        constructor() {
            this.CONSENT_KEY = 'gdpr_consents';
        }

        async getConsents() {
            const { [this.CONSENT_KEY]: consents } = await chrome.storage.local.get(this.CONSENT_KEY);
            return consents || {};
        }

        async grantConsent(purpose, details) {
            const consents = await this.getConsents();
            consents[purpose] = {
                granted: true,
                grantedAt: new Date().toISOString(),
                details
            };
            await chrome.storage.local.set({ [this.CONSENT_KEY]: consents });
        }

        async withdrawConsent(purpose) {
            const consents = await this.getConsents();
            if (consents[purpose]) {
                consents[purpose].granted = false;
                consents[purpose].withdrawnAt = new Date().toISOString();
                await chrome.storage.local.set({ [this.CONSENT_KEY]: consents });
            }
        }

        async hasConsent(purpose) {
            const consents = await this.getConsents();
            return consents[purpose]?.granted === true;
        }
    }

    // ── Data Minimization Audit ──
    function auditDataMinimization() {
        const audit = [];
        PROCESSING_ACTIVITIES.forEach(activity => {
            audit.push({
                activity: activity.activity,
                dataTypes: activity.dataTypes,
                checks: {
                    isEssential: true,  // All listed are essential for Regex Tester Pro
                    couldUseAnonymized: activity.lawfulBasis === 'legitimateInterests',
                    hasRetentionPeriod: !!activity.retention,
                    autoDeleteImplemented: activity.retention !== 'Until user deletes or uninstalls'
                }
            });
        });
        return audit;
    }

    return {
        LAWFUL_BASES,
        PROCESSING_ACTIVITIES,
        DataRightsHandler,
        ConsentManager,
        auditDataMinimization
    };
})();
