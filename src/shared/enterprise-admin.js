// ==========================================================================
// Regex Tester Pro — Enterprise Admin & RBAC
// MD 25 Agent 3: Role-based access, user management, policy engine
// ==========================================================================

const EnterpriseAdmin = (() => {
    'use strict';

    // ── Role Definitions ──
    const ROLES = {
        OWNER: {
            permissions: ['*'],
            description: 'Full administrative access',
            maxPerOrg: 2
        },
        ADMIN: {
            permissions: ['users:*', 'policies:*', 'audit:read', 'settings:*'],
            description: 'User and policy management'
        },
        MEMBER: {
            permissions: ['self:*', 'patterns:*', 'ai:use'],
            description: 'Standard user access'
        },
        VIEWER: {
            permissions: ['self:read', 'reports:read', 'patterns:read'],
            description: 'Read-only access'
        }
    };

    function hasPermission(role, permission) {
        const roleConfig = ROLES[role];
        if (!roleConfig) return false;
        if (roleConfig.permissions.includes('*')) return true;

        // Check exact or wildcard match
        return roleConfig.permissions.some(p => {
            if (p === permission) return true;
            if (p.endsWith(':*')) {
                const prefix = p.replace(':*', '');
                return permission.startsWith(prefix + ':');
            }
            return false;
        });
    }

    // ── Audit Logger ──
    async function logAuditEvent(event) {
        const { auditLog } = await chrome.storage.local.get('auditLog');
        const log = auditLog || [];

        log.push({
            action: event.action,
            actor: event.actor,
            target: event.target || null,
            details: event.details || {},
            timestamp: Date.now(),
            ip: event.ip || null
        });

        // Keep last 500 events
        if (log.length > 500) log.splice(0, log.length - 500);

        await chrome.storage.local.set({ auditLog: log });
    }

    async function getAuditLog(filters = {}) {
        const { auditLog } = await chrome.storage.local.get('auditLog');
        let log = auditLog || [];

        if (filters.action) log = log.filter(e => e.action === filters.action);
        if (filters.actor) log = log.filter(e => e.actor === filters.actor);
        if (filters.since) log = log.filter(e => e.timestamp >= filters.since);

        return log.sort((a, b) => b.timestamp - a.timestamp);
    }

    // ── Policy Engine ──
    const DEFAULT_POLICIES = {
        maxPatternLength: 10000,
        allowAIGeneration: true,
        maxAIDailyLimit: 50,
        allowExport: true,
        allowSharing: true,
        enforceFlags: null,        // e.g., force 'u' flag always on
        blockedPatterns: [],       // Regex patterns to block (e.g., ReDoS prone)
        dataRetentionDays: 90
    };

    async function getOrgPolicy() {
        const { orgPolicy } = await chrome.storage.local.get('orgPolicy');
        return { ...DEFAULT_POLICIES, ...orgPolicy };
    }

    async function updateOrgPolicy(updates, actor) {
        const current = await getOrgPolicy();
        const updated = { ...current, ...updates };
        await chrome.storage.local.set({ orgPolicy: updated });

        await logAuditEvent({
            action: 'policy_updated',
            actor,
            details: { changes: updates }
        });

        return updated;
    }

    // ── Deployment Config (Google Workspace force-install) ──
    function getForceInstallPolicy(extensionId) {
        return {
            ExtensionSettings: {
                [extensionId]: {
                    installation_mode: 'force_installed',
                    update_url: 'https://clients2.google.com/service/update2/crx',
                    toolbar_pin: 'force_pinned',
                    runtime_blocked_hosts: [],
                    runtime_allowed_hosts: ['*://*.zovo.one/*']
                }
            }
        };
    }

    return {
        ROLES,
        hasPermission,
        logAuditEvent,
        getAuditLog,
        DEFAULT_POLICIES,
        getOrgPolicy,
        updateOrgPolicy,
        getForceInstallPolicy
    };
})();
