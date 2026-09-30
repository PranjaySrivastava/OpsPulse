# 🧠 BRAIN.md — OpsPulse Global Project Context & Architecture

> **Purpose**: Single source of truth and global context memory for AI assistants working on **OpsPulse**. It eliminates redundant codebase scanning and provides instant clarity on project architecture, conventions, APIs, and hackathon requirements.

---

### 1. Project Quick Facts
- **Project Name**: OpsPulse — Autonomous SRE & Real-Time Incident War Room
- **Competition**: Zero to Chat: CometChat Hackathon (14-day sprint on Unstop)
- **Winning Concept**: Mission-critical incident triage platform combining:
  1. **CometChat Core**: Real-time messaging, presence, read receipts, and **WebRTC emergency voice/video calling**.
  2. **CometChat MCP Server**: Model Context Protocol connector (`https://mcp.cometchat.com/mcp?ref=z2c`) for autonomous incident war room provisioning and user onboarding.
  3. **OpenRouter Free Tier Failover**: Flagship reasoning (`meta-llama/llama-3.3-70b-instruct:free`) for root-cause diagnosis, syntax-highlighted Git diff cards with interactive `[Approve & Deploy Hotfix]` buttons, and automated post-mortem reports.

---

### 2. Directory Structure & File Map

```
OpsPulse/
├── docs/                           # Hackathon documentation suite
│   ├── HACKATHON_PLAN.md           # Strategic overview and milestones
│   ├── PITCH.md                    # Judge presentation pitch deck & 90s demo script
│   ├── PRD.md                      # Product Requirements Document
│   ├── TRD.md                      # Technical Requirements Document
│   ├── UI_UX_DESIGN_BRIEF.md       # Vercel guidelines, design tokens, A11y rules
│   ├── APP_FLOW.md                 # User journeys, click matrix, state transitions
│   ├── brain.md                    # This master context file
│   └── IMPLEMENTATION_PLAN.md      # Day-by-day task checklist & execution steps
├── frontend/                       # Modern Incident War Room Client (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Incident/           # IncidentHeader, SeverityBadge, HealthCheck
│   │   │   ├── Chat/               # WarRoomStream, MessageItem, ChatInput
│   │   │   ├── SRE/                # GitPatchCard, ActionButtons, PostMortemModal
│   │   │   ├── Calls/              # EmergencyHuddleBar, IncomingCallModal
│   │   │   ├── Sidebar/            # IncidentDirectory, OnCallRoster, Presence
│   │   │   └── Auth/               # Fast On-Call Responder Switcher
│   │   ├── services/
│   │   │   ├── cometchatService.js # CometChat JS SDK wrapper
│   │   │   ├── callingService.js   # CometChat WebRTC Calling SDK wrapper
│   │   │   └── sreService.js       # Backend SRE proxy (/api/sre/diagnose, /deploy)
│   │   ├── styles/
│   │   │   └── theme.css           # Terminal Dark DevOps design system (Vercel compliant)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── gpt-backend/                    # Express Server & SRE AI Proxy
│   ├── server.js                   # Express server entry point
│   ├── routes/
│   │   ├── incident.js             # Incident alert simulator & MCP room creator
│   │   ├── sre.js                  # OpenRouter free model diagnosis & diff generator
│   │   └── auth.js                 # Demo responder sync
│   ├── package.json
│   └── .env.example                # Template for OPENROUTER_API_KEY, COMETCHAT keys
├── brain.md                        # Root context mirror
└── README.md                       # Project submission overview & setup guide
```

---

### 3. Core Tech Stack & Dependencies
- **Client**: React 18+, Vite, `@cometchat/chat-sdk-javascript` (v4+), `@cometchat/calls-sdk-javascript` (v4+), Lucide Icons.
- **Server**: Node.js, Express, `openai` (configured with `baseURL: "https://openrouter.ai/api/v1"`), `cors`, `dotenv`, `axios`.
- **MCP Connector**: CometChat MCP server (`https://mcp.cometchat.com/mcp?ref=z2c`) and `@cometchat/skills-cli@3`.
- **Styling**: Vanilla Modern CSS using design tokens adhering strictly to the Vercel Web Interface Guidelines (`color-scheme: dark`, high-contrast `:focus-visible`, compositor-only motion, `prefers-reduced-motion` support).

---

### 4. OpenRouter Free Tier AI Conventions

- **Model Selection & Native Failover Chain**:
  1. `meta-llama/llama-3.3-70b-instruct:free` (Primary: 70B Flagship Reasoning & Git Diffs)
  2. `meta-llama/llama-3.1-8b-instruct:free` (Fallback 1: High speed triage)
  3. `google/gemini-2.0-flash-exp:free` (Fallback 2: Large context window)
  4. `qwen/qwen-2.5-coder-32b-instruct:free` (Fallback 3: Specialized code syntax)
- **Failover Call Pattern**:
  Pass `extra_body: { models: OPENROUTER_MODELS }` so OpenRouter automatically routes requests to the next available free model if one is busy or rate-limited.

---

### 5. CometChat Conventions in OpsPulse

#### Incident Room Channel ID Convention
- Prefix: `inc_` followed by incident number (e.g. `inc_409_auth`).
- Type: `CometChat.GROUP_TYPE.PUBLIC` or `PASSWORD`.

#### Pre-provisioned Demo Responders
- `alex_oncall` (Primary Incident Responder)
- `sarah_lead` (SRE Team Lead)
- `ai_sre_bot` (Autonomous SRE Assistant)

#### Emergency WebRTC Audio Huddle
```javascript
const call = new CometChat.Call(channelGuid, CometChat.CALL_TYPE.AUDIO, CometChat.RECEIVER_TYPE.GROUP);
CometChat.initiateCall(call);
```

---

### 6. Hackathon Demo Script (< 90 seconds)
1. **0:00 - 0:15 (Alert & MCP Trigger)**: Terminal shows simulated alert. MCP command creates `#inc-409-auth-outage` in CometChat.
2. **0:15 - 0:30 (Responders Enter)**: Dual-browser split screen. Alex & Sarah enter. AI SRE posts stack trace and P1 badge.
3. **0:30 - 0:45 (Emergency Audio Huddle)**: Alex clicks "Join Audio War Room". Sarah accepts WebRTC voice call.
4. **0:45 - 1:10 (AI Git Patch & 1-Click Deploy)**: Alex asks `@SRE generate hotfix`. AI SRE outputs Git diff card. Alex clicks `[Approve & Deploy Hotfix]`. Health check turns 200 OK.
5. **1:10 - 1:25 (Post-Mortem Generation)**: Alex types `/postmortem`. Instant post-incident markdown report generated.
6. **1:25 - 1:30 (Wrap-up)**: GitHub repo link & deployment URL.
