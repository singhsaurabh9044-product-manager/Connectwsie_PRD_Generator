# ConnectWise PRD Generator

AI-powered Product Requirements Document generator for ConnectWise Product Managers.

Built with React + Claude (Anthropic API). Generates complete 19-section PRDs tailored to ConnectWise's partner ecosystem (MSP / MSSP / TSP).

---

## Features

- 🚀 **AI-generated PRDs** — full 19-section documents from a few sentences
- 🎤 **Voice input** — speak your requirement (Chrome/Edge)
- ✨ **Prompt enhancer** — expands brief inputs into richer briefs
- 📡 **Live streaming** — PRD sections appear in real time
- 📚 **History** — last 20 PRDs saved in browser localStorage
- 📋 **Copy to Markdown / Confluence** — one-click export
- 🔑 **API key gate** — secure, browser-session only (or env var for Vercel)

---

## Deploy to Vercel (5 minutes)

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create connectwise-prd-generator --public --push
# or push to your existing GitHub org
```

### Step 2 — Import in Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your `connectwise-prd-generator` repo
4. Framework preset: **Create React App** (auto-detected)

### Step 3 — Add Environment Variable

In the Vercel import screen (or later in Project Settings → Environment Variables):

| Name | Value |
|---|---|
| `REACT_APP_ANTHROPIC_API_KEY` | `sk-ant-api03-...` |

> The API key screen won't appear when this env var is set — users go straight to the generator.

### Step 4 — Deploy

Click **Deploy**. Your app will be live at `https://your-project.vercel.app` in ~60 seconds.

---

## Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Create your .env.local
cp .env.example .env.local
# Edit .env.local and add your Anthropic API key

# 3. Start the app
npm start
# Opens at http://localhost:3000
```

---

## Use in Cursor / Lovable / Other AI Tools

The entire app is a single file: **`src/App.jsx`**

- **Cursor**: Open `src/App.jsx`, edit freely, run `npm start`
- **Lovable**: Paste contents of `src/App.jsx` as a React component
- **v0 (Vercel)**: Paste `src/App.jsx` into the v0 editor

The only external dependency is the Anthropic API — no backend needed.

---

## Project Structure

```
connectwise-prd-generator/
├── public/
│   └── index.html
├── src/
│   ├── index.js       # React entry point
│   └── App.jsx        # Entire application (single file)
├── .env.example       # API key template
├── .gitignore
├── package.json
├── vercel.json        # Vercel config
└── README.md
```

---

## Security Notes

- API key is stored in browser session memory only (never localStorage)
- When deployed via Vercel with env var, the key is never exposed to end users
- For team use: deploy once with the env var set — teammates use the tool without seeing the key

---

## PRD Sections Generated

1. Executive Summary
2. PRD Summary Table
3. Objectives & Outcomes
4. Scope
5. Partner Segmentation
6. Feature Comparison Across Products
7. Feature Gaps and Pain Points
8. Success KPIs
9. Assumptions & Dependencies
10. Milestones & Phased Delivery
11. Personas and Usage Scenarios
12. Detailed Requirements Table
13. Non-Functional Requirements
14. Migration Requirements
15. Release Readiness Requirements
16. Risks & Mitigation
17. Quantitative Insights
18. Out of Scope
19. Reference Links
