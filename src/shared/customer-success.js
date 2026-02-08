// ==========================================================================
// Regex Tester Pro — Customer Success & Onboarding
// MD 25 Agent 5: Onboarding playbook, health scoring, SLA, expansion
// ==========================================================================

const CustomerSuccess = (() => {
    'use strict';

    // ── Onboarding Playbook ──
    const ONBOARDING_MILESTONES = {
        kickoff: {
            day: 0,
            name: 'Kickoff',
            tasks: [
                'Welcome call with stakeholders',
                'Confirm success criteria and KPIs',
                'Establish communication cadence',
                'Provide admin access and documentation',
                'Share onboarding timeline'
            ],
            owner: 'Customer Success Manager',
            deliverable: 'Kickoff summary email with success plan'
        },
        technicalSetup: {
            day: 7,
            name: 'Technical Setup',
            tasks: [
                'SSO/SAML configuration',
                'User provisioning setup (manual or SCIM)',
                'Policy configuration per organization requirements',
                'Integration with existing development tools',
                'Security review and sign-off'
            ],
            owner: 'Solutions Engineer',
            deliverable: 'Technical completion checklist'
        },
        pilotRollout: {
            day: 14,
            name: 'Pilot Rollout',
            tasks: [
                'Identify pilot group (10-20 power users)',
                'Conduct pilot training session',
                'Set up feedback collection process',
                'Establish success metrics baseline',
                'Daily check-ins during first week'
            ],
            owner: 'CSM',
            deliverable: 'Pilot launch confirmation with baseline metrics'
        },
        fullRollout: {
            day: 30,
            name: 'Full Rollout',
            tasks: [
                'Review pilot success metrics',
                'Create full deployment plan',
                'Distribute training materials and video walkthroughs',
                'Conduct all-hands training session',
                'Confirm support escalation paths'
            ],
            owner: 'CSM',
            deliverable: 'Rollout complete confirmation'
        },
        optimization: {
            day: 60,
            name: 'Optimization',
            tasks: [
                'First business review with stakeholders',
                'Usage analytics review',
                'Feature adoption assessment',
                'Identify expansion opportunities',
                'Document first success stories'
            ],
            owner: 'CSM',
            deliverable: 'Business review presentation'
        }
    };

    // ── Customer Health Score ──
    function calculateHealthScore(metrics) {
        let score = 0;
        const factors = [];

        // Usage (0-30)
        const usageRate = metrics.activeUsers / Math.max(metrics.totalSeats, 1);
        const usageScore = Math.round(usageRate * 30);
        score += usageScore;
        factors.push({ name: 'Usage', score: usageScore, max: 30, detail: `${Math.round(usageRate * 100)}% seat utilization` });

        // Engagement (0-25)
        const weeklyActive = metrics.weeklyActiveRatio || 0;
        const engagementScore = Math.round(weeklyActive * 25);
        score += engagementScore;
        factors.push({ name: 'Engagement', score: engagementScore, max: 25, detail: `${Math.round(weeklyActive * 100)}% weekly active` });

        // Support (0-20)
        const supportScore = metrics.openTickets === 0 ? 20
            : metrics.openTickets <= 2 ? 15
                : metrics.openTickets <= 5 ? 10
                    : 5;
        score += supportScore;
        factors.push({ name: 'Support', score: supportScore, max: 20, detail: `${metrics.openTickets || 0} open tickets` });

        // Feature adoption (0-15)
        const featureAdoption = metrics.featuresUsed / Math.max(metrics.totalFeatures || 10, 1);
        const featureScore = Math.round(featureAdoption * 15);
        score += featureScore;
        factors.push({ name: 'Feature Adoption', score: featureScore, max: 15, detail: `${metrics.featuresUsed || 0}/${metrics.totalFeatures || 10} features` });

        // Relationship (0-10)
        const relationshipScore = metrics.lastCheckIn && (Date.now() - metrics.lastCheckIn < 30 * 86400000) ? 10
            : metrics.lastCheckIn && (Date.now() - metrics.lastCheckIn < 60 * 86400000) ? 5
                : 0;
        score += relationshipScore;
        factors.push({ name: 'Relationship', score: relationshipScore, max: 10, detail: metrics.lastCheckIn ? `Last check-in ${Math.round((Date.now() - metrics.lastCheckIn) / 86400000)}d ago` : 'No recent check-in' });

        const status = score >= 80 ? 'healthy' : score >= 50 ? 'at-risk' : 'critical';

        return {
            score,
            status,
            factors,
            recommendation: status === 'critical' ? 'Schedule urgent executive review'
                : status === 'at-risk' ? 'Schedule proactive check-in this week'
                    : 'Continue regular cadence'
        };
    }

    // ── SLA Tracking ──
    const SLA_TIERS = {
        standard: {
            uptime: 99.5,
            support: { critical: '4h', high: '8h', medium: '24h', low: '48h' },
            credits: { below995: 0.10 }
        },
        business: {
            uptime: 99.9,
            support: { critical: '1h', high: '4h', medium: '8h', low: '24h' },
            credits: { below999: 0.10, below99: 0.25 }
        },
        enterprise: {
            uptime: 99.95,
            support: { critical: '15min', high: '1h', medium: '4h', low: '8h' },
            credits: { custom: true }
        }
    };

    // ── Expansion Signals ──
    function identifyExpansionSignals(account) {
        const signals = [];

        if (account.seatUtilization > 0.90) {
            signals.push({ type: 'seat_expansion', priority: 'high', message: 'Seat utilization above 90% — time to discuss adding seats' });
        }

        if (account.featureRequestCount > 3) {
            signals.push({ type: 'feature_upgrade', priority: 'medium', message: 'Multiple feature requests may indicate need for higher tier' });
        }

        if (account.teamCount > 1 && account.tier === 'TEAM') {
            signals.push({ type: 'tier_upgrade', priority: 'high', message: 'Multiple teams using — recommend Business tier' });
        }

        if (account.apiUsageGrowing) {
            signals.push({ type: 'api_expansion', priority: 'medium', message: 'Growing API usage suggests deeper integration needs' });
        }

        if (account.renewalInDays < 60) {
            signals.push({ type: 'renewal', priority: 'high', message: `Renewal in ${account.renewalInDays} days — proactive reach out` });
        }

        return signals;
    }

    // ── Quarterly Business Review Template ──
    const QBR_TEMPLATE = {
        sections: [
            { title: 'Executive Summary', items: ['Key achievements', 'Metrics overview', 'Health score trend'] },
            { title: 'Usage & Adoption', items: ['Seat utilization', 'Feature adoption rates', 'Top power users', 'Usage trends'] },
            { title: 'Value Delivered', items: ['Time saved (estimated)', 'Error reduction', 'ROI calculation update'] },
            { title: 'Support Review', items: ['Ticket summary', 'Response time performance', 'Open issues'] },
            { title: 'Product Roadmap', items: ['Upcoming features', 'Customer-requested features', 'Beta opportunities'] },
            { title: 'Growth Opportunities', items: ['Additional seats', 'Tier upgrade', 'New team rollout', 'Training needs'] },
            { title: 'Action Items', items: ['Next steps', 'Owners', 'Deadlines'] }
        ]
    };

    return {
        ONBOARDING_MILESTONES,
        calculateHealthScore,
        SLA_TIERS,
        identifyExpansionSignals,
        QBR_TEMPLATE
    };
})();
