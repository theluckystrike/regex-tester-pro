# Regex Tester Pro — Complete Extension Specification
## Codename: REGEX TESTER PRO
## Version: 1.0.0
## Date: February 7, 2026

---

## SECTION 1: PRODUCT OVERVIEW

### 1.1 Extension Identity

- **Name:** Regex Tester Pro
- **Tagline:** Test, debug, and master regex — right in your browser
- **Category:** Developer Tools
- **Chrome Web Store URL:** `regex-tester-pro` (target slug)
- **Target Users:**
  - **Primary:** Backend and fullstack developers who write regex weekly+
  - **Secondary:** DevOps engineers, QA engineers, data analysts who parse logs/data
  - **Tertiary:** Students and junior developers learning regex

### 1.2 Problem Statement

**Pain:** Debugging regex is one of the most time-consuming developer tasks. Developers waste 15-30 minutes per regex debugging session, context-switching to web tools like regex101.com.

**Current Alternatives and Weaknesses:**

| Alternative | Weakness |
|-------------|----------|
| regex101.com | Requires tab switch, no browser integration, no AI assist |
| regexr.com | No AI, no code generation, no offline |
| Chrome regex extensions (Regex Matcher, etc.) | Zero monetization, minimal features, no AI, no multi-flavor |
| RegexBuddy ($59.95) | Desktop only, expensive, no Chrome integration |
| RegexBox ($6.99/mo) | Web only, no Chrome extension, higher price |
| ChatGPT/Claude | 66% of devs frustrated by "almost right" regex — no verification |

**Why Users Will Choose This Extension:**
1. Zero context-switch — test regex without leaving current tab
2. AI-powered generation + instant verification (solves the 66% frustration gap)
3. Multi-flavor support across JS, Python, Go, PHP, Java, C#, Ruby
4. ReDoS vulnerability scanner — unique security feature
5. Live page regex testing — select text on any page, test against it
6. $4.99/mo (29% cheaper than RegexBox, infinitely cheaper than RegexBuddy)

### 1.3 Success Metrics

| Metric | 30 Days | 60 Days | 90 Days |
|--------|---------|---------|---------|
| Installs | 1,000 | 5,000 | 10,000 |
| Weekly Active Users | 300 | 1,500 | 3,000 |
| Conversion Rate | 2% | 3% | 4% |
| Paying Users | 20 | 150 | 400 |
| MRR | $100 | $675 | $1,800 |
| Rating | 4.0+ | 4.3+ | 4.5+ |

---

## SECTION 2: FEATURE SPECIFICATION

### 2.1 Complete Feature Matrix

