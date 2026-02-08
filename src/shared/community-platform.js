// ==========================================================================
// Regex Tester Pro — Community Platform & Structure
// MD 26 Agent 1: Community models, platform setup, moderation, onboarding
// ==========================================================================

const CommunityPlatform = (() => {
    'use strict';

    // ── Community Models ──
    const COMMUNITY_MODELS = {
        support: {
            type: 'support',
            primaryGoal: 'User-to-user help and regex troubleshooting',
            keyActivities: ['Q&A forums', 'Knowledge base contributions', 'Troubleshooting threads', 'Regex tips sharing'],
            successMetrics: ['Questions answered by community', 'Response time', 'Solution acceptance rate', 'Support ticket deflection']
        },
        learning: {
            type: 'learning',
            primaryGoal: 'Regex skill development and best practices',
            keyActivities: ['Regex tutorial creation', 'Webinars and workshops', 'Certification program', 'Use case showcases'],
            successMetrics: ['Content consumption', 'Course completions', 'Skill assessments', 'Feature adoption']
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

    // ── Community Maturity Stages ──
    const MATURITY_STAGES = [
        { stage: 1, name: 'Seed', members: '0-100', focus: 'Personal relationships', owner: 'Founder/PM', goal: 'Find community-market fit' },
        { stage: 2, name: 'Growth', members: '100-1,000', focus: 'Scalable engagement', owner: 'Part-time community manager', goal: 'Establish rituals and culture' },
        { stage: 3, name: 'Scale', members: '1,000-10,000', focus: 'Member-led growth', owner: 'Full-time community team', goal: 'Self-sustaining ecosystem' },
        { stage: 4, name: 'Mature', members: '10,000+', focus: 'Strategic impact', owner: 'Community department', goal: 'Business outcome integration' }
    ];

    // ── Discord Server Structure ──
    const DISCORD_STRUCTURE = {
        categories: [
            {
                name: 'ANNOUNCEMENTS',
                channels: [
                    { name: 'announcements', type: 'text', readonly: true },
                    { name: 'changelog', type: 'text', readonly: true },
                    { name: 'roadmap', type: 'text', readonly: true }
                ]
            },
            {
                name: 'GENERAL',
                channels: [
                    { name: 'introductions', type: 'text' },
                    { name: 'general-chat', type: 'text' },
                    { name: 'show-and-tell', type: 'text' }
                ]
            },
            {
                name: 'REGEX HELP',
                channels: [
                    { name: 'regex-help', type: 'text' },
                    { name: 'bug-reports', type: 'text' },
                    { name: 'feature-requests', type: 'forum' }
                ]
            },
            {
                name: 'RESOURCES',
                channels: [
                    { name: 'tutorials', type: 'text' },
                    { name: 'regex-tips', type: 'text' },
                    { name: 'pattern-library', type: 'text' }
                ]
            },
            {
                name: 'VIP',
                channels: [
                    { name: 'pro-lounge', type: 'text', restricted: 'pro_role' },
                    { name: 'early-access', type: 'text', restricted: 'beta_role' }
                ]
            }
        ],
        roles: [
            { name: 'Team', color: '#e74c3c', permissions: 'admin' },
            { name: 'Ambassador', color: '#9b59b6', permissions: 'moderate' },
            { name: 'Pro User', color: '#3498db', permissions: 'vip_access' },
            { name: 'Beta Tester', color: '#2ecc71', permissions: 'beta_access' },
            { name: 'Member', color: '#95a5a6', permissions: 'default' }
        ]
    };

    // ── Moderation Rules ──
    const MODERATION_RULES = {
        autoMod: {
            spamDetection: { maxMessagesPerMinute: 5, duplicateThreshold: 3 },
            contentFilter: ['slurs', 'phishing', 'excessive_caps'],
            linkWhitelist: ['github.com', 'regex101.com', 'regexr.com', 'developer.mozilla.org'],
            newMemberRestrictions: { linkDelay: 24, imageDelay: 24 }
        },
        escalationPath: [
            { level: 1, action: 'warning', handler: 'auto' },
            { level: 2, action: 'mute_1h', handler: 'auto' },
            { level: 3, action: 'mute_24h', handler: 'moderator' },
            { level: 4, action: 'kick', handler: 'admin' },
            { level: 5, action: 'ban', handler: 'admin' }
        ]
    };

    // ── Member Onboarding Sequence ──
    const ONBOARDING_SEQUENCE = {
        day0: {
            trigger: 'join',
            actions: [
                { type: 'dm', template: 'Welcome to the Regex Tester Pro community! Here is how to get started...' },
                { type: 'assign_role', role: 'New Member' },
                { type: 'prompt', channel: 'introductions' }
            ]
        },
        day1: {
            trigger: 'time',
            condition: 'has_not_posted',
            actions: [
                { type: 'dm', template: 'Have regex questions? The #regex-help channel is a great place to start.' }
            ]
        },
        day3: {
            trigger: 'time',
            actions: [
                { type: 'dm', template: 'Tip: Did you know you can save and share regex patterns with the team?' }
            ]
        },
        day7: {
            trigger: 'time',
            condition: 'is_active',
            actions: [
                { type: 'survey', template: 'onboarding_feedback' },
                { type: 'upgrade_role', from: 'New Member', to: 'Member' }
            ]
        },
        day14: {
            trigger: 'time',
            condition: 'high_engagement',
            actions: [
                { type: 'invite', program: 'ambassador_interest' }
            ]
        }
    };

    return {
        COMMUNITY_MODELS,
        MATURITY_STAGES,
        DISCORD_STRUCTURE,
        MODERATION_RULES,
        ONBOARDING_SEQUENCE
    };
})();
