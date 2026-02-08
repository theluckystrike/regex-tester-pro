// ==========================================================================
// Regex Tester Pro — Community Strategy & Platform
// MD 26 Agent 1: Community models, maturity stages, Discord server structure
// ==========================================================================

const CommunityStrategy = (() => {
    'use strict';

    // ── Community Models ──
    const COMMUNITY_MODELS = {
        support: {
            type: 'support',
            primaryGoal: 'User-to-user help and troubleshooting',
            keyActivities: ['Q&A forums', 'Knowledge base contributions', 'Troubleshooting threads', 'Tips & tricks sharing'],
            successMetrics: ['Questions answered by community', 'Response time', 'Solution acceptance rate', 'Support ticket deflection']
        },
        learning: {
            type: 'learning',
            primaryGoal: 'Skill development and regex best practices',
            keyActivities: ['Tutorial creation', 'Webinars and workshops', 'Regex challenges', 'Use case showcases'],
            successMetrics: ['Content consumption', 'Challenge completions', 'Skill assessments', 'Feature adoption']
        },
        advocacy: {
            type: 'advocacy',
            primaryGoal: 'Brand amplification and referrals',
            keyActivities: ['Review campaigns', 'Social sharing', 'Referral programs', 'Beta testing'],
            successMetrics: ['Reviews generated', 'Referral signups', 'Social mentions', 'NPS scores']
        },
        innovation: {
            type: 'innovation',
            primaryGoal: 'Product co-creation and feedback',
            keyActivities: ['Feature voting', 'Beta programs', 'User research', 'Regex hackathons'],
            successMetrics: ['Ideas submitted', 'Beta participation', 'Feature adoption', 'Innovation velocity']
        }
    };

    // ── Maturity Stages ──
    const MATURITY_STAGES = [
        { stage: 1, name: 'Seed', members: '0-100', focus: 'Personal relationships', owner: 'Founder/PM', goal: 'Find community-market fit' },
        { stage: 2, name: 'Growth', members: '100-1,000', focus: 'Scalable engagement', owner: 'Part-time CM', goal: 'Establish rituals and culture' },
        { stage: 3, name: 'Scale', members: '1,000-10,000', focus: 'Member-led growth', owner: 'Full-time CM team', goal: 'Self-sustaining ecosystem' },
        { stage: 4, name: 'Mature', members: '10,000+', focus: 'Strategic impact', owner: 'Community department', goal: 'Business outcome integration' }
    ];

    // ── Discord Server Structure ──
    const DISCORD_STRUCTURE = {
        categories: [
            {
                name: '📢 ANNOUNCEMENTS',
                channels: [
                    { name: 'announcements', type: 'text', readonly: true },
                    { name: 'changelog', type: 'text', readonly: true },
                    { name: 'roadmap', type: 'text', readonly: true }
                ]
            },
            {
                name: '💬 GENERAL',
                channels: [
                    { name: 'introductions', type: 'text' },
                    { name: 'general-chat', type: 'text' },
                    { name: 'show-and-tell', type: 'text' }
                ]
            },
            {
                name: '🔤 REGEX HELP',
                channels: [
                    { name: 'regex-help', type: 'text' },
                    { name: 'bug-reports', type: 'text' },
                    { name: 'feature-requests', type: 'forum' },
                    { name: 'regex-challenges', type: 'text' }
                ]
            },
            {
                name: '📚 RESOURCES',
                channels: [
                    { name: 'tutorials', type: 'text' },
                    { name: 'tips-and-tricks', type: 'text' },
                    { name: 'regex-patterns-library', type: 'text' }
                ]
            },
            {
                name: '🔒 VIP',
                channels: [
                    { name: 'pro-lounge', type: 'text', restricted: 'pro_role' },
                    { name: 'early-access', type: 'text', restricted: 'beta_role' }
                ]
            }
        ],
        roles: [
            { name: 'Team', color: '#6366f1', permissions: 'admin' },
            { name: 'Ambassador', color: '#8b5cf6', permissions: 'moderate' },
            { name: 'Pro User', color: '#22c55e', permissions: 'vip_access' },
            { name: 'Beta Tester', color: '#f59e0b', permissions: 'beta_access' },
            { name: 'Member', color: '#94a3b8', permissions: 'default' }
        ]
    };

    // ── Community Health Benchmarks ──
    const HEALTHY_BENCHMARKS = {
        memberGrowthRate: 0.10,    // 10% monthly
        churnRate: 0.03,           // <3% monthly
        dauMauRatio: 0.20,         // 20%+ is healthy
        responseRate: 0.90,        // 90%+ answered
        avgResponseTimeHours: 4,   // <4 hours
        solutionRate: 0.70,        // 70%+ solved
        nps: 50                    // 50+ is excellent
    };

    function assessMaturityStage(memberCount) {
        if (memberCount >= 10000) return MATURITY_STAGES[3];
        if (memberCount >= 1000) return MATURITY_STAGES[2];
        if (memberCount >= 100) return MATURITY_STAGES[1];
        return MATURITY_STAGES[0];
    }

    return {
        COMMUNITY_MODELS,
        MATURITY_STAGES,
        DISCORD_STRUCTURE,
        HEALTHY_BENCHMARKS,
        assessMaturityStage
    };
})();
