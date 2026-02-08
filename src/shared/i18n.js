// ==========================================================================
// Regex Tester Pro — Internationalization System
// MD 15: i18n infrastructure for multi-language support
// ==========================================================================

const I18n = (() => {
    'use strict';

    // Default locale
    let currentLocale = 'en';
    let messages = {};

    // Supported locales (MD 15 top markets)
    const SUPPORTED_LOCALES = ['en', 'es', 'pt_BR', 'de', 'fr', 'ja', 'zh_CN', 'ko'];

    // English strings (default)
    const EN_STRINGS = {
        // Header
        'app_name': 'Regex Tester Pro',
        'pro_badge': '⭐ Pro',

        // Main UI
        'pattern_placeholder': 'Enter regex pattern...',
        'test_placeholder': 'Enter test string...',
        'replace_placeholder': 'Replacement string...',
        'replace_result_label': 'Replace Result',

        // Flags
        'flag_global': 'Global',
        'flag_case': 'Case Insensitive',
        'flag_multiline': 'Multiline',
        'flag_dotall': 'Dot All',
        'flag_unicode': 'Unicode',
        'flag_sticky': 'Sticky',

        // Results
        'matches_found': '{count} match(es) found',
        'no_matches': 'No matches',
        'error_label': 'Error',

        // Groups
        'capture_groups': 'Capture Groups',
        'group_number': 'Group {n}',
        'named_group': 'Named: {name}',

        // History
        'history_title': 'Pattern History',
        'history_empty': 'No saved patterns yet',
        'history_clear': 'Clear All',

        // Settings
        'settings_title': 'Settings',
        'settings_theme': 'Theme',
        'settings_auto_save': 'Auto-save patterns',
        'settings_default_flags': 'Default flags',

        // AI
        'ai_title': 'AI Regex Generator',
        'ai_placeholder': 'Describe what you want to match...',
        'ai_generate': 'Generate',
        'ai_remaining': '{count} generations remaining today',
        'ai_limit_reached': 'Daily limit reached. Upgrade for unlimited.',

        // Paywall
        'upgrade_title': 'Upgrade to Pro',
        'upgrade_cta': 'Unlock Everything',
        'upgrade_later': 'Maybe later',

        // Footer
        'built_by': 'Built by Zovo'
    };

    function init(locale) {
        currentLocale = SUPPORTED_LOCALES.includes(locale) ? locale : 'en';
        // In production, load from chrome.i18n or _locales/
        // For now, use EN as the base with fallback
        messages = EN_STRINGS;
    }

    function t(key, params = {}) {
        let text = messages[key] || EN_STRINGS[key] || key;
        // Replace {placeholder} tokens
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        return text;
    }

    function getLocale() {
        return currentLocale;
    }

    // Auto-detect from browser
    function detectLocale() {
        const lang = chrome.i18n?.getUILanguage?.() || navigator.language || 'en';
        const normalized = lang.replace('-', '_');
        return SUPPORTED_LOCALES.includes(normalized) ? normalized : 'en';
    }

    return {
        SUPPORTED_LOCALES,
        init,
        t,
        getLocale,
        detectLocale
    };
})();
