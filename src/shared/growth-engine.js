// ==========================================================================
// Regex Tester Pro — Growth & Viral Engine
// MD 14: Referral system, viral loops, organic acquisition
// ==========================================================================

const GrowthEngine = (() => {
    'use strict';

    // ── Referral System ──
    const REFERRAL_REWARDS = {
        tiers: [
            { referrals: 1, reward: '3 extra AI generations/day', type: 'feature_unlock' },
            { referrals: 3, reward: '7-day Pro trial', type: 'trial' },
            { referrals: 5, reward: '1 month Pro free', type: 'subscription' },
            { referrals: 10, reward: 'Lifetime Pro access', type: 'lifetime' }
        ]
    };

    async function getReferralCode() {
        const { referralCode } = await chrome.storage.local.get('referralCode');
        if (referralCode) return referralCode;

        // Generate unique referral code
        const code = 'RTP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        await chrome.storage.local.set({ referralCode: code });
        return code;
    }

    function getReferralLink(code) {
        return `https://zovo.one/tools/regex-tester-pro?ref=${code}`;
    }

    async function getReferralStats() {
        const { referralStats } = await chrome.storage.local.get('referralStats');
        return referralStats || { count: 0, conversions: 0, rewardsUnlocked: [] };
    }

    // ── Viral Loop Triggers ──
    const SHARE_TRIGGERS = {
        afterSuccessfulTest: {
            message: 'Just matched my regex on the first try!',
            threshold: 1 // First successful test
        },
        powerUserMilestone: {
            message: 'I\'ve tested {count} regex patterns with Regex Tester Pro',
            threshold: 50
        },
        aiGeneration: {
            message: 'Generated a complex regex from plain English in seconds',
            threshold: 1 // After first AI gen
        }
    };

    function getShareText(trigger, stats) {
        const text = SHARE_TRIGGERS[trigger];
        if (!text) return null;
        return text.message.replace('{count}', stats.totalTests || 0);
    }

    function getShareURL() {
        return 'https://chromewebstore.google.com/detail/regex-tester-pro';
    }

    // ── Organic Acquisition Hooks ──
    function getContextMenuShareItems() {
        return [
            {
                id: 'share-twitter',
                title: 'Share on Twitter/X',
                url: (text) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(getShareURL())}`
            },
            {
                id: 'share-linkedin',
                title: 'Share on LinkedIn',
                url: (text) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareURL())}`
            }
        ];
    }

    return {
        REFERRAL_REWARDS,
        SHARE_TRIGGERS,
        getReferralCode,
        getReferralLink,
        getReferralStats,
        getShareText,
        getShareURL,
        getContextMenuShareItems
    };
})();