| Feature | Description | Free Tier | Pro Tier | Technical Notes |
|---------|-------------|-----------|----------|-----------------|
| **CORE TESTING** | | | | |
| Pattern Input | Regex pattern input with syntax highlighting | ✅ | ✅ | Monaco editor or CodeMirror |
| Test String Input | Multi-line test string with match highlighting | ✅ | ✅ | Real-time matching via Web Workers |
| Real-time Matching | Instant match highlighting as user types | ✅ | ✅ | Debounced 150ms |
| Flag Toggles | g, i, m, s, u, y flags with visual toggles | ✅ | ✅ | Toggle buttons in header |
| Match Count | Total matches and group count display | ✅ | ✅ | Badge counter |
| Capture Groups | Display named and numbered capture groups | ✅ | ✅ | Collapsible group detail |
| Match Details | Index, length, value for each match | ✅ | ✅ | Scrollable match list |
| Basic Error Messages | Invalid pattern error display | ✅ | ✅ | Inline error below pattern input |
| Replace Preview | Test string replacement with group refs ($1) | ✅ | ✅ | Side-by-side or toggled view |
| **REFERENCE** | | | | |
| Cheatsheet | Quick-reference regex syntax guide | ✅ | ✅ | Collapsible panel, searchable |
| Common Patterns | 5 starter templates (email, URL, IP, date, phone) | ✅ Limited (5) | ✅ Full (100+) | Categorized pattern library |
| **AI-POWERED** | | | | |
| AI Generate | Natural language → regex pattern | ✅ Limited (3/day) | ✅ Unlimited | OpenAI/Anthropic API via backend |
| AI Explain | Regex pattern → human-readable explanation | ✅ Limited (3/day) | ✅ Unlimited | Same API backend |
| AI Fix | "Fix my regex" — analyze and suggest corrections | ❌ | ✅ | Contextual with test string |
| **MULTI-FLAVOR** | | | | |
| JavaScript Flavor | Full JS regex engine | ✅ | ✅ | Native browser engine |
| Python Flavor | Python re module compatibility | ❌ | ✅ | WASM-based Python regex engine |
| Go Flavor | Go regexp package compatibility | ❌ | ✅ | WASM or API-based |
| PHP (PCRE) Flavor | PHP preg_match compatibility | ❌ | ✅ | API-based |
| Java Flavor | java.util.regex compatibility | ❌ | ✅ | API-based |
| **DEVELOPER WORKFLOW** | | | | |
| Code Generation | Generate ready-to-use code snippets | ❌ | ✅ | JS, Python, Go, PHP, Java, C#, Ruby |
| Step-by-Step Debugger | Visual regex execution trace | ❌ | ✅ | Custom debugger engine |
| ReDoS Scanner | Detect catastrophic backtracking vulnerabilities | Preview only | ✅ Full report | Custom analysis algorithm |
| Unit Test Generation | Auto-generate test cases for pattern | ❌ | ✅ | Jest, pytest, Go test formats |
| Live Page Testing | Select text on any page → test regex | ❌ | ✅ | Content script + context menu |
| **ORGANIZATION** | | | | |
| Pattern History | Auto-save recent patterns | ✅ Limited (10) | ✅ Unlimited | chrome.storage.local |
| Save Patterns | Named pattern library | ❌ | ✅ | With categories and tags |
| Search Patterns | Full-text search saved patterns | ❌ | ✅ | Indexed search |
| Export Patterns | Export as JSON or code snippets | ❌ | ✅ | Download or copy to clipboard |
| **UI/EXPERIENCE** | | | | |
| Dark/Light Mode | Theme toggle | ✅ | ✅ | System preference detection |
| Keyboard Shortcuts | Power user shortcuts | ✅ | ✅ | Cmd+Enter to test, etc. |
| Resizable Panels | Adjust input/output panel sizes | ✅ | ✅ | Drag handle |

### 2.2 Free Tier Specification

| Feature | Exact Limit | Rationale |
|---------|-------------|-----------|
| Core regex testing (all flags, matching, groups) | Unlimited | Never gate core function — drives adoption |
| AI Generation | 3 per day (resets midnight UTC) | Enough to taste value, drives conversion |
| AI Explanation | 3 per day (shared counter with generation) | Same counter creates urgency |
| Pattern History | Last 10 patterns auto-saved | Enough to be useful, drives save desire |
| Common Patterns | 5 templates (email, URL, IP, date, phone) | Shows pattern library exists, want more |
| ReDoS Scanner | "1 potential issue found" banner only | Creates security anxiety → upgrade |
| JavaScript Flavor | Full | Default dev language, table stakes |
| Theme + Shortcuts | Full | Quality of life, no conversion impact |

### 2.3 Pro Tier Specification

| Feature | Why Worth Paying | Connection to Free |
|---------|-----------------|-------------------|
| Unlimited AI | Saves 2+ hours/week per developer | They've tasted 3/day, want more |
| Multi-Flavor | Fullstack devs NEED Python/Go/PHP daily | Tried to switch, saw lock |
| Code Generation | Eliminates manual code writing | Natural next step after testing |
| Step Debugger | Solves "why doesn't this match?" | Frustration from failed patterns |
| Full ReDoS Report | Security compliance for production | Saw warning, needs full report |
| Unlimited Save/Export | Personal pattern library grows | Hit 10-pattern limit |
| Live Page Testing | Test against real web content | Unique to Chrome extension |
| Unit Test Gen | Professional workflow (CI/CD integration) | Power user feature |

