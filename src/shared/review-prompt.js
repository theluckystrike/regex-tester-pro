// ==========================================================================
// Regex Tester Pro — Review Prompt System
// MD 07 Agent 3: Review generation at peak satisfaction moments
// ==========================================================================

const ReviewPrompt = (() => {
    'use strict';

    const CWS_REVIEW_URL = 'https://chromewebstore.google.com/detail/regex-tester-pro';

    // Satisfaction triggers — when to ask for review
    const TRIGGERS = {
        firstSuccessfulTest: 1,       // First match found
        tenthTest: 10,                // Power user forming habit
        fiftythTest: 50,              // Serious user
        hundredthTest: 100,           // Loyal user
        firstAIGeneration: 'ai_gen',  // After AI wow moment
        firstSave: 'first_save'       // After saving first pattern
    };

    const RULES = {
        minDaysBeforePrompt: 2,       // Wait at least 2 days after install
        maxPromptsTotal: 3,           // Never ask more than 3 times ever
        daysBetweenPrompts: 30,       // Minimum 30 days between asks
        neverAskIfRated: true         // Stop if user already rated
    };

    async function shouldShowReviewPrompt(totalTests) {
        const { reviewState } = await chrome.storage.local.get('reviewState');
        const state = reviewState || {
            timesShown: 0,
            lastShown: 0,
            hasRated: false,
            dismissed: 0,
            installDate: Date.now()
        };

        // Never ask again if already rated
        if (state.hasRated) return false;

        // Max prompts check
        if (state.timesShown >= RULES.maxPromptsTotal) return false;

        // Min days since install
        const daysSinceInstall = (Date.now() - state.installDate) / 86400000;
        if (daysSinceInstall < RULES.minDaysBeforePrompt) return false;

        // Cooldown between prompts
        if (state.lastShown && (Date.now() - state.lastShown) / 86400000 < RULES.daysBetweenPrompts) return false;

        // Check if at a milestone trigger
        const milestones = [TRIGGERS.firstSuccessfulTest, TRIGGERS.tenthTest, TRIGGERS.fiftythTest, TRIGGERS.hundredthTest];
        if (!milestones.includes(totalTests)) return false;

        return true;
    }

    // Two-step ask pattern (MD 07)
    function getReviewPromptHTML() {
        return `
      <div class="review-prompt" id="reviewPrompt">
        <div class="review-step" id="reviewStep1">
          <p class="review-question">Are you enjoying Regex Tester Pro?</p>
          <div class="review-actions">
            <button class="btn btn-primary btn-sm" id="reviewYes">Yes, love it!</button>
            <button class="btn btn-ghost btn-sm" id="reviewNo">Not really</button>
          </div>
        </div>
        <div class="review-step" id="reviewStep2" hidden>
          <p class="review-question">Glad to hear it! Would you mind leaving a quick rating?</p>
          <div class="review-actions">
            <button class="btn btn-primary btn-sm" id="reviewRate">Rate on Chrome Store</button>
            <button class="btn btn-ghost btn-sm" id="reviewLater">Maybe later</button>
          </div>
        </div>
        <div class="review-step" id="reviewStep3" hidden>
          <p class="review-question">Sorry to hear that. How can we improve?</p>
          <div class="review-actions">
            <button class="btn btn-secondary btn-sm" id="reviewFeedback">Send Feedback</button>
            <button class="btn btn-ghost btn-sm" id="reviewDismiss">Dismiss</button>
          </div>
        </div>
      </div>
    `;
    }

    async function markShown() {
        const { reviewState } = await chrome.storage.local.get('reviewState');
        const state = reviewState || { timesShown: 0, lastShown: 0, hasRated: false, dismissed: 0, installDate: Date.now() };
        state.timesShown++;
        state.lastShown = Date.now();
        await chrome.storage.local.set({ reviewState: state });
    }

    async function markRated() {
        const { reviewState } = await chrome.storage.local.get('reviewState');
        const state = reviewState || { timesShown: 0, lastShown: 0, hasRated: false, dismissed: 0, installDate: Date.now() };
        state.hasRated = true;
        await chrome.storage.local.set({ reviewState: state });
    }

    async function markDismissed() {
        const { reviewState } = await chrome.storage.local.get('reviewState');
        const state = reviewState || { timesShown: 0, lastShown: 0, hasRated: false, dismissed: 0, installDate: Date.now() };
        state.dismissed++;
        await chrome.storage.local.set({ reviewState: state });
    }

    function openReviewPage() {
        chrome.tabs.create({ url: CWS_REVIEW_URL });
    }

    function openFeedbackPage() {
        chrome.tabs.create({ url: 'mailto:support@zovo.one?subject=Regex Tester Pro Feedback' });
    }

    return {
        TRIGGERS,
        RULES,
        shouldShowReviewPrompt,
        getReviewPromptHTML,
        markShown,
        markRated,
        markDismissed,
        openReviewPage,
        openFeedbackPage
    };
})();
