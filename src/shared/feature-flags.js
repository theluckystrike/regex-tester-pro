// ==========================================================================
// Regex Tester Pro — Feature Flags System
// MD 22 Agent 2: Feature flag registry, percentage rollout, overrides
// ==========================================================================

const FeatureFlags = (() => {
    'use strict';

    let flags = new Map();
    let overrides = new Map();
    let userBucket = -1;
    let userId = null;
    let initialized = false;

    // ── Default Flag Definitions ──
    const DEFAULT_FLAGS = {
        'ai-regex-generator': {
            enabled: true,
            rolloutPercentage: 100,
            description: 'AI-powered regex generation',
            segments: ['all']
        },
        'pattern-library': {
            enabled: true,
            rolloutPercentage: 100,
            description: 'Community pattern library',
            segments: ['all']
        },
        'advanced-highlighting': {
            enabled: true,
            rolloutPercentage: 50,
            description: 'Enhanced match highlighting with capture group colors',
            segments: ['all']
        },
        'regex-debugger': {
            enabled: false,
            rolloutPercentage: 0,
            description: 'Step-through regex debugger',
            segments: ['beta-testers']
        },
        'export-to-code': {
            enabled: false,
            rolloutPercentage: 0,
            description: 'Export regex as code snippets',
            segments: ['beta-testers', 'pro-users']
        },
        'performance-v2': {
            enabled: true,
            rolloutPercentage: 25,
            description: 'Next-gen performance optimizations',
            segments: ['all']
        }
    };

    // ── Hash to bucket (0-99) for stable percentage rollouts ──
    function hashToBucket(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash) % 100;
    }

    // ── Initialize ──
    async function initialize() {
        // Load defaults
        for (const [key, config] of Object.entries(DEFAULT_FLAGS)) {
            flags.set(key, { ...config });
        }

        // Get or create stable user ID for bucketing
        const stored = await chrome.storage.local.get(['featureFlagUserId', 'featureFlagOverrides']);

        if (stored.featureFlagUserId) {
            userId = stored.featureFlagUserId;
        } else {
            userId = crypto.randomUUID();
            await chrome.storage.local.set({ featureFlagUserId: userId });
        }

        userBucket = hashToBucket(userId);

        // Load local overrides
        if (stored.featureFlagOverrides) {
            for (const [key, value] of Object.entries(stored.featureFlagOverrides)) {
                overrides.set(key, value);
            }
        }

        initialized = true;
    }

    // ── Check if a flag is enabled ──
    function isEnabled(flagName) {
        if (!initialized) return false;

        // Override takes priority
        if (overrides.has(flagName)) return overrides.get(flagName);

        const flag = flags.get(flagName);
        if (!flag || !flag.enabled) return false;

        // Percentage rollout — use flag-specific bucket for independence
        if (flag.rolloutPercentage < 100) {
            const flagBucket = hashToBucket(`${userId}-${flagName}`);
            return flagBucket < flag.rolloutPercentage;
        }

        return true;
    }

    // ── Override Management ──
    async function setOverride(flagName, enabled) {
        overrides.set(flagName, enabled);
        const { featureFlagOverrides = {} } = await chrome.storage.local.get('featureFlagOverrides');
        featureFlagOverrides[flagName] = enabled;
        await chrome.storage.local.set({ featureFlagOverrides });
    }

    async function clearOverrides() {
        overrides.clear();
        await chrome.storage.local.remove('featureFlagOverrides');
    }

    // ── Debug: Get all flags with current status ──
    function getAllFlags() {
        const result = {};
        for (const [key, config] of flags) {
            result[key] = {
                ...config,
                currentlyEnabled: isEnabled(key),
                hasOverride: overrides.has(key),
                overrideValue: overrides.get(key)
            };
        }
        return result;
    }

    // ── Register a new flag dynamically ──
    function registerFlag(name, config) {
        flags.set(name, {
            enabled: false,
            rolloutPercentage: 0,
            description: '',
            segments: ['all'],
            ...config
        });
    }

    return {
        initialize,
        isEnabled,
        setOverride,
        clearOverrides,
        getAllFlags,
        registerFlag,
        getUserBucket: () => userBucket
    };
})();
