// ==========================================================================
// Regex Tester Pro — Enterprise Pricing & Quote Generator
// MD 25 Agent 1: Tiered pricing, volume discounts, quote generation
// ==========================================================================

const EnterprisePricing = (() => {
    'use strict';

    const PRICING_TIERS = {
        TEAM: {
            minSeats: 5,
            maxSeats: 25,
            pricePerSeat: 8,
            features: ['core', 'basicSupport', 'teamSharing'],
            billing: ['monthly', 'annual']
        },
        BUSINESS: {
            minSeats: 10,
            maxSeats: 200,
            pricePerSeat: 12,
            volumeDiscounts: {
                50: 0.10,   // 10% off at 50+ seats
                100: 0.15,  // 15% off at 100+ seats
                200: 0.20   // 20% off at 200+ seats
            },
            features: ['core', 'prioritySupport', 'sso', 'analytics', 'api'],
            billing: ['monthly', 'annual']
        },
        ENTERPRISE: {
            minSeats: 100,
            maxSeats: null,
            pricePerSeat: 15,
            volumeDiscounts: {
                250: 0.15,
                500: 0.20,
                1000: 0.25
            },
            features: ['all', 'dedicatedSuccess', 'customSLA', 'dataResidency', 'sso', 'auditLogs'],
            billing: ['annual', 'multi-year'],
            customization: true
        }
    };

    function generateQuote(config) {
        const tier = PRICING_TIERS[config.tier];
        if (!tier) return { error: `Unknown tier: ${config.tier}` };

        let perSeat = tier.pricePerSeat;

        // Volume discounts
        if (tier.volumeDiscounts) {
            const thresholds = Object.entries(tier.volumeDiscounts)
                .map(([k, v]) => [parseInt(k), v])
                .sort(([a], [b]) => b - a);

            for (const [threshold, discount] of thresholds) {
                if (config.seats >= threshold) {
                    perSeat *= (1 - discount);
                    break;
                }
            }
        }

        // Annual discount (2 months free = ~16.7% off)
        if (config.billingCycle === 'annual') {
            perSeat *= 0.833;
        }

        // Multi-year discount
        const contractYears = config.contractLength || 1;
        if (contractYears >= 3) perSeat *= 0.85;
        else if (contractYears >= 2) perSeat *= 0.90;

        const monthlyTotal = perSeat * config.seats;
        const annualTotal = monthlyTotal * 12;

        return {
            tier: config.tier,
            seats: config.seats,
            billingCycle: config.billingCycle || 'monthly',
            contractLength: contractYears,
            perSeatMonthly: parseFloat(perSeat.toFixed(2)),
            monthlyTotal: parseFloat(monthlyTotal.toFixed(2)),
            annualTotal: parseFloat(annualTotal.toFixed(2)),
            contractTotal: parseFloat((annualTotal * contractYears).toFixed(2)),
            features: tier.features,
            generatedAt: new Date().toISOString()
        };
    }

    // TAM calculator
    function calculateTAM(config) {
        const { companyCounts, avgSeatsPerTier, penetrationRates, pricePerSeat } = config;
        return companyCounts.reduce((total, count, i) => {
            const seats = count * avgSeatsPerTier[i] * penetrationRates[i];
            return total + (seats * pricePerSeat * 12);
        }, 0);
    }

    return { PRICING_TIERS, generateQuote, calculateTAM };
})();
