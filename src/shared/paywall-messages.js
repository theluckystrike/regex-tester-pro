// ==========================================================================
// Regex Tester Pro — Enhanced Paywall Messaging
// MD 07 Agent 2: Loss aversion, ROI, social proof, reframed positioning
// ==========================================================================

const PaywallMessages = (() => {
    'use strict';

    // Reframed Zovo Pro positioning (MD 07 "Quick Wins")
    const PRO_VALUE_PROPS = {
        headline: 'Unlock every feature. Unlimited everything.',
        bullets: [
            'All Pro features across 18+ extensions (instant access)',
            'Unlimited usage — no caps, no limits, no friction',
            'Priority support — issues fixed within 24 hours',
            'Early access to new extensions before public launch'
        ],
        priceAnchor: 'Just $0.16/day — less than your morning coffee',
        guarantee: 'Cancel anytime. 7-day money-back guarantee.'
    };

    // Loss aversion messages (per trigger)
    const LOSS_AVERSION = {
        history: {
            headline: "Don't lose your saved patterns",
            body: "You've built a valuable pattern library. Upgrade to keep growing it without limits.",
            urgency: 'Your 10 saved patterns are at capacity.'
        },
        ai_limit: {
            headline: "You're thinking faster than free allows",
            body: "Pro users generate unlimited regex from plain English. No daily caps.",
            urgency: 'Daily AI generations used. Resets tomorrow.'
        },
        multi_flavor: {
            headline: 'Your regex works in JS. But does it work in Python?',
            body: 'Multi-flavor testing catches bugs before deployment.',
            urgency: null
        }
    };

    // ROI calculation (MD 07)
    function getROIMessage(totalTests) {
        const timePerTest = 2; // minutes saved per test vs manual approach
        const hoursSaved = Math.round((totalTests * timePerTest) / 60);
        const dollarValue = hoursSaved * 25; // $25/hr conservative dev rate

        if (hoursSaved > 0) {
            return `Regex Tester Pro has saved you ~${hoursSaved} hour${hoursSaved > 1 ? 's' : ''} so far. That's $${dollarValue}+ in productivity for just $4.99/mo.`;
        }
        return 'Pro users save 2+ hours/month with unlimited AI generation and pattern history.';
    }

    // Social proof variants (real numbers when available)
    const SOCIAL_PROOF = {
        memberCount: 'Join 3,300+ Zovo members who upgraded',
        userSegment: 'Popular with web developers and QA engineers',
        satisfaction: '4.8/5 satisfaction from Pro users'
    };

    // Enhanced paywall configs with psychology layers
    function getEnhancedPaywall(trigger, stats = {}) {
        const base = LOSS_AVERSION[trigger] || LOSS_AVERSION.ai_limit;
        const roi = getROIMessage(stats.totalTests || 0);
        const socialProof = SOCIAL_PROOF.memberCount;

        return {
            ...base,
            roi,
            socialProof,
            cta: 'Unlock Everything — $4.99/mo',
            secondaryCta: 'See all Pro features',
            dismissText: 'Maybe later',
            framing: PRO_VALUE_PROPS
        };
    }

    return {
        PRO_VALUE_PROPS,
        LOSS_AVERSION,
        SOCIAL_PROOF,
        getROIMessage,
        getEnhancedPaywall
    };
})();
