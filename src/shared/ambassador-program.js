// ==========================================================================
// Regex Tester Pro — Ambassador Program
// MD 26 Agent 4: Ambassador tiers, applications, tracking, management
// ==========================================================================

const AmbassadorProgram = (() => {
    'use strict';

    // ── Ambassador Tiers ──
    const AMBASSADOR_TIERS = {
        advocate: {
            name: 'Advocate',
            requirements: [
                'Active community member for 3+ months',
                'Contributed 20+ helpful posts',
                'Completed ambassador application'
            ],
            benefits: [
                'Free Pro subscription',
                'Ambassador badge and flair',
                'Early feature access',
                'Exclusive Discord channel'
            ],
            responsibilities: [
                'Help 5+ members per month',
                'Share 2+ social posts per month',
                'Provide beta feedback'
            ]
        },
        champion: {
            name: 'Champion',
            requirements: [
                'Advocate for 6+ months',
                '50+ accepted answers',
                'Created original regex content'
            ],
            benefits: [
                'Lifetime Pro subscription',
                'Champion badge and swag',
                'Direct team access',
                'Conference sponsorship',
                'Quarterly stipend ($100)'
            ],
            responsibilities: [
                'Mentor new advocates',
                'Create 1+ tutorial per quarter',
                'Participate in product roadmap discussions',
                'Represent at events'
            ]
        },
        founding: {
            name: 'Founding Ambassador',
            requirements: [
                'Top 10 contributor of all time',
                'Exceptional community impact'
            ],
            benefits: [
                'All Champion benefits',
                'Advisory board seat',
                'Revenue share option',
                'Personalized recognition'
            ],
            responsibilities: [
                'Strategic input on community direction',
                'Public advocacy and thought leadership',
                'Annual community keynote'
            ]
        }
    };

    // ── Application System ──
    const APPLICATION_CONFIG = {
        questions: [
            'Why do you want to be an ambassador for Regex Tester Pro?',
            'What would you contribute to the community?',
            'Share links to your helpful posts or content',
            'How did you discover and start using Regex Tester Pro?',
            'What is your favorite regex trick or pattern?'
        ],
        reviewProcess: 'Team review within 1 week',
        cohortSize: 10,
        cohortFrequency: 'quarterly'
    };

    // ── Ambassador Onboarding Checklist ──
    const ONBOARDING_CHECKLIST = {
        week1: {
            name: 'Welcome',
            tasks: [
                'Welcome call with community manager',
                'Added to ambassador channels',
                'Receive ambassador kit (guidelines, resources)',
                'Connect with ambassador buddy'
            ]
        },
        week2: {
            name: 'Training',
            tasks: [
                'Complete ambassador certification',
                'Learn product roadmap overview',
                'Review brand guidelines',
                'Practice answering common questions'
            ]
        },
        week3: {
            name: 'Activation',
            tasks: [
                'First official help response',
                'Introduce yourself to community as ambassador',
                'Set up ambassador profile',
                'Join ambassador weekly call'
            ]
        },
        week4: {
            name: 'Integration',
            tasks: [
                'Complete first content piece',
                'Provide feedback on ambassador experience',
                'Set quarterly goals with community manager',
                'Full ambassador status confirmed'
            ]
        }
    };

    // ── Ambassador Tracker ──
    class AmbassadorTracker {
        constructor() {
            this.AMB_KEY = 'ambassador_data';
        }

        async getAmbassadors() {
            const { [this.AMB_KEY]: data = { ambassadors: [] } } = await chrome.storage.local.get(this.AMB_KEY);
            return data.ambassadors;
        }

        async addAmbassador(ambassador) {
            const { [this.AMB_KEY]: data = { ambassadors: [] } } = await chrome.storage.local.get(this.AMB_KEY);
            data.ambassadors.push({
                id: crypto.randomUUID(),
                name: ambassador.name,
                email: ambassador.email,
                tier: 'advocate',
                status: 'active',
                metrics: { helpfulPosts: 0, socialShares: 0, contentCreated: 0, eventsAttended: 0, membersReferred: 0 },
                joinedAt: Date.now(),
                lastActive: Date.now()
            });
            await chrome.storage.local.set({ [this.AMB_KEY]: data });
        }

        async updateMetrics(ambassadorId, metricUpdates) {
            const { [this.AMB_KEY]: data = { ambassadors: [] } } = await chrome.storage.local.get(this.AMB_KEY);
            const ambassador = data.ambassadors.find(a => a.id === ambassadorId);
            if (!ambassador) return null;

            Object.entries(metricUpdates).forEach(([key, value]) => {
                if (ambassador.metrics[key] !== undefined) ambassador.metrics[key] += value;
            });
            ambassador.lastActive = Date.now();
            await chrome.storage.local.set({ [this.AMB_KEY]: data });
            return ambassador;
        }

        async getPerformanceReport() {
            const ambassadors = await this.getAmbassadors();
            return ambassadors.map(a => ({
                name: a.name,
                tier: a.tier,
                status: a.status,
                totalActivity: Object.values(a.metrics).reduce((sum, v) => sum + v, 0),
                metrics: a.metrics,
                daysSinceActive: Math.round((Date.now() - a.lastActive) / 86400000),
                meetsRequirements: _checkRequirements(a)
            }));
        }
    }

    function _checkRequirements(ambassador) {
        const tierReqs = { advocate: { minMonthlyHelp: 5, minSocialPosts: 2 }, champion: { minQuarterlyContent: 1, minMentoring: 1 } };
        const reqs = tierReqs[ambassador.tier];
        if (!reqs) return true;

        if (ambassador.tier === 'advocate') {
            return ambassador.metrics.helpfulPosts >= reqs.minMonthlyHelp;
        }
        return ambassador.metrics.contentCreated >= reqs.minQuarterlyContent;
    }

    return {
        AMBASSADOR_TIERS,
        APPLICATION_CONFIG,
        ONBOARDING_CHECKLIST,
        AmbassadorTracker
    };
})();
