// ==========================================================================
// Regex Tester Pro — Feedback Loop & Community Metrics
// MD 26 Agent 5: Feature voting, NPS, surveys, community analytics
// ==========================================================================

const CommunityMetrics = (() => {
    'use strict';

    // ── Feature Voting System ──
    class FeatureVoting {
        constructor() {
            this.VOTES_KEY = 'feature_votes';
        }

        async getFeatures() {
            const { [this.VOTES_KEY]: features = [] } = await chrome.storage.local.get(this.VOTES_KEY);
            return features.sort((a, b) => b.votes - a.votes);
        }

        async submitFeature(feature) {
            const { [this.VOTES_KEY]: features = [] } = await chrome.storage.local.get(this.VOTES_KEY);
            features.push({
                id: crypto.randomUUID(),
                title: feature.title,
                description: feature.description,
                category: feature.category || 'general',
                submittedBy: feature.userId,
                votes: 1,
                voters: [feature.userId],
                status: 'open',
                comments: [],
                submittedAt: Date.now()
            });
            await chrome.storage.local.set({ [this.VOTES_KEY]: features });
        }

        async vote(featureId, userId) {
            const { [this.VOTES_KEY]: features = [] } = await chrome.storage.local.get(this.VOTES_KEY);
            const feature = features.find(f => f.id === featureId);
            if (!feature) return { error: 'Feature not found' };
            if (feature.voters.includes(userId)) return { error: 'Already voted' };

            feature.votes++;
            feature.voters.push(userId);
            await chrome.storage.local.set({ [this.VOTES_KEY]: features });
            return { success: true, votes: feature.votes };
        }

        async updateStatus(featureId, status) {
            const { [this.VOTES_KEY]: features = [] } = await chrome.storage.local.get(this.VOTES_KEY);
            const feature = features.find(f => f.id === featureId);
            if (!feature) return null;

            feature.status = status; // open, planned, in-progress, shipped, declined
            await chrome.storage.local.set({ [this.VOTES_KEY]: features });
            return feature;
        }

        async getRoadmapView() {
            const features = await this.getFeatures();
            return {
                open: features.filter(f => f.status === 'open'),
                planned: features.filter(f => f.status === 'planned'),
                inProgress: features.filter(f => f.status === 'in-progress'),
                shipped: features.filter(f => f.status === 'shipped'),
                declined: features.filter(f => f.status === 'declined')
            };
        }
    }

    // ── NPS Survey System ──
    class NPSSurvey {
        constructor() {
            this.NPS_KEY = 'nps_responses';
        }

        async recordResponse(response) {
            const { [this.NPS_KEY]: responses = [] } = await chrome.storage.local.get(this.NPS_KEY);
            responses.push({
                id: crypto.randomUUID(),
                score: response.score, // 0-10
                feedback: response.feedback || '',
                userId: response.userId,
                segment: response.segment || 'general',
                timestamp: Date.now()
            });
            await chrome.storage.local.set({ [this.NPS_KEY]: responses });
        }

        async calculateNPS(since = 0) {
            const { [this.NPS_KEY]: responses = [] } = await chrome.storage.local.get(this.NPS_KEY);
            const filtered = since ? responses.filter(r => r.timestamp >= since) : responses;

            if (filtered.length === 0) return { nps: 0, total: 0, promoters: 0, passives: 0, detractors: 0 };

            const promoters = filtered.filter(r => r.score >= 9).length;
            const detractors = filtered.filter(r => r.score <= 6).length;
            const passives = filtered.length - promoters - detractors;

            const nps = Math.round(((promoters - detractors) / filtered.length) * 100);

            return {
                nps,
                total: filtered.length,
                promoters,
                passives,
                detractors,
                promoterPct: Math.round((promoters / filtered.length) * 100),
                detractorPct: Math.round((detractors / filtered.length) * 100),
                avgScore: Math.round((filtered.reduce((s, r) => s + r.score, 0) / filtered.length) * 10) / 10
            };
        }
    }

    // ── Community Health Metrics ──
    const COMMUNITY_KPIS = {
        growth: {
            name: 'Growth',
            metrics: [
                { key: 'new_members_weekly', label: 'New Members (Weekly)', target: 50 },
                { key: 'member_retention_30d', label: '30-Day Retention', target: 0.40 },
                { key: 'organic_referrals', label: 'Organic Referrals', target: 0.20 }
            ]
        },
        engagement: {
            name: 'Engagement',
            metrics: [
                { key: 'dau_mau_ratio', label: 'DAU/MAU Ratio', target: 0.25 },
                { key: 'posts_per_active_user', label: 'Posts per Active User', target: 3 },
                { key: 'avg_response_time_hours', label: 'Avg Response Time (hrs)', target: 4 },
                { key: 'questions_answered_pct', label: 'Questions Answered %', target: 0.90 }
            ]
        },
        content: {
            name: 'Content',
            metrics: [
                { key: 'ugc_posts_weekly', label: 'UGC Posts (Weekly)', target: 10 },
                { key: 'tutorials_published', label: 'Tutorials Published (Monthly)', target: 4 },
                { key: 'knowledge_base_views', label: 'KB Views (Monthly)', target: 1000 }
            ]
        },
        advocacy: {
            name: 'Advocacy',
            metrics: [
                { key: 'nps_score', label: 'NPS Score', target: 50 },
                { key: 'store_reviews_monthly', label: 'Store Reviews (Monthly)', target: 10 },
                { key: 'social_mentions', label: 'Social Mentions (Weekly)', target: 20 },
                { key: 'active_ambassadors', label: 'Active Ambassadors', target: 15 }
            ]
        }
    };

    // ── Community Dashboard Generator ──
    function generateDashboardHTML(metrics) {
        const sections = Object.entries(COMMUNITY_KPIS).map(([_, category]) => {
            const rows = category.metrics.map(m => {
                const actual = metrics[m.key] || 0;
                const pct = typeof m.target === 'number' ? Math.round((actual / m.target) * 100) : 0;
                const color = pct >= 100 ? '#22c55e' : pct >= 70 ? '#f59e0b' : '#ef4444';
                return `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05)">
          <span style="color:#aaa;font-size:13px">${m.label}</span>
          <span style="color:${color};font-weight:600;font-size:14px">${typeof actual === 'number' && actual < 1 ? Math.round(actual * 100) + '%' : actual}</span>
        </div>`;
            }).join('');

            return `<div style="margin-bottom:16px">
        <h4 style="margin:0 0 8px;color:#e0e0e0;font-size:14px">${category.name}</h4>
        ${rows}
      </div>`;
        }).join('');

        return `<div style="font-family:system-ui;max-width:460px;padding:1.5rem;background:var(--bg-surface,#1e1e2e);border-radius:12px">
      <h3 style="margin:0 0 16px;color:var(--text-primary,#e0e0e0)">Community Health Dashboard</h3>
      ${sections}
    </div>`;
    }

    // ── Feedback Collection Automation ──
    const FEEDBACK_TRIGGERS = {
        afterFirstWeek: { delay: 7, type: 'onboarding_survey', question: 'How was your first week in the community?' },
        afterFirstMonth: { delay: 30, type: 'satisfaction_survey', question: 'How satisfied are you with the community?' },
        afterMilestone: { trigger: 'level_up', type: 'milestone_feedback', question: 'What could we improve?' },
        quarterly: { interval: 90, type: 'nps_survey', question: 'How likely are you to recommend Regex Tester Pro?' }
    };

    return {
        FeatureVoting,
        NPSSurvey,
        COMMUNITY_KPIS,
        generateDashboardHTML,
        FEEDBACK_TRIGGERS
    };
})();
