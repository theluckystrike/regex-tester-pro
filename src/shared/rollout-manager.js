// ==========================================================================
// Regex Tester Pro — Staged Rollout Strategy
// MD 22 Agent 3: Rollout stages, health evaluation, rollback procedures
// ==========================================================================

const RolloutManager = (() => {
    'use strict';

    // ── 5-Stage Rollout Pipeline ──
    const ROLLOUT_STAGES = {
        canary: {
            name: 'Canary',
            percentage: 1,
            duration: '24 hours',
            criteria: {
                maxErrorRate: 0.001,   // <0.1%
                maxCrashRate: 0.0001,  // <0.01%
                maxUserComplaints: 0
            },
            onSuccess: 'Proceed to internal',
            onFailure: 'Halt and investigate'
        },
        internal: {
            name: 'Internal / Team',
            percentage: 5,
            duration: '24-48 hours',
            criteria: {
                maxErrorRate: 0.005,    // <0.5%
                maxCrashRate: 0.0005,   // <0.05%
                maxPerformanceRegression: 0.10  // <10%
            },
            onSuccess: 'Proceed to early adopters',
            onFailure: 'Rollback and fix'
        },
        earlyAdopters: {
            name: 'Early Adopters',
            percentage: 10,
            duration: '2-3 days',
            criteria: {
                maxErrorRate: 0.01,     // <1%
                minUserRating: 4.0,
                noSupportSpike: true
            },
            onSuccess: 'Proceed to broad rollout',
            onFailure: 'Pause and assess'
        },
        broad: {
            name: 'Broad Rollout',
            percentage: 50,
            duration: '3-5 days',
            criteria: {
                maxErrorRate: 0.01,
                noUninstallSpike: true,
                featureAdoptionOnTarget: true
            },
            onSuccess: 'Proceed to full release',
            onFailure: 'Pause or rollback'
        },
        full: {
            name: 'Full Release',
            percentage: 100,
            duration: 'Indefinite',
            criteria: {
                stability: 'maintained',
                userSatisfaction: 'positive'
            }
        }
    };

    // ── Rollout Health Evaluator ──
    function evaluateRolloutHealth(metrics) {
        const health = {
            version: metrics.version || 'unknown',
            timestamp: new Date().toISOString(),
            recommendation: 'continue',
            issues: [],
            scores: {}
        };

        // Error rate
        const errorRate = (metrics.errorCount || 0) / Math.max(metrics.totalSessions || 1, 1);
        health.scores.errorRate = errorRate;
        if (errorRate > 0.05) {
            health.issues.push(`Critical error rate: ${(errorRate * 100).toFixed(2)}%`);
            health.recommendation = 'rollback';
        } else if (errorRate > 0.01) {
            health.issues.push(`Elevated error rate: ${(errorRate * 100).toFixed(2)}%`);
            if (health.recommendation === 'continue') health.recommendation = 'pause';
        }

        // Performance regression
        if (metrics.avgLoadTime && metrics.baselineLoadTime) {
            const regression = (metrics.avgLoadTime - metrics.baselineLoadTime) / metrics.baselineLoadTime;
            health.scores.performanceRegression = regression;
            if (regression > 0.20) {
                health.issues.push(`Performance regression: ${(regression * 100).toFixed(1)}%`);
                if (health.recommendation === 'continue') health.recommendation = 'pause';
            }
        }

        // Uninstall rate
        if (metrics.uninstalls && metrics.activeUsers) {
            const uninstallRate = metrics.uninstalls / metrics.activeUsers;
            health.scores.uninstallRate = uninstallRate;
            if (metrics.baselineUninstallRate && uninstallRate > metrics.baselineUninstallRate * 1.5) {
                health.issues.push('Elevated uninstall rate');
                if (health.recommendation === 'continue') health.recommendation = 'pause';
            }
        }

        // Support tickets
        if (metrics.newTickets && metrics.avgDailyTickets) {
            health.scores.ticketSpike = metrics.newTickets / metrics.avgDailyTickets;
            if (metrics.newTickets > metrics.avgDailyTickets * 2) {
                health.issues.push('Support ticket spike detected');
                if (health.recommendation === 'continue') health.recommendation = 'pause';
            }
        }

        return health;
    }

    // ── Generate Rollout Report ──
    function generateReport(health) {
        const lines = [
            `# Rollout Health Report`,
            `Version: ${health.version}`,
            `Generated: ${health.timestamp}`,
            `Recommendation: ${health.recommendation.toUpperCase()}`,
            '',
            '## Scores'
        ];

        for (const [key, value] of Object.entries(health.scores)) {
            lines.push(`- ${key}: ${typeof value === 'number' ? (value * 100).toFixed(2) + '%' : value}`);
        }

        if (health.issues.length > 0) {
            lines.push('', '## Issues');
            health.issues.forEach(i => lines.push(`- ${i}`));
        }

        lines.push('', '## Action');
        if (health.recommendation === 'continue') lines.push('Safe to increase rollout percentage.');
        else if (health.recommendation === 'pause') lines.push('Pause rollout. Investigate issues before proceeding.');
        else lines.push('URGENT: Initiate rollback immediately.');

        return lines.join('\n');
    }

    // ── Rollback Procedure ──
    const ROLLBACK_CHECKLIST = [
        'Submit previous stable version to CWS',
        'Set rollout to 100% for rollback version',
        'Notify affected users via changelog',
        'Document incident cause in post-mortem',
        'Verify rollback via crash/error dashboards',
        'Communicate status to stakeholders',
        'Create fix branch and test thoroughly before re-release'
    ];

    // ── Track Current Rollout State ──
    async function getRolloutState() {
        const { rolloutState } = await chrome.storage.local.get('rolloutState');
        return rolloutState || {
            stage: 'full',
            percentage: 100,
            startedAt: null,
            lastEvaluatedAt: null
        };
    }

    async function updateRolloutState(updates) {
        const current = await getRolloutState();
        const updated = { ...current, ...updates, lastEvaluatedAt: Date.now() };
        await chrome.storage.local.set({ rolloutState: updated });
        return updated;
    }

    return {
        ROLLOUT_STAGES,
        evaluateRolloutHealth,
        generateReport,
        ROLLBACK_CHECKLIST,
        getRolloutState,
        updateRolloutState
    };
})();