### 2.4 Feature Priority (MVP)

**P0 — Must Have for Launch (Week 1):**
- Pattern input with syntax highlighting
- Test string with real-time match highlighting
- All flag toggles (g, i, m, s, u, y)
- Match count, capture groups, match details
- Replace preview
- Cheatsheet/reference panel
- Dark/Light mode
- Keyboard shortcuts
- Pattern history (last 10)
- Basic error messages
- Pro/Free tier infrastructure

**P1 — Add Within 2 Weeks:**
- AI Generate (3/day free, unlimited pro)
- AI Explain (3/day free, unlimited pro)
- Common patterns library (5 free, 100+ pro)
- Multi-flavor support (Pro)
- Code generation (Pro)
- Payment integration

**P2 — Future Roadmap:**
- Step-by-step debugger
- ReDoS vulnerability scanner
- Live page testing
- Unit test generation
- AI Fix suggestions
- Save/organize/export patterns
- Sync across devices (Zovo membership)

---

## SECTION 3: PAYWALL SPECIFICATION

### 3.1 Paywall Trigger Points

| Trigger | Condition | User Action | Paywall Type |
|---------|-----------|-------------|--------------|
| AI Usage Limit | 4th AI generation/explanation in a day | User clicks "Generate" or "Explain" | Soft modal (dismissable) |
| Multi-Flavor Gate | User clicks Python/Go/PHP/Java tab | Clicks non-JS flavor tab | Feature lock inline |
| Pattern Save Limit | 11th pattern save attempt | User clicks "Save Pattern" | Soft modal (dismissable) |
| Code Generation | User clicks "Generate Code" button | Clicks code gen button | Feature lock inline |
| ReDoS Full Report | User clicks "View Full Report" on warning | Clicks report link | Feature lock inline |
| Step Debugger | User clicks "Debug" button | Clicks debug button | Feature lock inline |
| Live Page Testing | User attempts context menu regex test | Right-clicks text on page | Feature lock inline |

### 3.2 Paywall UI Specifications

**TRIGGER: AI Usage Limit (Primary Conversion Driver)**

```
TRIGGER: AI Daily Limit
CONDITION: 4th AI request in calendar day
MODAL TYPE: Soft dismiss (can close, continue using core features)

VISUAL SPEC:
┌─────────────────────────────────────────────┐
│  🧠                                         │
│                                              │
│  You've used all 3 free AI assists today     │
│                                              │
│  Pro developers save 2+ hours per week       │
│  with unlimited AI regex generation.         │
│                                              │
│  ┌─────────────────────────────────────────┐ │
│  │     Try Pro Free for 7 Days →           │ │
│  └─────────────────────────────────────────┘ │
│                                              │
│  Maybe later · Resets tomorrow               │
└─────────────────────────────────────────────┘

COPY:
- Headline: "You've used all 3 free AI assists today"
- Body: "Pro developers save 2+ hours per week with unlimited AI regex generation."
- Primary CTA: "Try Pro Free for 7 Days →"
- Secondary: "Maybe later · Resets tomorrow"

BEHAVIOR:
- Dismissable: Yes
- Remember dismissal: No (show each time limit hit)
- Animation: Fade in with subtle scale (300ms)
```

**TRIGGER: Multi-Flavor Gate**

