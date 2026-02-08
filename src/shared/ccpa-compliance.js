// ==========================================================================
// Regex Tester Pro — CCPA Compliance Handler
// MD 23 Agent 2: Do Not Sell, consumer rights, Global Privacy Control
// ==========================================================================

const CCPACompliance = (() => {
    'use strict';

    const DNS_KEY = 'ccpa_do_not_sell';
    const CCPA_LOG_KEY = 'ccpa_request_log';

    // ── Do Not Sell / Share Implementation ──
    class DoNotSellManager {
        async hasOptedOut() {
            const { [DNS_KEY]: optedOut } = await chrome.storage.sync.get(DNS_KEY);
            return optedOut === true;
        }

        async optOut() {
            await chrome.storage.sync.set({
                [DNS_KEY]: true,
                [`${DNS_KEY}_date`]: new Date().toISOString()
            });
            await this._enforceOptOut();
            await _logRequest('dns_opt_out');
            return true;
        }

        async optIn() {
            await chrome.storage.sync.set({
                [DNS_KEY]: false,
                [`${DNS_KEY}_date`]: new Date().toISOString()
            });
            await _logRequest('dns_opt_in');
            return true;
        }

        // Respect Global Privacy Control (GPC) signal
        checkGlobalPrivacyControl() {
            return typeof navigator !== 'undefined' && navigator.globalPrivacyControl === true;
        }

        async _enforceOptOut() {
            // Disable any analytics that could share data with third parties
            await chrome.storage.local.set({
                analyticsEnabled: false,
                thirdPartySharing: false
            });
        }
    }

    // ── Consumer Rights Handler ──
    // CCPA Rights: Know, Access, Delete, Opt-Out, Non-Discrimination
    class ConsumerRightsHandler {
        // Right to Know — what personal info is collected and why
        async handleKnowRequest() {
            const categories = {
                identifiers: {
                    collected: false,
                    examples: 'We do not collect names, emails, or other identifiers',
                    purpose: 'N/A'
                },
                commercialInfo: {
                    collected: true,
                    examples: 'License key status (Pro vs Free)',
                    purpose: 'Provide subscription services',
                    sources: 'Directly from user purchase'
                },
                internetActivity: {
                    collected: false,
                    examples: 'We do not track browsing history',
                    purpose: 'N/A'
                },
                geolocation: {
                    collected: false,
                    examples: 'No geolocation data collected',
                    purpose: 'N/A'
                },
                inferentialData: {
                    collected: true,
                    examples: 'Feature usage frequency (anonymized)',
                    purpose: 'Improve extension features',
                    sources: 'Generated from user interaction'
                }
            };

            await _logRequest('right_to_know');

            return {
                requestDate: new Date().toISOString(),
                responseDeadline: _addDays(45),
                categories,
                dataSold: false,
                dataSharedForBusiness: ['License verification with Zovo API'],
                retentionPolicy: 'Data retained until user deletes or uninstalls'
            };
        }

        // Right to Access — provide copy of personal info
        async handleAccessRequest() {
            const allLocal = await chrome.storage.local.get(null);
            const allSync = await chrome.storage.sync.get(null);

            // Filter out internal/non-personal data
            const personalData = {
                patterns: allLocal.patternHistory || [],
                savedPatterns: allLocal.savedPatterns || [],
                preferences: allSync,
                licenseStatus: allLocal.licenseStatus || 'free'
            };

            await _logRequest('right_to_access');

            return {
                requestDate: new Date().toISOString(),
                responseDeadline: _addDays(45),
                data: personalData,
                format: 'JSON'
            };
        }

        // Right to Delete — remove personal information
        async handleDeleteRequest() {
            const deletionResult = {
                requestDate: new Date().toISOString(),
                responseDeadline: _addDays(45),
                deleted: [],
                retained: []
            };

            try {
                // Delete user-generated content
                await chrome.storage.local.remove([
                    'patternHistory', 'savedPatterns', 'regexHistory',
                    'testStrings', 'userPreferences'
                ]);
                deletionResult.deleted.push('patterns', 'history', 'preferences');

                // Clear sync data
                await chrome.storage.sync.clear();
                deletionResult.deleted.push('synced_preferences');

                // Retain only what's legally required
                deletionResult.retained.push({
                    category: 'Request log',
                    reason: 'CCPA compliance record keeping (24 months)',
                    deletionDate: _addDays(730)
                });

                deletionResult.success = true;
                await _logRequest('right_to_delete', deletionResult);
            } catch (error) {
                deletionResult.success = false;
                deletionResult.error = error.message;
            }

            return deletionResult;
        }
    }

    // ── Verification (CCPA requires identity verification) ──
    const VerificationLevels = {
        low: { description: 'Email confirmation', forTypes: ['know'] },
        medium: { description: 'Email + account match', forTypes: ['access'] },
        high: { description: 'Multi-factor verification', forTypes: ['delete'] }
    };

    function getRequiredVerificationLevel(requestType) {
        for (const [level, config] of Object.entries(VerificationLevels)) {
            if (config.forTypes.includes(requestType)) return level;
        }
        return 'medium';
    }

    // ── Required Disclosures ──
    const REQUIRED_DISCLOSURES = {
        categoriesCollected: [
            'User-generated regex patterns and test strings',
            'Extension settings and preferences',
            'Anonymized feature usage metrics',
            'License/subscription status'
        ],
        sources: [
            'Directly from user input',
            'Generated from extension usage'
        ],
        purposes: [
            'Provide regex testing functionality',
            'Sync preferences across devices',
            'Verify subscription status',
            'Improve extension features'
        ],
        categoriesSold: [],
        categoriesDisclosed: [
            'License verification data (Zovo API)'
        ]
    };

    // ── Internal Helpers ──
    async function _logRequest(type, details = {}) {
        const { [CCPA_LOG_KEY]: logs = [] } = await chrome.storage.local.get(CCPA_LOG_KEY);
        logs.push({
            timestamp: new Date().toISOString(),
            type,
            details: JSON.stringify(details).substring(0, 300)
        });
        // Retain logs for 24 months per CCPA requirement
        const cutoff = Date.now() - (730 * 24 * 60 * 60 * 1000);
        const filtered = logs.filter(l => new Date(l.timestamp).getTime() > cutoff);
        await chrome.storage.local.set({ [CCPA_LOG_KEY]: filtered });
    }

    function _addDays(days) {
        return new Date(Date.now() + days * 86400000).toISOString().split('T')[0];
    }

    return {
        DoNotSellManager,
        ConsumerRightsHandler,
        VerificationLevels,
        getRequiredVerificationLevel,
        REQUIRED_DISCLOSURES
    };
})();
