// ==========================================================================
// Regex Tester Pro — Privacy Policy Generator
// MD 23 Agent 4: Dynamic privacy policy content, CWS disclosures, DPA
// ==========================================================================

const PrivacyPolicyGenerator = (() => {
    'use strict';

    const EXTENSION = {
        name: 'Regex Tester Pro',
        company: 'Zovo',
        contactEmail: 'privacy@zovo.one',
        website: 'https://zovo.one'
    };

    // ── Full Privacy Policy Content ──
    function generatePrivacyPolicy() {
        const date = new Date().toISOString().split('T')[0];

        return {
            title: 'Privacy Policy',
            lastUpdated: date,
            sections: [
                {
                    heading: 'Introduction',
                    content: `${EXTENSION.company} ("we," "us," or "our") operates the ${EXTENSION.name} browser extension. This Privacy Policy explains what information we collect, how we use it, and your rights regarding your data. We are committed to protecting your privacy and processing your data in accordance with applicable data protection laws, including the GDPR and CCPA.`
                },
                {
                    heading: 'Information We Collect',
                    subsections: [
                        {
                            subheading: 'Information You Provide',
                            content: 'Regex patterns and test strings you enter (processed locally, never sent to our servers), extension settings and preferences, Pro subscription license key.'
                        },
                        {
                            subheading: 'Information Collected Automatically',
                            content: 'Extension version and browser type (for compatibility), anonymized feature usage statistics (which features are used, not the content processed), error reports (stack traces without personal data), license verification requests.'
                        },
                        {
                            subheading: 'Information We Do NOT Collect',
                            content: 'We do not collect browsing history, website content, form data, cookies from other websites, personal identification information, or the content of your regex patterns or test strings.'
                        }
                    ]
                },
                {
                    heading: 'How We Use Information',
                    content: 'We use information to: provide and maintain the Extension functionality, verify Pro subscription status, improve the Extension through anonymized analytics, diagnose and fix technical issues, and communicate important updates.'
                },
                {
                    heading: 'Data Storage and Security',
                    content: 'Your regex patterns and test strings are stored locally on your device using Chrome\'s storage API. They are never transmitted to our servers. Settings may be synced across your devices via Chrome Sync if enabled. We implement AES-256 encryption for any data transmitted to our servers and follow industry security best practices.'
                },
                {
                    heading: 'Third-Party Services',
                    content: `We use the following third-party services: Chrome Web Store (distribution), Chrome Sync API (settings synchronization), ${EXTENSION.company} API (license verification and anonymized analytics). We do not sell, trade, or transfer your personal information to third parties for marketing purposes.`
                },
                {
                    heading: 'Your Rights',
                    subsections: [
                        {
                            subheading: 'All Users',
                            content: 'You can access, export, or delete your data at any time through the Extension\'s settings. You can uninstall the Extension to remove all locally stored data.'
                        },
                        {
                            subheading: 'EU/EEA Users (GDPR)',
                            content: 'You have the right to access, rectify, erase, restrict processing, data portability, and object to processing. You can exercise these rights by contacting us at ' + EXTENSION.contactEmail + '.'
                        },
                        {
                            subheading: 'California Users (CCPA)',
                            content: 'You have the right to know what personal information we collect, request deletion of your data, and opt out of the sale of personal information. We do not sell your personal information.'
                        }
                    ]
                },
                {
                    heading: 'Data Retention',
                    content: 'Local data is retained until you delete it or uninstall the Extension. Anonymized analytics are retained for 90 days. License verification records are retained for the duration of your subscription plus 30 days. CCPA/GDPR request logs are retained for 24 months.'
                },
                {
                    heading: 'Children\'s Privacy',
                    content: 'The Extension is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we learn we have collected such information, we will delete it.'
                },
                {
                    heading: 'Changes to This Policy',
                    content: 'We may update this Privacy Policy from time to time. We will notify you of material changes through the Extension or by other means. Your continued use after changes constitutes acceptance.'
                },
                {
                    heading: 'Contact Us',
                    content: `For privacy questions or to exercise your data rights, contact us at ${EXTENSION.contactEmail} or visit ${EXTENSION.website}/privacy.`
                }
            ]
        };
    }

    // ── Chrome Web Store Privacy Disclosures ──
    function generateCWSDisclosures() {
        return {
            singlePurpose: `${EXTENSION.name} provides regex pattern testing, matching, and find/replace functionality.`,
            permissionJustifications: {
                storage: 'Save user patterns, history, and preferences locally',
                activeTab: 'Enable context menu regex testing on selected text',
                contextMenus: 'Add "Test with Regex Tester Pro" option to right-click menu',
                alarms: 'Schedule periodic license verification and data cleanup'
            },
            dataUsage: {
                personallyIdentifiable: false,
                healthInformation: false,
                financialInformation: false,
                authenticationInformation: false,
                personalCommunications: false,
                location: false,
                webHistory: false,
                userActivity: true, // anonymized feature usage
                websiteContent: false
            },
            dataUsagePurposes: {
                userActivity: 'Anonymized feature usage to improve the extension'
            },
            remoteCodePolicy: 'No remote code execution. All functionality is bundled with the extension.'
        };
    }

    // ── Data Processing Addendum (for enterprise) ──
    function generateDPAOutline() {
        return {
            title: 'Data Processing Addendum',
            parties: {
                controller: 'Customer (using the Extension)',
                processor: EXTENSION.company
            },
            processingDetails: {
                subjectMatter: 'Providing regex testing extension functionality',
                duration: 'Duration of the subscription agreement',
                nature: 'Storage, retrieval, and synchronization of user-generated regex patterns',
                purpose: 'Enable regex testing and pattern management',
                dataCategories: ['Regex patterns', 'Test strings', 'User preferences'],
                dataSubjects: ['Extension users']
            },
            securityMeasures: [
                'Encryption of data in transit (TLS 1.2+)',
                'Local-first data processing',
                'Access controls and authentication',
                'Regular security assessments',
                'Incident response procedures',
                'Employee training on data protection'
            ],
            subProcessors: [
                { name: 'Google', service: 'Chrome Sync API', location: 'USA', purpose: 'Settings synchronization' },
                { name: EXTENSION.company, service: 'License API', location: 'EU', purpose: 'Subscription verification' }
            ]
        };
    }

    // ── Render as Markdown ──
    function renderAsMarkdown(policy) {
        const lines = [`# ${policy.title}`, `**Last Updated: ${policy.lastUpdated}**`, ''];
        policy.sections.forEach((section, i) => {
            lines.push(`## ${i + 1}. ${section.heading}`, '');
            if (section.content) lines.push(section.content, '');
            if (section.subsections) {
                section.subsections.forEach(sub => {
                    lines.push(`### ${sub.subheading}`, '', sub.content, '');
                });
            }
        });
        return lines.join('\n');
    }

    return {
        generatePrivacyPolicy,
        generateCWSDisclosures,
        generateDPAOutline,
        renderAsMarkdown
    };
})();