```
TRIGGER: Non-JS Flavor Selection
CONDITION: User clicks Python/Go/PHP/Java/C#/Ruby tab
MODAL TYPE: Inline lock (replaces flavor content area)

VISUAL SPEC:
┌─────────────────────────────────────────────┐
│  [JS] [Python 🔒] [Go 🔒] [PHP 🔒] [Java 🔒]│
├─────────────────────────────────────────────┤
│                                              │
│  🔒 Python regex flavor is a Pro feature     │
│                                              │
│  Test your patterns across 7 languages       │
│  with Regex Tester Pro.                      │
│                                              │
│  [Unlock All Flavors — $4.99/mo]             │
│                                              │
└─────────────────────────────────────────────┘

COPY:
- Headline: "Python regex flavor is a Pro feature"
- Body: "Test your patterns across 7 languages with Regex Tester Pro."
- Primary CTA: "Unlock All Flavors — $4.99/mo"
- Secondary: (none — user switches back to JS tab)

BEHAVIOR:
- Dismissable: Yes (click JS tab to return)
- Remember dismissal: N/A
- Animation: Slide in from right (200ms)
```

**TRIGGER: Pattern Save Limit**

```
TRIGGER: 11th Pattern Save
CONDITION: User has 10 saved patterns and attempts to save another
MODAL TYPE: Soft dismiss modal

VISUAL SPEC:
┌─────────────────────────────────────────────┐
│  📚                                         │
│                                              │
│  Your regex library is growing!              │
│                                              │
│  You've saved 10/10 free patterns.           │
│  Upgrade to save unlimited patterns          │
│  with categories, tags, and search.          │
│                                              │
│  [Save Unlimited Patterns — Try Pro]         │
│  Maybe later                                 │
└─────────────────────────────────────────────┘

BEHAVIOR:
- Dismissable: Yes
- Remember dismissal: Yes (24 hours)
- Animation: Fade in (300ms)
```

### 3.3 Upgrade Flow

```
1. User hits trigger (AI limit / flavor lock / save limit)
        ↓
2. Paywall modal/inline appears with contextual messaging
        ↓
3. User clicks CTA button ("Try Pro Free for 7 Days")
        ↓
4. Opens upgrade page in new tab (zovo.one/regex-tester-pro/upgrade)
        ↓
5. Stripe Checkout page with:
   - Plan selection (Monthly $4.99 / Annual $39.99)
   - Card input via Stripe Elements
   - Google account link (for license verification)
        ↓
6. Payment success → redirect to success page
        ↓
7. Extension detects Pro status via API polling (every 30s for 5 min)
        ↓
8. Pro badge appears, features unlock, celebration animation
```

### 3.4 Post-Upgrade Experience

- **Immediate:** Pro badge appears in header → all lock icons disappear
- **Celebration:** Confetti animation (500ms) with "Welcome to Pro! 🎉" toast
- **Feature Discovery:** One-time tooltip tour highlighting unlocked features:
  1. "AI is now unlimited" (points to AI button)
  2. "All flavors unlocked" (points to flavor tabs)
  3. "Save unlimited patterns" (points to save button)
- **UI Change:** "Upgrade" button in footer replaced with "Pro" badge
- **Settings:** New "Manage Subscription" link in settings page

---

## SECTION 4: USER INTERFACE SPECIFICATION

### 4.1 Extension Popup (Primary Interface)

```
┌──────────────────────────────────────────────────┐
│  [⚡ Regex Tester Pro]  [PRO badge]  [☀/🌙] [⚙]  │ ← Header (40px)
├──────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────┐  │
│  │ Pattern: /                             /   │  │ ← Pattern Input (48px)
│  │ [g] [i] [m] [s] [u] [y]                   │  │ ← Flag Toggles (32px)
│  └────────────────────────────────────────────┘  │
│  [JS ▼] [🧠 AI Generate] [📖 Explain]           │ ← Action Bar (36px)
├──────────────────────────────────────────────────┤
│  Test String:                                    │
│  ┌────────────────────────────────────────────┐  │
│  │ Enter test text here...                    │  │ ← Test String (120px min)
│  │ Matched text is highlighted                │  │
│  │                                            │  │
│  └────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────┤
│  Replace With: (optional)                        │
│  ┌────────────────────────────────────────────┐  │
│  │ Replacement pattern ($1, $2...)            │  │ ← Replace Input (40px)
│  └────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────┤
│  Matches: 5 found · Groups: 2                   │ ← Result Summary (28px)
│  ┌────────────────────────────────────────────┐  │
│  │ Match 1: "hello" [0-5]                    │  │ ← Match List (scrollable)
│  │   Group 1: "hel"                          │  │
│  │   Group 2: "lo"                           │  │
│  │ Match 2: "hello" [12-17]                  │  │
│  └────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────┤
│  [📋 Cheatsheet] [💾 Save] [<> Code] [🐛 Debug]  │ ← Toolbar (36px)
├──────────────────────────────────────────────────┤
│  AI: 2/3 remaining today     [⭐ Upgrade to Pro] │ ← Footer (32px)
│  Powered by Zovo                                 │
└──────────────────────────────────────────────────┘
```

