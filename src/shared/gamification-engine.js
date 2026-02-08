// ==========================================================================
// Regex Tester Pro — Gamification & Engagement
// MD 26 Agent 3: Points, levels, badges, rewards, recognition
// ==========================================================================

const GamificationEngine = (() => {
    'use strict';

    // ── Point Actions ──
    const POINT_ACTIONS = {
        // Community participation
        post_message: { points: 5, label: 'Post a message' },
        helpful_answer: { points: 25, label: 'Helpful answer' },
        accepted_answer: { points: 50, label: 'Accepted answer' },
        create_tutorial: { points: 100, label: 'Create a tutorial' },
        share_pattern: { points: 30, label: 'Share a regex pattern' },

        // Product engagement
        daily_active: { points: 10, label: 'Daily active use' },
        feature_discovery: { points: 15, label: 'Discover a new feature' },
        complete_tutorial: { points: 20, label: 'Complete a tutorial' },
        invite_friend: { points: 100, label: 'Invite a friend' },

        // Advocacy
        write_review: { points: 150, label: 'Write a store review' },
        social_share: { points: 25, label: 'Share on social media' },
        beta_feedback: { points: 50, label: 'Provide beta feedback' },
        bug_report: { points: 75, label: 'Submit a valid bug report' }
    };

    // ── Levels ──
    const LEVELS = [
        { level: 1, name: 'Newcomer', pointsRequired: 0, perks: [] },
        { level: 2, name: 'Apprentice', pointsRequired: 100, perks: ['custom_avatar'] },
        { level: 5, name: 'Regular', pointsRequired: 500, perks: ['custom_flair', 'gif_posting'] },
        { level: 10, name: 'Contributor', pointsRequired: 1500, perks: ['early_access', 'custom_flair'] },
        { level: 15, name: 'Expert', pointsRequired: 3000, perks: ['beta_features', 'priority_support'] },
        { level: 20, name: 'Master', pointsRequired: 5000, perks: ['beta_features', 'voice_channels'] },
        { level: 30, name: 'Legend', pointsRequired: 10000, perks: ['all_perks', 'ambassador_eligibility'] },
        { level: 50, name: 'Champion', pointsRequired: 25000, perks: ['all_perks', 'advisory_board'] }
    ];

    // ── Badges ──
    const BADGES = [
        { id: 'first_post', name: 'First Steps', icon: '👋', criteria: 'First community post', type: 'milestone' },
        { id: 'regex_novice', name: 'Regex Novice', icon: '🔰', criteria: 'Solve 5 regex challenges', type: 'skill' },
        { id: 'regex_wizard', name: 'Regex Wizard', icon: '🧙', criteria: 'Solve 50 regex challenges', type: 'skill' },
        { id: 'helper', name: 'Helpful Hand', icon: '🤝', criteria: '10 accepted answers', type: 'community' },
        { id: 'mentor', name: 'Mentor', icon: '🎓', criteria: '50 accepted answers', type: 'community' },
        { id: 'content_creator', name: 'Content Creator', icon: '✍️', criteria: '5 tutorials published', type: 'content' },
        { id: 'bug_hunter', name: 'Bug Hunter', icon: '🐛', criteria: '10 valid bug reports', type: 'quality' },
        { id: 'og_member', name: 'OG Member', icon: '🏅', criteria: 'Member for 1+ year', type: 'tenure' },
        { id: 'pro_user', name: 'Pro Supporter', icon: '💎', criteria: 'Pro subscription active', type: 'status' },
        { id: 'streak_7', name: 'Week Warrior', icon: '🔥', criteria: '7-day activity streak', type: 'streak' },
        { id: 'streak_30', name: 'Monthly Master', icon: '⚡', criteria: '30-day activity streak', type: 'streak' }
    ];

    // ── Rewards Tiers ──
    const REWARDS = [
        { points: 500, reward: '1 week Pro trial', type: 'subscription' },
        { points: 1000, reward: '1 month Pro free', type: 'subscription' },
        { points: 3000, reward: 'Exclusive sticker pack', type: 'swag' },
        { points: 5000, reward: 'Exclusive swag pack', type: 'swag' },
        { points: 10000, reward: '1 year Pro free', type: 'subscription' },
        { points: 25000, reward: 'Lifetime Pro + Ambassador status', type: 'premium' }
    ];

    // ── User Points Manager ──
    class PointsManager {
        constructor() {
            this.POINTS_KEY = 'community_points';
        }

        async getProfile(userId) {
            const { [this.POINTS_KEY]: profiles = {} } = await chrome.storage.local.get(this.POINTS_KEY);
            return profiles[userId] || { points: 0, badges: [], level: 1, history: [], streak: 0, lastActive: 0 };
        }

        async awardPoints(userId, action) {
            const config = POINT_ACTIONS[action];
            if (!config) return null;

            const { [this.POINTS_KEY]: profiles = {} } = await chrome.storage.local.get(this.POINTS_KEY);
            const profile = profiles[userId] || { points: 0, badges: [], level: 1, history: [], streak: 0, lastActive: 0 };

            profile.points += config.points;
            profile.history.push({ action, points: config.points, date: Date.now() });

            // Keep history bounded
            if (profile.history.length > 200) profile.history.splice(0, profile.history.length - 200);

            // Update streak
            const daysSinceLast = (Date.now() - profile.lastActive) / 86400000;
            if (daysSinceLast >= 1 && daysSinceLast < 2) {
                profile.streak++;
            } else if (daysSinceLast >= 2) {
                profile.streak = 1;
            }
            profile.lastActive = Date.now();

            // Check level up
            const newLevel = this._calculateLevel(profile.points);
            const leveledUp = newLevel > profile.level;
            profile.level = newLevel;

            profiles[userId] = profile;
            await chrome.storage.local.set({ [this.POINTS_KEY]: profiles });

            return {
                pointsAwarded: config.points,
                totalPoints: profile.points,
                level: profile.level,
                leveledUp,
                levelName: LEVELS.find(l => l.level <= profile.level)?.name || 'Newcomer',
                streak: profile.streak
            };
        }

        _calculateLevel(points) {
            let level = 1;
            for (const l of LEVELS) {
                if (points >= l.pointsRequired) level = l.level;
            }
            return level;
        }

        async getLeaderboard(limit = 10) {
            const { [this.POINTS_KEY]: profiles = {} } = await chrome.storage.local.get(this.POINTS_KEY);
            return Object.entries(profiles)
                .map(([userId, profile]) => ({ userId, points: profile.points, level: profile.level, badges: profile.badges.length }))
                .sort((a, b) => b.points - a.points)
                .slice(0, limit);
        }
    }

    // ── Recognition Programs ──
    const RECOGNITION_PROGRAMS = {
        memberOfMonth: {
            criteria: ['Most helpful answers', 'Most community engagement', 'Best content created'],
            reward: { badge: 'member_of_month', points: 500, spotlight: true, swag: true },
            selection: 'community_vote_plus_team'
        },
        weeklyMVP: {
            criteria: ['Highest quality help provided', 'Going above and beyond'],
            reward: { badge: 'weekly_mvp', points: 100, shoutout: true },
            selection: 'team_selected'
        }
    };

    return {
        POINT_ACTIONS,
        LEVELS,
        BADGES,
        REWARDS,
        PointsManager,
        RECOGNITION_PROGRAMS
    };
})();
