// ==========================================================================
// Regex Tester Pro — Enterprise Security Questionnaire
// MD 25 Agent 4: Pre-filled security questionnaire, DPA template, SLA
// ==========================================================================

const EnterpriseCompliance = (() => {
    'use strict';

    // ── Security Questionnaire (pre-filled for Regex Tester Pro) ──
    const SECURITY_QUESTIONNAIRE = {
        data_handling: [
            {
                question: 'Where is customer data stored?',
                answer: 'All regex patterns and test data are stored locally in the browser via chrome.storage.local. No user content is transmitted to external servers. License validation uses Zovo API (Supabase, US region).'
            },
            {
                question: 'Is data encrypted at rest?',
                answer: 'Data stored in chrome.storage.local is protected by Chrome\'s built-in encryption tied to the user\'s OS profile. License keys in transit use TLS 1.3.'
            },
            {
                question: 'Is data encrypted in transit?',
                answer: 'Yes. The only external request (license verification) uses HTTPS with TLS 1.3. All user content (patterns, test strings) never leaves the browser.'
            },
            {
                question: 'What personal data do you collect?',
                answer: 'None. We do not collect PII. The only data transmitted is a license key (for Pro validation) and extension ID. No user content, browsing data, or analytics are sent externally.'
            }
        ],
        access_control: [
            {
                question: 'How is access to production systems controlled?',
                answer: 'Production API access requires MFA and is restricted to senior engineers. All access is logged and reviewed quarterly.'
            },
            {
                question: 'Do you support SSO/SAML?',
                answer: 'Enterprise tier includes SAML 2.0 SSO integration with Okta, Azure AD, Google Workspace, and OneLogin. JIT provisioning supported.'
            }
        ],
        incident_response: [
            {
                question: 'What is your incident response process?',
                answer: 'We follow NIST incident response framework. Critical issues receive response within 1 hour. All incidents are documented and post-mortems shared with affected customers.'
            },
            {
                question: 'How are customers notified of breaches?',
                answer: 'Within 72 hours via email to designated security contacts, with ongoing updates until resolution. Full post-incident report provided within 14 days.'
            }
        ],
        compliance: [
            {
                question: 'What certifications do you hold?',
                answer: 'GDPR compliant. SOC 2 Type II (in progress). Privacy policy available at zovo.one/privacy.'
            },
            {
                question: 'Do you perform penetration testing?',
                answer: 'Yes. Annual third-party penetration testing with continuous automated vulnerability scanning.'
            }
        ]
    };

    // ── SLA Tiers ──
    const SLA_TIERS = {
        STANDARD: {
            uptime: '99.5%',
            measurement: 'Monthly',
            creditBelow: '10% of monthly fee',
            support: {
                critical: { response: '4 hours', resolution: '24 hours' },
                high: { response: '8 hours', resolution: '48 hours' },
                medium: { response: '24 hours', resolution: '5 business days' },
                low: { response: '48 hours', resolution: 'Best effort' }
            }
        },
        BUSINESS: {
            uptime: '99.9%',
            measurement: 'Monthly',
            creditBelow: '10% < 99.9%, 25% < 99%',
            support: {
                critical: { response: '1 hour', resolution: '4 hours' },
                high: { response: '4 hours', resolution: '8 hours' },
                medium: { response: '8 hours', resolution: '24 hours' },
                low: { response: '24 hours', resolution: 'Best effort' }
            }
        },
        ENTERPRISE: {
            uptime: '99.95%',
            measurement: 'Monthly',
            creditBelow: 'Custom per contract',
            support: {
                critical: { response: '15 minutes', resolution: '4 hours' },
                high: { response: '1 hour', resolution: '8 hours' },
                medium: { response: '4 hours', resolution: '24 hours' },
                low: { response: '24 hours', resolution: 'Best effort' }
            },
            dedicatedCSM: true,
            quarterlyReviews: true
        }
    };

    // ── Lead Scoring (BANT framework) ──
    function scoreEnterpriseLead(lead) {
        let score = 0;

        // Company size
        if (lead.companySize >= 1000) score += 30;
        else if (lead.companySize >= 200) score += 20;
        else if (lead.companySize >= 50) score += 10;

        // Role
        if (/Director|VP|CTO|Head/i.test(lead.role)) score += 20;
        if (/IT|Engineering|Security|DevOps/i.test(lead.department)) score += 15;

        // Engagement
        score += Math.min((lead.pageViews || 0) * 2, 20);
        if (lead.requestedDemo) score += 25;
        if (lead.downloadedWhitepaper) score += 15;
        if (lead.attendedWebinar) score += 15;

        // Budget timing
        if (lead.budgetCycle === 'current') score += 10;

        return Math.min(score, 100);
    }

    function getLeadQuality(score) {
        if (score >= 80) return 'HOT';
        if (score >= 60) return 'WARM';
        if (score >= 40) return 'NURTURE';
        return 'COLD';
    }

    return {
        SECURITY_QUESTIONNAIRE,
        SLA_TIERS,
        scoreEnterpriseLead,
        getLeadQuality
    };
})();