**Popup Specifications:**
- **Width:** 420px (fixed)
- **Height:** 580px (default, max 600px)
- **Alternative:** Side Panel option for expanded view (full sidebar height, 380px width)

**Color Scheme:**

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Background | #FFFFFF | #1A1A2E |
| Surface | #F8F9FA | #16213E |
| Primary Accent | #6366F1 (Indigo) | #818CF8 |
| Secondary | #8B5CF6 (Purple) | #A78BFA |
| Success (match) | #22C55E | #4ADE80 |
| Warning | #F59E0B | #FBBF24 |
| Error | #EF4444 | #F87171 |
| Text Primary | #1F2937 | #F9FAFB |
| Text Secondary | #6B7280 | #9CA3AF |
| Pro Badge | Linear gradient #6366F1 → #8B5CF6 | Same |

**Typography:**
- **Font Family:** `'Inter', 'SF Pro', -apple-system, sans-serif`
- **Pattern Input:** `'JetBrains Mono', 'Fira Code', monospace` at 14px
- **Test String:** Same mono font at 13px
- **UI Text:** Inter at 13px (body), 11px (labels), 15px (headers)

### 4.2 Settings/Options Page

| Setting | Free | Pro | Location |
|---------|------|-----|----------|
| Theme (Light/Dark/System) | ✅ | ✅ | Settings tab |
| Default flavor | JS only | All flavors | Settings tab |
| Default flags | ✅ | ✅ | Settings tab |
| Keyboard shortcut customization | ✅ | ✅ | Settings tab |
| Auto-save history | ✅ | ✅ | Settings tab |
| History retention period | 7 days | Unlimited | Settings tab (Pro shows unlimited) |
| Pattern library categories | ❌ | ✅ | Settings tab |
| Manage Subscription | N/A | ✅ | Settings tab (Pro only) |
| Export all data | ❌ | ✅ | Settings tab |

### 4.3 Pro Feature Indicators

- **Lock Icons:** 🔒 appears on Pro feature buttons (subtle, semi-transparent)
- **Pro Badge:** Gradient pill badge `PRO` next to feature name
- **Tooltip:** Hover on locked feature → "Pro feature — Upgrade to unlock"
- **Post-Upgrade:** Lock icons disappear, Pro badge in header, subtle ✨ on Pro features for first 24h

### 4.4 Usage Counter UI

