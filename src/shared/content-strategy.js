// ==========================================================================
// Regex Tester Pro — Content Strategy & Calendar
// MD 26 Agent 2: Content calendar, tutorial framework, UGC campaigns
// ==========================================================================

const ContentStrategy = (() => {
    'use strict';

    // ── Content Calendar ──
    const CONTENT_CALENDAR = {
        weekly: [
            { day: 'Monday', content: 'Regex Tip of the Week', channel: 'regex-tips', format: 'Short post with example pattern and explanation' },
            { day: 'Wednesday', content: 'Community Spotlight', channel: 'show-and-tell', format: 'Feature a user, their use case, or creative regex' },
            { day: 'Friday', content: 'Fun Friday', channel: 'general-chat', format: 'Regex quiz, poll, meme, or challenge' }
        ],
        monthly: [
            { week: 1, content: 'Product Update Announcement', channel: 'announcements', format: 'Changelog with feature highlights' },
            { week: 2, content: 'Tutorial Deep Dive', channel: 'tutorials', format: 'Long-form guide on a regex topic or feature' },
            { week: 3, content: 'Community AMA', channel: 'general-chat', format: 'Live Q&A session with the team' },
            { week: 4, content: 'Feature Request Review', channel: 'feature-requests', format: 'Roadmap update and voting results' }
        ],
        quarterly: [
            'Community survey and feedback collection',
            'Ambassador appreciation event',
            'Virtual meetup or webinar',
            'Annual community report and statistics'
        ]
    };

    // ── Tutorial Content Template ──
    const TUTORIAL_TEMPLATE = {
        structure: ['title', 'difficulty', 'estimatedTime', 'prerequisites', 'learningGoals', 'steps', 'commonIssues', 'nextSteps', 'callToAction'],
        difficultyLevels: {
            beginner: { label: 'Beginner', color: '#22c55e', topics: ['Basic character classes', 'Simple quantifiers', 'Literal matching'] },
            intermediate: { label: 'Intermediate', color: '#f59e0b', topics: ['Capture groups', 'Lookaheads', 'Alternation', 'Backreferences'] },
            advanced: { label: 'Advanced', color: '#ef4444', topics: ['Recursive patterns', 'Conditional regex', 'Performance optimization', 'Engine internals'] }
        }
    };

    // ── Regex-Specific Content Ideas ──
    const CONTENT_IDEAS = [
        { title: 'Email Validation: The Right Way', difficulty: 'intermediate', type: 'tutorial', tags: ['validation', 'email'] },
        { title: 'Building a URL Parser with Regex', difficulty: 'advanced', type: 'tutorial', tags: ['url', 'parsing'] },
        { title: 'Top 10 Regex Mistakes and How to Avoid Them', difficulty: 'beginner', type: 'listicle', tags: ['tips', 'common-mistakes'] },
        { title: 'Regex Performance: When Patterns Go Wrong', difficulty: 'advanced', type: 'deep-dive', tags: ['performance', 'catastrophic-backtracking'] },
        { title: 'Mastering Lookaheads and Lookbehinds', difficulty: 'intermediate', type: 'tutorial', tags: ['lookahead', 'lookbehind'] },
        { title: 'From grep to JavaScript: Regex Across Languages', difficulty: 'intermediate', type: 'comparison', tags: ['cross-language', 'compatibility'] },
        { title: 'Phone Number Regex for Every Country', difficulty: 'intermediate', type: 'reference', tags: ['phone', 'international'] },
        { title: 'Regex Cheat Sheet: Quick Reference', difficulty: 'beginner', type: 'resource', tags: ['cheat-sheet', 'reference'] }
    ];

    // ── UGC Campaign System ──
    const UGC_CAMPAIGNS = {
        weeklyRegexChallenge: {
            name: 'Weekly Regex Challenge',
            type: 'challenge',
            duration: 7,
            rules: ['Solve the given regex challenge', 'Share your solution with explanation', 'Community votes for most elegant solution', 'One entry per person'],
            prizes: [
                { place: 1, reward: '3 months Pro subscription' },
                { place: 2, reward: '1 month Pro subscription' },
                { place: 3, reward: 'Community badge' }
            ],
            hashtag: '#RegexChallenge'
        },
        patternLibraryContest: {
            name: 'Pattern Library Contest',
            type: 'contest',
            duration: 30,
            rules: ['Create a reusable regex pattern with documentation', 'Submit via the pattern library', 'Original work only', 'Winners added to the official library'],
            prizes: [
                { place: 1, reward: '$500 + lifetime Pro' },
                { place: 2, reward: '$250 + 1 year Pro' },
                { place: 3, reward: '$100 + 6 months Pro' }
            ],
            hashtag: '#RegexPatterns'
        },
        useCaseShowcase: {
            name: 'Real World Regex Showcase',
            type: 'showcase',
            duration: 14,
            rules: ['Share a real-world regex use case from your job', 'Include before/after or problem/solution', 'Include screenshot or screen recording'],
            prizes: [
                { place: 1, reward: '6 months Pro + featured spotlight' },
                { place: 2, reward: '3 months Pro' },
                { place: 3, reward: '1 month Pro' }
            ],
            hashtag: '#RegexInTheWild'
        }
    };

    // ── Content Performance Tracker ──
    class ContentTracker {
        constructor() {
            this.CONTENT_KEY = 'community_content_metrics';
        }

        async trackContent(content) {
            const { [this.CONTENT_KEY]: metrics = [] } = await chrome.storage.local.get(this.CONTENT_KEY);
            metrics.push({
                id: crypto.randomUUID(),
                title: content.title,
                type: content.type,
                channel: content.channel,
                publishedAt: Date.now(),
                views: 0, reactions: 0, comments: 0, shares: 0
            });
            await chrome.storage.local.set({ [this.CONTENT_KEY]: metrics });
        }

        async getContentStats() {
            const { [this.CONTENT_KEY]: metrics = [] } = await chrome.storage.local.get(this.CONTENT_KEY);
            return {
                totalPosts: metrics.length,
                totalViews: metrics.reduce((s, m) => s + m.views, 0),
                totalReactions: metrics.reduce((s, m) => s + m.reactions, 0),
                topContent: [...metrics].sort((a, b) => b.reactions - a.reactions).slice(0, 5),
                recentContent: [...metrics].sort((a, b) => b.publishedAt - a.publishedAt).slice(0, 10)
            };
        }
    }

    return {
        CONTENT_CALENDAR,
        TUTORIAL_TEMPLATE,
        CONTENT_IDEAS,
        UGC_CAMPAIGNS,
        ContentTracker
    };
})();
