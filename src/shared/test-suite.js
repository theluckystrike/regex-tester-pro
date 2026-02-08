// ==========================================================================
// Regex Tester Pro — Automated Testing Suite
// MD 10: Self-test framework for extension validation
// ==========================================================================

const TestSuite = (() => {
    'use strict';

    const results = [];

    function assert(condition, testName) {
        results.push({
            test: testName,
            pass: !!condition,
            timestamp: Date.now()
        });
        return !!condition;
    }

    // ── Core Regex Engine Tests ──
    function testRegexEngine() {
        // Basic match
        assert(new RegExp('hello').test('hello world'), 'Basic match: hello in hello world');

        // Flag tests
        assert(new RegExp('HELLO', 'i').test('hello'), 'Case insensitive flag');
        assert('hello hello'.match(/hello/g).length === 2, 'Global flag finds all matches');

        // Capture groups
        const m = '2026-02-07'.match(/(\d{4})-(\d{2})-(\d{2})/);
        assert(m && m[1] === '2026', 'Capture group extraction');

        // Named groups
        const named = '2026-02-07'.match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/);
        assert(named && named.groups.year === '2026', 'Named capture groups');

        // Replace
        assert('foo bar'.replace(/foo/, 'baz') === 'baz bar', 'Basic replace');

        // Backreference replace
        assert('John Smith'.replace(/(\w+) (\w+)/, '$2, $1') === 'Smith, John', 'Backreference replace');

        // Edge cases
        assert(new RegExp('').test('anything'), 'Empty pattern matches anything');
        assert(!/^$/.test('notempty'), 'Empty string pattern on non-empty');

        // Invalid regex handling
        try {
            new RegExp('[invalid');
            assert(false, 'Invalid regex should throw');
        } catch (e) {
            assert(true, 'Invalid regex throws SyntaxError');
        }
    }

    // ── Storage Tests ──
    async function testStorage() {
        try {
            // Write test
            await chrome.storage.local.set({ _test_key: 'test_value' });
            const result = await chrome.storage.local.get('_test_key');
            assert(result._test_key === 'test_value', 'Storage write and read');

            // Remove test
            await chrome.storage.local.remove('_test_key');
            const removed = await chrome.storage.local.get('_test_key');
            assert(removed._test_key === undefined, 'Storage remove');
        } catch (e) {
            assert(false, 'Storage operations: ' + e.message);
        }
    }

    // ── Security Tests ──
    function testSecurity() {
        // HTML sanitization
        if (typeof Security !== 'undefined') {
            const sanitized = Security.sanitizeHTML('<script>alert(1)</script>');
            assert(!sanitized.includes('<script>'), 'XSS sanitization');

            const validated = Security.validatePattern('hello');
            assert(validated.valid === true, 'Valid pattern passes validation');

            const tooLong = Security.validatePattern('a'.repeat(10001));
            assert(tooLong.valid === false, 'Pattern length limit enforced');

            const invalidFlags = Security.validateFlags('xyz');
            assert(invalidFlags.valid === false, 'Invalid flags rejected');
        }
    }

    // ── Performance Tests ──
    function testPerformance() {
        // Regex execution should be fast
        const start = performance.now();
        for (let i = 0; i < 1000; i++) {
            new RegExp('\\d+').test('12345');
        }
        const duration = performance.now() - start;
        assert(duration < 100, '1000 regex executions under 100ms: ' + duration.toFixed(1) + 'ms');
    }

    // ── Run All Tests ──
    async function runAll() {
        results.length = 0;

        testRegexEngine();
        testSecurity();
        testPerformance();
        await testStorage();

        const passed = results.filter(r => r.pass).length;
        const failed = results.filter(r => !r.pass).length;

        return {
            total: results.length,
            passed,
            failed,
            results,
            status: failed === 0 ? 'ALL_PASS' : 'HAS_FAILURES'
        };
    }

    return { runAll, results };
})();
