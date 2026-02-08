// ==========================================================================
// Regex Tester Pro — Enterprise Licensing & Team Management
// MD 25 Agent 1: Team licenses, seat management, org provisioning
// ==========================================================================

const EnterpriseLicensing = (() => {
    'use strict';

    // ── License Tiers ──
    const LICENSE_TIERS = {
        TEAM: {
            name: 'Team',
            minSeats: 5,
            maxSeats: 25,
            pricePerSeat: 8,
            features: ['core', 'teamSharing', 'basicSupport', 'patternLibrary'],
            billing: ['monthly', 'annual'],
            supportSLA: 'standard'
        },
        BUSINESS: {
            name: 'Business',
            minSeats: 10,
            maxSeats: 200,
            pricePerSeat: 12,
            volumeDiscounts: { 50: 0.10, 100: 0.15, 200: 0.20 },
            features: ['core', 'teamSharing', 'prioritySupport', 'sso', 'analytics', 'api', 'patternLibrary', 'auditLog'],
            billing: ['monthly', 'annual'],
            supportSLA: 'business'
        },
        ENTERPRISE: {
            name: 'Enterprise',
            minSeats: 100,
            maxSeats: null,
            pricePerSeat: 15,
            volumeDiscounts: { 200: 0.15, 500: 0.20, 1000: 0.25 },
            features: ['all', 'dedicatedCSM', 'customSLA', 'dataResidency', 'customIntegrations', 'sso', 'scim'],
            billing: ['annual', 'multi-year'],
            supportSLA: 'enterprise',
            customizable: true
        }
    };

    // ── Quote Generator ──
    function generateQuote(config) {
        const tier = LICENSE_TIERS[config.tier];
        if (!tier) return null;

        let pricePerSeat = tier.pricePerSeat;

        // Apply volume discounts
        if (tier.volumeDiscounts) {
            const thresholds = Object.entries(tier.volumeDiscounts)
                .map(([k, v]) => [parseInt(k), v])
                .sort((a, b) => b[0] - a[0]);

            for (const [threshold, discount] of thresholds) {
                if (config.seats >= threshold) {
                    pricePerSeat *= (1 - discount);
                    break;
                }
            }
        }

        // Annual billing discount (2 months free)
        if (config.billingCycle === 'annual') {
            pricePerSeat *= 0.833;
        }

        // Multi-year discount
        const contractYears = config.contractYears || 1;
        if (contractYears >= 3) pricePerSeat *= 0.85;
        else if (contractYears >= 2) pricePerSeat *= 0.90;

        const monthlyTotal = pricePerSeat * config.seats;

        return {
            tier: tier.name,
            seats: config.seats,
            pricePerSeat: Math.round(pricePerSeat * 100) / 100,
            monthlyTotal: Math.round(monthlyTotal * 100) / 100,
            annualTotal: Math.round(monthlyTotal * 12 * 100) / 100,
            contractTotal: Math.round(monthlyTotal * 12 * contractYears * 100) / 100,
            billingCycle: config.billingCycle || 'monthly',
            contractYears,
            features: tier.features,
            supportSLA: tier.supportSLA,
            generatedAt: new Date().toISOString(),
            validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
        };
    }

    // ── Organization Management ──
    class OrganizationManager {
        constructor() {
            this.ORG_KEY = 'enterprise_org';
        }

        async getOrganization() {
            const { [this.ORG_KEY]: org } = await chrome.storage.local.get(this.ORG_KEY);
            return org || null;
        }

        async createOrganization(config) {
            const org = {
                id: crypto.randomUUID(),
                name: config.name,
                domain: config.domain,
                tier: config.tier,
                seats: config.seats,
                usedSeats: 1,
                owner: config.ownerEmail,
                members: [{ email: config.ownerEmail, role: 'owner', joinedAt: Date.now() }],
                policies: {},
                createdAt: Date.now(),
                renewsAt: Date.now() + 365 * 86400000
            };
            await chrome.storage.local.set({ [this.ORG_KEY]: org });
            return org;
        }

        async addMember(email, role = 'member') {
            const org = await this.getOrganization();
            if (!org) return { error: 'No organization found' };
            if (org.usedSeats >= org.seats) return { error: 'No available seats' };
            if (org.members.some(m => m.email === email)) return { error: 'Already a member' };

            org.members.push({ email, role, joinedAt: Date.now() });
            org.usedSeats++;
            await chrome.storage.local.set({ [this.ORG_KEY]: org });
            return { success: true, member: org.members[org.members.length - 1] };
        }

        async removeMember(email) {
            const org = await this.getOrganization();
            if (!org) return { error: 'No organization found' };

            const idx = org.members.findIndex(m => m.email === email);
            if (idx === -1) return { error: 'Member not found' };
            if (org.members[idx].role === 'owner') return { error: 'Cannot remove owner' };

            org.members.splice(idx, 1);
            org.usedSeats--;
            await chrome.storage.local.set({ [this.ORG_KEY]: org });
            return { success: true };
        }

        async updateMemberRole(email, newRole) {
            const org = await this.getOrganization();
            if (!org) return { error: 'No organization found' };

            const member = org.members.find(m => m.email === email);
            if (!member) return { error: 'Member not found' };
            member.role = newRole;
            await chrome.storage.local.set({ [this.ORG_KEY]: org });
            return { success: true };
        }

        async getUsageStats() {
            const org = await this.getOrganization();
            if (!org) return null;
            return {
                totalSeats: org.seats,
                usedSeats: org.usedSeats,
                availableSeats: org.seats - org.usedSeats,
                utilization: Math.round((org.usedSeats / org.seats) * 100),
                memberCount: org.members.length,
                tier: org.tier,
                renewsAt: org.renewsAt
            };
        }
    }

    return {
        LICENSE_TIERS,
        generateQuote,
        OrganizationManager
    };
})();
