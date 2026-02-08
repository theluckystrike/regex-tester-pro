// ==========================================================================
// Regex Tester Pro — ROI Calculator & Pricing Engine
// MD 25 Agent 4: Enterprise ROI, competitive positioning, objection handling
// ==========================================================================

const EnterpriseROI = (() => {
    'use strict';

    // ── ROI Calculator ──
    function calculateROI(inputs) {
        const {
            teamSize = 10,
            avgHourlyCost = 75,
            hoursPerWeekOnRegex = 3,
            currentErrorRate = 0.05,
            errorCostPerIncident = 500,
            toolsReplaced = []
        } = inputs;

        // Time savings (conservative 30% efficiency gain)
        const timeSavingsMultiplier = 0.30;
        const weeklyHoursSaved = teamSize * hoursPerWeekOnRegex * timeSavingsMultiplier;
        const annualTimeSavings = weeklyHoursSaved * 52 * avgHourlyCost;

        // Error reduction (50% fewer regex errors)
        const errorReductionMultiplier = 0.50;
        const currentAnnualErrors = teamSize * currentErrorRate * 52;
        const errorsPreventedAnnually = currentAnnualErrors * errorReductionMultiplier;
        const annualErrorSavings = errorsPreventedAnnually * errorCostPerIncident;

        // Tool consolidation savings
        const annualToolSavings = toolsReplaced.reduce(
            (sum, tool) => sum + ((tool.pricePerSeat || 0) * teamSize * 12), 0
        );

        // Our cost (Business tier default)
        const ourPricePerSeat = 12;
        const ourAnnualCost = ourPricePerSeat * teamSize * 12;

        // Totals
        const totalAnnualSavings = annualTimeSavings + annualErrorSavings + annualToolSavings;
        const netBenefit = totalAnnualSavings - ourAnnualCost;
        const roi = ourAnnualCost > 0 ? ((netBenefit / ourAnnualCost) * 100) : 0;
        const paybackMonths = totalAnnualSavings > 0 ? (ourAnnualCost / (totalAnnualSavings / 12)) : Infinity;

        return {
            summary: {
                totalAnnualSavings: Math.round(totalAnnualSavings),
                ourAnnualCost: Math.round(ourAnnualCost),
                netBenefit: Math.round(netBenefit),
                roi: Math.round(roi),
                paybackMonths: Math.round(paybackMonths * 10) / 10
            },
            breakdown: {
                timeSavings: {
                    amount: Math.round(annualTimeSavings),
                    hoursSavedPerWeek: Math.round(weeklyHoursSaved * 10) / 10,
                    hoursSavedPerYear: Math.round(weeklyHoursSaved * 52)
                },
                errorReduction: {
                    amount: Math.round(annualErrorSavings),
                    errorsPrevented: Math.round(errorsPreventedAnnually)
                },
                toolConsolidation: {
                    amount: Math.round(annualToolSavings),
                    toolsReplaced: toolsReplaced.length
                }
            },
            inputs: { teamSize, avgHourlyCost, hoursPerWeekOnRegex }
        };
    }

    // ── ROI Report Generator (HTML) ──
    function generateROIReport(result) {
        const fmt = n => '$' + n.toLocaleString();

        return `
      <div style="font-family:system-ui;max-width:500px;padding:1.5rem;background:var(--bg-surface,#1e1e2e);border-radius:12px">
        <h3 style="margin:0 0 1rem;color:var(--text-primary,#e0e0e0)">ROI Analysis - ${result.inputs.teamSize} Users</h3>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:1rem">
          <div style="background:rgba(34,197,94,0.1);padding:12px;border-radius:8px;text-align:center">
            <div style="font-size:24px;font-weight:700;color:#22c55e">${result.summary.roi}%</div>
            <div style="font-size:12px;color:#888">ROI</div>
          </div>
          <div style="background:rgba(59,130,246,0.1);padding:12px;border-radius:8px;text-align:center">
            <div style="font-size:24px;font-weight:700;color:#3b82f6">${result.summary.paybackMonths}mo</div>
            <div style="font-size:12px;color:#888">Payback</div>
          </div>
        </div>

        <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:12px;font-size:13px;color:#aaa">
          <div style="display:flex;justify-content:space-between;margin:4px 0"><span>Time Savings</span><span style="color:#22c55e">${fmt(result.breakdown.timeSavings.amount)}/yr</span></div>
          <div style="display:flex;justify-content:space-between;margin:4px 0"><span>Error Reduction</span><span style="color:#22c55e">${fmt(result.breakdown.errorReduction.amount)}/yr</span></div>
          <div style="display:flex;justify-content:space-between;margin:4px 0"><span>Tool Consolidation</span><span style="color:#22c55e">${fmt(result.breakdown.toolConsolidation.amount)}/yr</span></div>
          <div style="display:flex;justify-content:space-between;margin:8px 0;padding-top:8px;border-top:1px solid rgba(255,255,255,0.1);font-weight:600;color:#e0e0e0"><span>Total Savings</span><span style="color:#22c55e">${fmt(result.summary.totalAnnualSavings)}/yr</span></div>
          <div style="display:flex;justify-content:space-between;margin:4px 0"><span>Regex Tester Pro Cost</span><span style="color:#ef4444">-${fmt(result.summary.ourAnnualCost)}/yr</span></div>
          <div style="display:flex;justify-content:space-between;margin:8px 0;padding-top:8px;border-top:1px solid rgba(255,255,255,0.1);font-weight:700;font-size:15px;color:#22c55e"><span>Net Benefit</span><span>${fmt(result.summary.netBenefit)}/yr</span></div>
        </div>
      </div>
    `;
    }

    // ── Competitive Positioning ──
    const COMPETITIVE_MATRIX = {
        'Regex Tester Pro': {
            pricing: '$8-15/seat/mo',
            realTimeTesting: true,
            captureGroups: true,
            findReplace: true,
            patternLibrary: true,
            teamSharing: true,
            sso: true,
            auditLog: true,
            apiAccess: true,
            darkMode: true,
            offline: true,
            chromeExtension: true
        },
        'RegExr': {
            pricing: 'Free',
            realTimeTesting: true,
            captureGroups: true,
            findReplace: false,
            patternLibrary: true,
            teamSharing: false,
            sso: false,
            auditLog: false,
            apiAccess: false,
            darkMode: false,
            offline: false,
            chromeExtension: false
        },
        'Regex101': {
            pricing: 'Free / Pro $5/mo',
            realTimeTesting: true,
            captureGroups: true,
            findReplace: true,
            patternLibrary: true,
            teamSharing: false,
            sso: false,
            auditLog: false,
            apiAccess: false,
            darkMode: true,
            offline: false,
            chromeExtension: false
        }
    };

    // ── Objection Handling ──
    const OBJECTION_RESPONSES = {
        'too_expensive': {
            response: 'Let us look at the ROI. With {teamSize} engineers at {hourlyRate}/hr, saving just 30 minutes/week per person saves {savings}/year. The extension pays for itself in {payback} months.',
            action: 'Share ROI calculator, offer pilot with limited seats'
        },
        'security_concerns': {
            response: 'We process everything locally. Your regex patterns and test data never leave your device. We offer SSO/SAML, audit logging, and can provide our security documentation.',
            action: 'Share security questionnaire responses, offer DPA'
        },
        'need_it_approval': {
            response: 'We support force-install via Google Workspace, have full audit logging, and can provide a technical architecture review for your IT team.',
            action: 'Offer to join IT call, provide deployment guide'
        },
        'already_have_solution': {
            response: 'Many teams use free online tools, but they lack team sharing, audit logging, and offline support. Our extension integrates directly into the developer workflow without context switching.',
            action: 'Competitive comparison, free pilot period'
        },
        'not_priority': {
            response: 'Regex errors in production cost an average of {errorCost} per incident. With {teamSize} engineers, that is {annualCost}/year in preventable issues.',
            action: 'Quantify cost of inaction, share case study'
        }
    };

    return {
        calculateROI,
        generateROIReport,
        COMPETITIVE_MATRIX,
        OBJECTION_RESPONSES
    };
})();
