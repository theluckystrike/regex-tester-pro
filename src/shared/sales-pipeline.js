// ==========================================================================
// Regex Tester Pro — Sales Pipeline & Lead Management
// MD 25 Agent 3: Lead scoring, qualification, pipeline stages, CRM
// ==========================================================================

const SalesPipeline = (() => {
    'use strict';

    // ── Pipeline Stages ──
    const PIPELINE_STAGES = {
        LEAD: { label: 'Lead', order: 1, color: '#94a3b8' },
        QUALIFIED: { label: 'Qualified', order: 2, color: '#60a5fa' },
        DISCOVERY: { label: 'Discovery', order: 3, color: '#a78bfa' },
        DEMO: { label: 'Demo Scheduled', order: 4, color: '#f59e0b' },
        PROPOSAL: { label: 'Proposal Sent', order: 5, color: '#fb923c' },
        NEGOTIATION: { label: 'Negotiation', order: 6, color: '#f97316' },
        CLOSED_WON: { label: 'Closed Won', order: 7, color: '#22c55e' },
        CLOSED_LOST: { label: 'Closed Lost', order: 8, color: '#ef4444' }
    };

    // ── Lead Scoring (BANT Framework) ──
    function scoreLead(lead) {
        let score = 0;

        // Budget (0-25)
        if (lead.budget === 'approved') score += 25;
        else if (lead.budget === 'planned') score += 15;
        else if (lead.budget === 'exploring') score += 5;

        // Authority (0-25)
        if (lead.role?.includes('VP') || lead.role?.includes('Director') || lead.role?.includes('CTO')) score += 25;
        else if (lead.role?.includes('Manager') || lead.role?.includes('Lead')) score += 15;
        else if (lead.role?.includes('Engineer') || lead.role?.includes('Developer')) score += 10;

        // Need (0-25)
        if (lead.urgency === 'critical') score += 25;
        else if (lead.urgency === 'high') score += 20;
        else if (lead.urgency === 'medium') score += 10;
        else score += 5;

        // Timeline (0-25)
        if (lead.timeline === 'immediate') score += 25;
        else if (lead.timeline === 'quarter') score += 15;
        else if (lead.timeline === 'half-year') score += 10;
        else score += 3;

        // Company size bonus
        if (lead.companySize >= 1000) score += 10;
        else if (lead.companySize >= 200) score += 5;

        return Math.min(score, 100);
    }

    // ── Lead Qualification ──
    function qualifyLead(lead) {
        const score = scoreLead(lead);
        const qualified = score >= 50;
        const tier = score >= 80 ? 'hot' : score >= 50 ? 'warm' : 'cold';

        return {
            score,
            qualified,
            tier,
            missingInfo: _identifyMissingInfo(lead),
            recommendedAction: tier === 'hot' ? 'Schedule demo immediately'
                : tier === 'warm' ? 'Schedule discovery call'
                    : 'Nurture with content'
        };
    }

    function _identifyMissingInfo(lead) {
        const missing = [];
        if (!lead.budget) missing.push('Budget status');
        if (!lead.role) missing.push('Decision-maker role');
        if (!lead.urgency) missing.push('Urgency level');
        if (!lead.timeline) missing.push('Purchase timeline');
        if (!lead.companySize) missing.push('Company size');
        if (!lead.currentSolution) missing.push('Current solution');
        return missing;
    }

    // ── Deal Tracker ──
    class DealTracker {
        constructor() {
            this.DEALS_KEY = 'enterprise_deals';
        }

        async getDeals() {
            const { [this.DEALS_KEY]: deals } = await chrome.storage.local.get(this.DEALS_KEY);
            return deals || [];
        }

        async createDeal(deal) {
            const deals = await this.getDeals();
            const newDeal = {
                id: crypto.randomUUID(),
                company: deal.company,
                contact: deal.contact,
                email: deal.email,
                seats: deal.seats || 0,
                tier: deal.tier || 'BUSINESS',
                stage: 'LEAD',
                score: scoreLead(deal),
                value: 0,
                notes: [],
                activities: [{ type: 'created', date: Date.now(), note: 'Deal created' }],
                createdAt: Date.now(),
                updatedAt: Date.now()
            };

            // Calculate estimated deal value
            newDeal.value = _estimateDealValue(newDeal);

            deals.push(newDeal);
            await chrome.storage.local.set({ [this.DEALS_KEY]: deals });
            return newDeal;
        }

        async updateStage(dealId, newStage) {
            const deals = await this.getDeals();
            const deal = deals.find(d => d.id === dealId);
            if (!deal) return null;

            deal.stage = newStage;
            deal.updatedAt = Date.now();
            deal.activities.push({ type: 'stage_change', date: Date.now(), note: `Moved to ${PIPELINE_STAGES[newStage]?.label}` });

            await chrome.storage.local.set({ [this.DEALS_KEY]: deals });
            return deal;
        }

        async addNote(dealId, note) {
            const deals = await this.getDeals();
            const deal = deals.find(d => d.id === dealId);
            if (!deal) return null;

            deal.notes.push({ text: note, date: Date.now() });
            deal.activities.push({ type: 'note_added', date: Date.now(), note });
            deal.updatedAt = Date.now();

            await chrome.storage.local.set({ [this.DEALS_KEY]: deals });
            return deal;
        }

        async getPipelineSummary() {
            const deals = await this.getDeals();
            const summary = {};

            for (const [stage, config] of Object.entries(PIPELINE_STAGES)) {
                const stageDeals = deals.filter(d => d.stage === stage);
                summary[stage] = {
                    label: config.label,
                    count: stageDeals.length,
                    totalValue: stageDeals.reduce((sum, d) => sum + d.value, 0),
                    deals: stageDeals.map(d => ({ id: d.id, company: d.company, value: d.value }))
                };
            }

            return {
                stages: summary,
                totalDeals: deals.length,
                totalPipelineValue: deals.filter(d => !['CLOSED_WON', 'CLOSED_LOST'].includes(d.stage)).reduce((s, d) => s + d.value, 0),
                wonValue: deals.filter(d => d.stage === 'CLOSED_WON').reduce((s, d) => s + d.value, 0),
                winRate: _calculateWinRate(deals)
            };
        }
    }

    function _estimateDealValue(deal) {
        const tierPrices = { TEAM: 8, BUSINESS: 12, ENTERPRISE: 15 };
        const price = tierPrices[deal.tier] || 12;
        return price * (deal.seats || 50) * 12; // Annual value
    }

    function _calculateWinRate(deals) {
        const closed = deals.filter(d => ['CLOSED_WON', 'CLOSED_LOST'].includes(d.stage));
        if (closed.length === 0) return 0;
        const won = closed.filter(d => d.stage === 'CLOSED_WON').length;
        return Math.round((won / closed.length) * 100);
    }

    return {
        PIPELINE_STAGES,
        scoreLead,
        qualifyLead,
        DealTracker
    };
})();