- **Location:** Footer bar, left-aligned
- **Format:** `AI: X/3 remaining today`
- **Color States:**
  - 3/3: Green (#22C55E)
  - 2/3: Green (#22C55E)
  - 1/3: Yellow (#F59E0B)
  - 0/3: Red (#EF4444)
- **After limit:** Shows `AI: 0/3 · Resets tomorrow` with upgrade link
- **Pro users:** Counter hidden, replaced with "⭐ Pro" badge

---

## SECTION 5: TECHNICAL ARCHITECTURE

### 5.1 Permissions Required

| Permission | Reason | Required/Optional |
|------------|--------|-------------------|
| `storage` | Save patterns, settings, usage counters, subscription state | Required |
| `activeTab` | Live page regex testing (Pro — inject content script on user action) | Required |
| `scripting` | Inject content script for live page testing | Required |
| `contextMenus` | Right-click "Test regex on selected text" | Required |
| `alarms` | Daily AI counter reset, subscription check schedule | Required |
| `identity` | Google OAuth for Zovo account linking | Optional |

**Permissions NOT needed (minimize for trust):**
- ❌ `tabs` — Not needed, `activeTab` suffices
- ❌ `webRequest` — Not needed
- ❌ `<all_urls>` — Not needed, `activeTab` provides on-demand access
- ❌ `clipboardRead/Write` — Copy uses `navigator.clipboard` in popup context

### 5.2 Storage Schema

```javascript
// chrome.storage.local
{
  "settings": {
    "theme": "system", // "light" | "dark" | "system"
    "defaultFlags": ["g"],
    "defaultFlavor": "javascript",
    "autoSaveHistory": true,
    "keyboardShortcuts": {
      "test": "Cmd+Enter",
      "generate": "Cmd+G",
      "explain": "Cmd+E",
      "clear": "Cmd+K"
    }
  },
  "history": [
    {
      "id": "uuid-v4",
      "pattern": "\\d{3}-\\d{4}",
      "flags": ["g", "i"],
      "testString": "Call 555-1234",
      "flavor": "javascript",
      "timestamp": 1707321600000,
      "name": null // null = auto-saved, string = user-named (Pro)
    }
  ],
  "savedPatterns": [ // Pro only
    {
      "id": "uuid-v4",
      "name": "Email Validator",
      "pattern": "...",
      "flags": ["g", "i"],
      "category": "validation",
      "tags": ["email", "form"],
      "description": "Validates standard email format",
      "createdAt": 1707321600000,
      "updatedAt": 1707321600000
    }
  ],
  "usage": {
    "aiUsageToday": 2,
    "aiUsageDate": "2026-02-07",
    "totalPatternsCreated": 47,
    "totalAiGenerations": 12,
    "installDate": "2026-02-07",
    "lastActiveDate": "2026-02-07"
  },
  "subscription": {
    "isPro": false,
    "plan": null, // "monthly" | "annual" | null
    "expiresAt": null,
    "customerId": null,
    "email": null,
    "trialActive": false,
    "trialEndsAt": null,
    "lastVerifiedAt": null
  }
}
```

### 5.3 API Requirements

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `POST /api/ai/generate` | POST | Natural language → regex | API key + user token |
| `POST /api/ai/explain` | POST | Regex → human explanation | API key + user token |
| `POST /api/ai/fix` | POST | Analyze and fix regex (Pro) | API key + Pro token |
| `POST /api/regex/test/:flavor` | POST | Test regex in non-JS flavors | API key + Pro token |
| `GET /api/subscription/status` | GET | Check Pro subscription status | User token |
| `POST /api/subscription/create-checkout` | POST | Generate Stripe checkout URL | User token |
| `POST /api/webhook/stripe` | POST | Handle Stripe payment events | Stripe signature |
| `POST /api/analytics/event` | POST | Track extension events | API key |

**Rate Limits:**
- Free tier: 3 AI requests/day, 10 regex test requests/day (non-JS flavors)
- Pro tier: 100 AI requests/day, unlimited regex testing
- API: 60 requests/minute per user

### 5.4 Sync Architecture

**Phase 1 (MVP):** Local-only storage, no sync
**Phase 2 (Post-launch):** Zovo membership sync

- **What syncs:** Saved patterns, settings, subscription status
- **Sync frequency:** On extension open + every 30 minutes
- **Conflict resolution:** Last-write-wins with timestamp
- **Offline behavior:** Full functionality maintained, sync queue for saved patterns

### 5.5 Third-Party Dependencies

| Dependency | Purpose | License | Size Impact |
|------------|---------|---------|-------------|
| CodeMirror 6 | Pattern + test string editor | MIT | ~100KB gzipped |
| Web Worker (built-in) | Non-blocking regex execution | N/A | 0KB |
| Inter font (Google Fonts) | UI typography | OFL | 15KB woff2 |
| JetBrains Mono | Code typography | OFL | 15KB woff2 |

**External Services:**
- OpenAI API (or Anthropic Claude API) — AI regex generation/explanation
- Stripe — Payment processing
- Zovo API — Subscription management, analytics
- No other external dependencies

---

## SECTION 6: MONETIZATION INTEGRATION

### 6.1 Pricing

| Tier | Monthly | Annual | Annual Savings |
|------|---------|--------|----------------|
| Free | $0 | $0 | — |
| Pro | $4.99 | $39.99 | 33% ($19.89 saved) |

### 6.2 Payment Integration

- **Payment provider:** Stripe (via Zovo backend)
- **Checkout location:** External webpage (zovo.one/regex-tester-pro/upgrade)
- **Checkout flow:** Stripe Checkout (hosted page) for security and PCI compliance
- **License verification:**
  1. User completes Stripe Checkout
  2. Stripe webhook hits Zovo API
  3. Zovo API stores subscription in database linked to user email
  4. Extension periodically checks `GET /api/subscription/status` with user token
  5. Pro status cached in `chrome.storage.local` (verified every 24 hours)

### 6.3 Trial Strategy

- **Trial length:** 7 days
- **Trial features:** Full Pro (all features unlocked)
- **Trial activation:** One-click from paywall modal (email capture only, no card)
- **Trial messaging cadence:**
  - Day 1: "Welcome to Pro! Here's what's new" (tooltip tour)
  - Day 3: "You've used AI 24 times — that's 4 hours saved" (personalized stat)
  - Day 5: "2 days left in your trial" (soft reminder in footer)
  - Day 7: "Your trial ends today. Keep saving time for $4.99/mo" (modal)
  - Day 8+: Graceful downgrade, patterns kept but locked behind save limit

### 6.4 Zovo Membership Integration

- Extension checks `GET /api/subscription/status` with Google OAuth token
- If user has active Zovo Pro membership → all Pro features unlocked
- Cross-extension auth via shared Zovo authentication token in `chrome.storage.sync`
- "More from Zovo" link in settings → opens zovo.one/extensions page
- "Part of Zovo Pro — 18+ premium dev tools" badge in upgrade modal

---

## SECTION 7: ANALYTICS & TRACKING

### 7.1 Events to Track

| Event | Trigger | Properties |
|-------|---------|------------|
| `extension_installed` | First install | `source, version, browser_language` |
| `extension_opened` | Popup/sidebar opened | `interface_type, session_count` |
| `pattern_tested` | User runs a regex test | `flavor, flags, pattern_length, match_count` |
| `ai_generate_used` | AI generation requested | `tier, usage_count_today, prompt_length` |
| `ai_explain_used` | AI explanation requested | `tier, usage_count_today, pattern_length` |
| `ai_limit_reached` | Hit daily AI limit | `total_uses_today` |
| `flavor_switched` | User clicks flavor tab | `target_flavor, is_pro` |
| `flavor_gate_hit` | Free user clicks Pro flavor | `target_flavor` |
| `pattern_saved` | Pattern saved to library | `tier, total_saved_count` |
| `save_limit_reached` | Hit 10-pattern save limit | `total_saved` |
| `code_generated` | Code generation used | `target_language, tier` |
| `cheatsheet_opened` | Cheatsheet panel opened | — |
| `paywall_shown` | Any paywall displayed | `trigger_type, location, times_shown_total` |
| `paywall_dismissed` | User dismisses paywall | `trigger_type, times_shown_total` |
| `upgrade_clicked` | CTA button clicked | `trigger_type, source` |
| `trial_started` | 7-day trial activated | `trigger_source` |
| `trial_converted` | Trial → paid conversion | `trial_duration_days, plan_type` |
| `trial_expired` | Trial ended without conversion | `total_ai_uses, total_tests` |
| `upgrade_completed` | Payment successful | `plan_type, amount, trigger_source` |
| `subscription_cancelled` | User cancels Pro | `duration_months, usage_stats` |
| `theme_changed` | Light/Dark/System toggle | `new_theme` |
| `error_occurred` | Extension error | `error_type, component, stack_trace` |

### 7.2 Conversion Funnel

```
Install → Open (Day 1) → Test Pattern → AI Used → AI Limit Hit → Paywall Shown → Upgrade Click → Trial Start → Payment
  100%      70%            60%          30%          25%            25%             8%              6%           3%

Key Drop-off Points to Monitor:
  Install → Open:        Did onboarding work?
  Open → Test:           Is UI intuitive?
  Test → AI:             Did they discover AI?
  AI → Limit:            Are 3/day the right limit?
  Limit → Paywall:       Is paywall timing right?
  Paywall → Click:       Is copy/design compelling?
  Click → Trial:         Is flow frictionless?
  Trial → Payment:       Did they experience enough value?
```

---

## SECTION 8: LAUNCH CHECKLIST

### Pre-Development
- [ ] Spec reviewed and approved
- [ ] Design assets ready (icon, colors, typography)
- [ ] Zovo API endpoints available (auth, subscription, analytics)
- [ ] Stripe account configured with product/plans
- [ ] AI API keys provisioned (OpenAI/Anthropic)

### Development
- [ ] Core regex testing engine (all flags, matching, groups)
- [ ] Pattern input with CodeMirror/syntax highlighting
- [ ] Test string with match highlighting
- [ ] Replace preview functionality
- [ ] Flag toggle buttons
- [ ] Match details panel
- [ ] Cheatsheet/reference panel
- [ ] Dark/Light mode
- [ ] Keyboard shortcuts
- [ ] Pattern history (10-item limit)
- [ ] AI Generate integration (3/day limit)
- [ ] AI Explain integration (3/day limit)
- [ ] Multi-flavor tabs with Pro lock
- [ ] Code generation (Pro)
- [ ] Paywall modals (all triggers)
- [ ] Settings page
- [ ] Usage counter UI
- [ ] Subscription status check
- [ ] Analytics event tracking
- [ ] Onboarding flow (first-run experience)

### Pre-Launch
- [ ] Chrome Web Store listing assets (icon 128px, screenshots, promo tiles)
- [ ] Store description with keywords
- [ ] Privacy policy (regex-tester-pro specific)
- [ ] Screenshots captured (5 minimum)
- [ ] Promotional video (optional)

### Launch
- [ ] Extension submitted to Chrome Web Store
- [ ] Approved by Chrome Web Store review
- [ ] Analytics dashboard configured
- [ ] Error monitoring active (Sentry or equivalent)
- [ ] Support email ready
- [ ] Product Hunt launch post prepared
- [ ] Reddit posts prepared (r/webdev, r/javascript, r/programming)

---

## SECTION 9: SUCCESS CRITERIA

### Week 1
- [ ] 500+ installs
- [ ] 60%+ day-1 activation rate (opened extension)
- [ ] 0 critical bugs
- [ ] 4.0+ star rating
- [ ] Analytics pipeline verified

### Month 1
- [ ] 2,000+ total users
- [ ] 30%+ use AI feature
- [ ] 25%+ hit a paywall trigger
- [ ] 3%+ convert to Pro (including trials)
- [ ] $300+ MRR
- [ ] 4.3+ star rating

### Month 3
- [ ] 10,000+ total users
- [ ] 4%+ conversion rate
- [ ] $1,800+ MRR
- [ ] 4.5+ star rating
- [ ] <2% churn rate
- [ ] 3+ five-star reviews mentioning AI feature

---

*Specification generated by Agent 2: Extension Spec Generator*
*This document is the blueprint for Regex Tester Pro development*
*Next: Feed to deployment system (04-deployment-system.md) to build*
