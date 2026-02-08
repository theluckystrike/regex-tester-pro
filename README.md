# Regex Tester Pro

> Test, debug, and master regex — right in your browser

A premium Chrome extension for backend/fullstack developers who need to test, debug, and generate regex patterns without leaving their browser.

## 🎯 Target Audience

Backend and fullstack developers who use regex daily across multiple languages (JavaScript, Python, Go, PHP, Java).

## 💰 Business Model

- **Free Tier:** Core regex testing, 3 AI assists/day, JS flavor, 10 saved patterns
- **Pro Tier:** $4.99/mo — Unlimited AI, all flavors, code generation, debugger, ReDoS scanner

## 📚 Documentation

- [Competitive Intelligence Report](./docs/01-competitive-intel-report.md) — Market analysis and competitor data
- [Product Specification](./regex-tester-pro-spec.md) — Complete buildable specification

## 🛠 Tech Stack

- **Manifest:** V3
- **UI:** HTML/CSS/JS with CodeMirror 6
- **Backend:** Zovo API (Node.js)
- **Payments:** Stripe
- **AI:** OpenAI/Anthropic API

## 📁 Project Structure

```
regex-tester-pro/
├── docs/                    # Documentation and research
│   └── 01-competitive-intel-report.md
├── src/                     # Extension source code (coming)
│   ├── popup/               # Popup UI
│   ├── background/          # Service worker
│   ├── content/             # Content scripts
│   └── shared/              # Shared utilities
├── assets/                  # Icons and images
├── manifest.json            # Chrome extension manifest
├── regex-tester-pro-spec.md # Full product specification
└── README.md
```

## 🗺 Roadmap

- **Phase 1 (Week 1):** Core regex testing MVP
- **Phase 2 (Week 2-3):** AI integration, multi-flavor, payments
- **Phase 3 (Month 2):** Step debugger, ReDoS scanner, live page testing

## 📄 License

Proprietary — Zovo (zovo.one)
