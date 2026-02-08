// ==========================================================================
// Regex Tester Pro — Sample Patterns Library
// Curated examples to help users learn regex fast
// ==========================================================================

const RegexSamples = (() => {
    'use strict';

    const samples = [
        // ── Basics ──
        {
            category: 'Basics',
            name: 'Match Words',
            description: 'Find all words in a sentence',
            pattern: '\\w+',
            flags: 'g',
            testString: 'Hello World! Regex is awesome 123.'
        },
        {
            category: 'Basics',
            name: 'Match Numbers',
            description: 'Extract all numbers from text',
            pattern: '\\d+',
            flags: 'g',
            testString: 'Order #4521 has 3 items totaling $149.99 shipped on 2024-01-15.'
        },
        {
            category: 'Basics',
            name: 'Match Lines',
            description: 'Match lines starting with a dash',
            pattern: '^- .+$',
            flags: 'gm',
            testString: 'Shopping list:\n- Milk\n- Eggs\n- Bread\nDon\'t forget!\n- Butter'
        },

        // ── Validation ──
        {
            category: 'Validation',
            name: 'Email Address',
            description: 'Validate email format',
            pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
            flags: 'g',
            testString: 'Contact us at hello@zovo.one or support@example.com. Invalid: user@, @domain.com, test@.com'
        },
        {
            category: 'Validation',
            name: 'URL',
            description: 'Match HTTP/HTTPS URLs',
            pattern: 'https?://[\\w\\-._~:/?#\\[\\]@!$&\'()*+,;=%]+',
            flags: 'gi',
            testString: 'Visit https://zovo.one or http://example.com/path?q=test&lang=en for more info. Not a URL: ftp://old.server'
        },
        {
            category: 'Validation',
            name: 'Phone Number',
            description: 'Match common phone formats',
            pattern: '\\+?\\d{1,3}[-.\\s]?\\(?\\d{1,4}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}',
            flags: 'g',
            testString: 'Call me at +1 (555) 123-4567 or 555.987.6543 or +44 20 7946 0958'
        },

        // ── Extraction ──
        {
            category: 'Extraction',
            name: 'IP Addresses',
            description: 'Find IPv4 addresses',
            pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b',
            flags: 'g',
            testString: 'Server 192.168.1.1 responded. Blocked: 10.0.0.255 and 203.0.113.42. Not IP: 999.999.999.999'
        },
        {
            category: 'Extraction',
            name: 'Dates (YYYY-MM-DD)',
            description: 'Extract ISO-format dates',
            pattern: '\\d{4}[-/]\\d{2}[-/]\\d{2}',
            flags: 'g',
            testString: 'Events: 2024-01-15, 2024/03/22, 2025-12-31. Invalid: 2024-1-5, 24-01-15'
        },
        {
            category: 'Extraction',
            name: 'Hex Colors',
            description: 'Match CSS hex color codes',
            pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b',
            flags: 'gi',
            testString: 'Colors: #FF5733, #6366f1, #fff, #000, #E0E7FF. Not hex: #xyz, #12'
        },

        // ── Advanced ──
        {
            category: 'Advanced',
            name: 'Capture Groups',
            description: 'Extract first and last name',
            pattern: '(\\w+)\\s(\\w+)',
            flags: 'g',
            testString: 'John Smith, Jane Doe, Bob Wilson'
        },
        {
            category: 'Advanced',
            name: 'Named Groups',
            description: 'Extract structured data with labels',
            pattern: '(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})',
            flags: 'g',
            testString: 'Born: 1990-05-23, Hired: 2020-09-01, Deadline: 2025-12-31'
        },
        {
            category: 'Advanced',
            name: 'Lookahead',
            description: 'Match word followed by a number',
            pattern: '\\w+(?=\\d)',
            flags: 'g',
            testString: 'item1 item2 hello world3 test foo42 bar'
        },

        // ── Replace ──
        {
            category: 'Replace',
            name: 'Strip HTML Tags',
            description: 'Remove all HTML tags from text',
            pattern: '<[^>]+>',
            flags: 'g',
            testString: '<h1>Hello</h1> <p>This is <strong>bold</strong> and <em>italic</em> text.</p>'
        },
        {
            category: 'Replace',
            name: 'Trim Whitespace',
            description: 'Collapse multiple spaces into one',
            pattern: '\\s{2,}',
            flags: 'g',
            testString: 'Too   many    spaces   between    these   words  here.'
        },
        {
            category: 'Replace',
            name: 'camelCase to kebab-case',
            description: 'Convert camelCase variables to kebab-case',
            pattern: '([a-z])([A-Z])',
            flags: 'g',
            testString: 'backgroundColor fontSize marginTop borderRadius maxWidth'
        }
    ];

    function getCategories() {
        const cats = [];
        const seen = new Set();
        for (const s of samples) {
            if (!seen.has(s.category)) {
                seen.add(s.category);
                cats.push(s.category);
            }
        }
        return cats;
    }

    function getByCategory(category) {
        return samples.filter(s => s.category === category);
    }

    function getAll() {
        return samples;
    }

    return { getCategories, getByCategory, getAll };
})();
