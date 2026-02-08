// ==========================================================================
// Regex Tester Pro — Admin Console & RBAC
// MD 25 Agent 2: Role-based access, policy management, audit logging
// ==========================================================================

const AdminConsole = (() => {
    'use strict';

    // ── Role Definitions ──
    const ROLES = {
        owner: {
            permissions: ['*'],
            label: 'Owner',
            description: 'Full administrative access'
        },
        admin: {
            permissions: ['users:read', 'users:write', 'users:invite', 'users:remove',
                'policies:read', 'policies:write', 'audit:read', 'settings:write',
                'patterns:read', 'patterns:write'],
            label: 'Admin',
            description: 'User and policy management'
        },
        manager: {
            permissions: ['users:read', 'users:invite', 'policies:read',
                'audit:read', 'patterns:read', 'patterns:write', 'reports:read'],
            label: 'Manager',
            description: 'Team oversight and reporting'
        },
        member: {
            permissions: ['self:read', 'self:write', 'patterns:read', 'patterns:write'],
            label: 'Member',
            description: 'Standard user access'
        },
        viewer: {
            permissions: ['self:read', 'patterns:read', 'reports:read'],
            label: 'Viewer',
            description: 'Read-only access'
        }
    };

    // ── Permission Checker ──
    function hasPermission(role, permission) {
        const roleConfig = ROLES[role];
        if (!roleConfig) return false;
        if (roleConfig.permissions.includes('*')) return true;
        return roleConfig.permissions.includes(permission);
    }

    function requirePermission(role, permission) {
        if (!hasPermission(role, permission)) {
            throw new Error(`Insufficient permissions: ${permission} required, role is ${role}`);
        }
    }

    // ── Policy Management ──
    class PolicyManager {
        constructor() {
            this.POLICY_KEY = 'enterprise_policies';
        }

        async getPolicies() {
            const { [this.POLICY_KEY]: policies } = await chrome.storage.local.get(this.POLICY_KEY);
            return policies || {};
        }

        async setPolicy(key, value, description = '') {
            const policies = await this.getPolicies();
            policies[key] = { value, description, updatedAt: Date.now() };
            await chrome.storage.local.set({ [this.POLICY_KEY]: policies });
            await AuditLogger.log('policy_updated', { key, value });
        }

        async getPolicy(key) {
            const policies = await this.getPolicies();
            return policies[key]?.value ?? null;
        }
    }

    // ── Default Enterprise Policies ──
    const DEFAULT_POLICIES = {
        'sharing.enabled': { value: true, description: 'Allow pattern sharing between team members' },
        'export.enabled': { value: true, description: 'Allow data export' },
        'external.sharing': { value: false, description: 'Allow sharing patterns outside the organization' },
        'ai.features': { value: true, description: 'Enable AI-powered regex features' },
        'data.retention.days': { value: 365, description: 'Data retention period in days' },
        'session.timeout.minutes': { value: 480, description: 'Session timeout in minutes' },
        'password.complexity': { value: 'standard', description: 'Password requirements (standard/strong)' },
        'mfa.required': { value: false, description: 'Require multi-factor authentication' }
    };

    // ── Audit Logger ──
    const AuditLogger = {
        LOG_KEY: 'enterprise_audit_log',
        MAX_ENTRIES: 10000,

        async log(action, details = {}, actor = 'system') {
            try {
                const { [this.LOG_KEY]: logs = [] } = await chrome.storage.local.get(this.LOG_KEY);
                logs.push({
                    id: crypto.randomUUID(),
                    action,
                    details,
                    actor,
                    timestamp: Date.now(),
                    ip: 'local' // Extension context
                });

                // Trim to max entries
                if (logs.length > this.MAX_ENTRIES) {
                    logs.splice(0, logs.length - this.MAX_ENTRIES);
                }

                await chrome.storage.local.set({ [this.LOG_KEY]: logs });
            } catch {
                // Audit logging should never break the app
            }
        },

        async query(filters = {}) {
            const { [this.LOG_KEY]: logs = [] } = await chrome.storage.local.get(this.LOG_KEY);

            let filtered = logs;

            if (filters.action) {
                filtered = filtered.filter(l => l.action === filters.action);
            }
            if (filters.actor) {
                filtered = filtered.filter(l => l.actor === filters.actor);
            }
            if (filters.since) {
                filtered = filtered.filter(l => l.timestamp >= filters.since);
            }
            if (filters.until) {
                filtered = filtered.filter(l => l.timestamp <= filters.until);
            }

            // Sort newest first
            filtered.sort((a, b) => b.timestamp - a.timestamp);

            // Pagination
            const offset = filters.offset || 0;
            const limit = filters.limit || 100;
            return {
                total: filtered.length,
                entries: filtered.slice(offset, offset + limit)
            };
        },

        async export() {
            const { entries } = await this.query({ limit: this.MAX_ENTRIES });
            return entries.map(e => ({
                timestamp: new Date(e.timestamp).toISOString(),
                action: e.action,
                actor: e.actor,
                details: JSON.stringify(e.details)
            }));
        }
    };

    return {
        ROLES,
        hasPermission,
        requirePermission,
        PolicyManager,
        DEFAULT_POLICIES,
        AuditLogger
    };
})();
