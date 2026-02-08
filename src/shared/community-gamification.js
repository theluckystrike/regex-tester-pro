// ==========================================================================
// Regex Tester Pro — Community Gamification
// MD 26 Agent 3: Points, levels, badges, rewards, recognition
// ==========================================================================

const CommunityGamification = (() => {
    'use strict';

    // ── Point Values Per Action ──
    const POINT_VALUES = {
        // Community participation
        post_message: 5,
        helpful_answer: 25,
        accepted_answer: 50,
        create_tutorial: 100,
        share_regex_pattern: 30,

        // Product engagement
        daily_active: 10,
        feature_discovery: 15,
        complete_tutorial: 20,
        invite_friend: 100,

        // Advocacy
        write_review: 150,
        social_share: 25,
        beta_feedback: 50,
        bug_report: 75
    };

    // ── Levels ──
    const LEVELS = [
        { level: 1, name: 'Newcomer', pointsRequired: 0, perks: [] },
        { level: 2, name: 'Learner', pointsRequired: 100, perks: ['custom_flair'] },
        { level: 5, name: 'Regular', pointsRequired: 500, perks: ['pattern_library_access'] },
        { level: 10, name: 'Contributor', pointsRequired: 1500, perks: ['early_access'] },
        { level: 20, name: 'Expert', pointsRequired: 5000, perks: ['beta_features'] },
        { level: 50, name: 'Champion', pointsRequired: 15000, perks: ['ambassador_invite'] }
    ];

    // ── Badges ──
    const BADGES = [
        { id: 'first_post', name: 'First Steps', icon: '👋', criteria: 'First community post' },
        { id: 'regex_helper', name: 'Regex Helper', icon: '🤝', criteria: '10 accepted answers' },
        { id: 'pattern_author', name: 'Pattern Author', icon: '✍️', criteria: 'Contributed 5 patterns' },
        { id: 'content_creator', name: 'Content Creator', icon: '📹', criteria: '5 tutorials created' },
        { id: 'bug_hunter', name: 'Bug Hunter', icon: '🐛', criteria: '10 valid bug reports' },
        { id: 'streak_7', name: 'Week Warrior', icon: '🔥', criteria: '7-day activity streak' },
        { id: 'streak_30', name: 'Monthly Master', icon: '💎', criteria: '30-day activity streak' },
        { id: 'og_member', name: 'OG Member', icon: '🏅', criteria: 'Member for 1+ year' },
        { id: 'challenge_winner', name: 'Challenge Winner', icon: '🏆', criteria: 'Won a weekly challenge' },
        { id: 'pro_advocate', name: 'Pro Advocate', icon: '⭐', criteria: 'Left a CWS review' }
    ];

    // ── Rewards ──
    const REWARD_TIERS = [
        { points: 1000, reward: '1 month Pro free' },
        { points: 5000, reward: 'Exclusive Zovo swag pack' },
        { points: 10000, reward: '1 year Pro free' },
        { points: 25000, reward: 'Lifetime Pro + Ambassador status' }
    ];

    // ── User Gamification State ──
    async function getUserProfile(userId) {
        const key = `gamification_${userId}`;
        const { [key]: profile } = await chrome.storage.local.get(key);
        return profile || { points: 0, badges: [], level: 1, streak: 0, actions: [] };
    }

    async function awardPoints(userId, action) {
        const points = POINT_VALUES[action] || 0;
        if (points === 0) return null;

        const profile = await getUserProfile(userId);
        profile.points += points;
        profile.actions.push({ action, points, timestamp: Date.now() });

        // Keep last 200 actions
        if (profile.actions.length > 200) profile.actions.splice(0, profile.actions.length - 200);

        // Level up check
        const newLevel = getLevel(profile.points);
        const leveledUp = newLevel.level > profile.level;
        profile.level = newLevel.level;

        const key = `gamification_${userId}`;
        await chrome.storage.local.set({ [key]: profile });

        return {
            pointsAwarded: points,
            totalPoints: profile.points,
            currentLevel: newLevel,
            leveledUp,
            nextReward: getNextReward(profile.points)
        };
    }

    function getLevel(points) {
        let current = LEVELS[0];
        for (const level of LEVELS) {
            if (points >= level.pointsRequired) current = level;
        }
        return current;
    }

    function getNextReward(points) {
        return REWARD_TIERS.find(r => r.points > points) || null;
    }

    async function awardBadge(userId, badgeId) {
        const profile = await getUserProfile(userId);
        if (profile.badges.includes(badgeId)) return false;

        profile.badges.push(badgeId);
        const key = `gamification_${userId}`;
        await chrome.storage.local.set({ [key]: profile });
        return true;
    }

    return {
        POINT_VALUES,
        LEVELS,
        BADGES,
        REWARD_TIERS,
        getUserProfile,
        awardPoints,
        awardBadge,
        getLevel,
        getNextReward
    };
})();
