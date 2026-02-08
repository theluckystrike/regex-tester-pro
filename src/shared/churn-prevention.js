// ==========================================================================
// Regex Tester Pro — Churn Prevention & Reactivation
// MD 17: Re-engagement triggers, streak system, win-back prompts
// ==========================================================================

const ChurnPrevention = (() => {
    'use strict';

    // ── Engagement Streak System ──
    async function updateStreak() {
        const { streakData } = await chrome.storage.local.get('streakData');
        const data = streakData || { currentStreak: 0, longestStreak: 0, lastActiveDate: null };
        const today = new Date().toDateString();

        if (data.lastActiveDate === today) return data; // Already tracked today

        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (data.lastActiveDate === yesterday) {
            data.currentStreak++;
        } else {
            data.currentStreak = 1; // Reset streak
        }

        data.longestStreak = Math.max(data.longestStreak, data.currentStreak);
        data.lastActiveDate = today;

        await chrome.storage.local.set({ streakData: data });
        return data;
    }

    // ── Inactivity Detection ──
    async function checkInactivity() {
        const { streakData } = await chrome.storage.local.get('streakData');
        if (!streakData || !streakData.lastActiveDate) return null;

        const lastActive = new Date(streakData.lastActiveDate);
        const daysSinceActive = Math.floor((Date.now() - lastActive.getTime()) / 86400000);

        if (daysSinceActive >= 14) return 'dormant';       // 14+ days
        if (daysSinceActive >= 7) return 'at_risk';         // 7-13 days
        if (daysSinceActive >= 3) return 'cooling';         // 3-6 days
        return 'active';
    }

    // ── Win-Back Messages ──
    const WIN_BACK_MESSAGES = {
        cooling: {
            title: 'Your patterns miss you',
            body: 'You have {count} saved patterns waiting. Quick regex test?',
            cta: 'Open Tester'
        },
        at_risk: {
            title: "What's new in Regex Tester Pro",
            body: 'We added new features since your last visit. Come check them out!',
            cta: 'See What\'s New'
        },
        dormant: {
            title: 'Still the fastest regex tester',
            body: 'Test any regex pattern in seconds, right from your toolbar.',
            cta: 'Test a Regex'
        }
    };

    function getWinBackMessage(status, stats = {}) {
        const msg = WIN_BACK_MESSAGES[status];
        if (!msg) return null;
        return {
            ...msg,
            body: msg.body.replace('{count}', stats.patternCount || 0)
        };
    }

    // ── Feature Discovery Nudges (prevent "I didn't know it could do that" churn) ──
    const UNDISCOVERED_FEATURES = [
        { id: 'capture_groups', label: 'Did you know? Click any match to see capture groups.' },
        { id: 'find_replace', label: 'Try the Find & Replace tab for regex substitutions.' },
        { id: 'context_menu', label: 'Right-click any text on a page to test regex on it.' },
        { id: 'flag_toggles', label: 'Toggle regex flags with one click — no retyping needed.' },
        { id: 'history', label: 'Your pattern history saves automatically. Never retype a regex.' }
    ];

    async function getUndiscoveredFeature() {
        const { discoveredFeatures } = await chrome.storage.local.get('discoveredFeatures');
        const discovered = discoveredFeatures || [];
        const undiscovered = UNDISCOVERED_FEATURES.filter(f => !discovered.includes(f.id));
        return undiscovered.length > 0 ? undiscovered[0] : null;
    }

    async function markFeatureDiscovered(featureId) {
        const { discoveredFeatures } = await chrome.storage.local.get('discoveredFeatures');
        const discovered = discoveredFeatures || [];
        if (!discovered.includes(featureId)) {
            discovered.push(featureId);
            await chrome.storage.local.set({ discoveredFeatures: discovered });
        }
    }

    return {
        updateStreak,
        checkInactivity,
        WIN_BACK_MESSAGES,
        getWinBackMessage,
        UNDISCOVERED_FEATURES,
        getUndiscoveredFeature,
        markFeatureDiscovered
    };
})();
