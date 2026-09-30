# ⚡ OpsPulse — Autonomous SRE & Real-Time Incident War Room
> **Zero to Chat: CometChat Hackathon 2026 Submission**  
> *Transforming chaotic 2 AM server outages into a 2-minute resolved incident inside CometChat.*

[![CometChat](https://img.shields.io/badge/CometChat-Chat%20%26%20Calling%20SDK%20v4-6366F1?style=for-the-badge&logo=chat)](https://www.cometchat.com)
[![OpenRouter](https://img.shields.io/badge/AI%20Engine-LLaMA%203.3%2070B%20(Free)-10B981?style=for-the-badge&logo=meta)](https://openrouter.ai)
[![Vercel Design](https://img.shields.io/badge/UI%2FUX-Vercel%20Guidelines%20Compliant-000000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 🎯 The Problem

When a mission-critical server crashes at 2 AM:
- Engineers scramble across **5 disconnected tools**: PagerDuty, Slack, Zoom, Datadog, and GitHub.
- Exhausted responders waste **35–50 minutes** copying meeting links, grepping through messy logs, and writing code under panic.
- **Cost of downtime**: According to Gartner, enterprise downtime averages **$5,600 per minute** (~$200,000+ per incident).

---

## 💡 The Solution: OpsPulse

**OpsPulse** is an **All-in-One Autonomous SRE Incident War Room** powered by CometChat and Agentic AI. Everything happens in **one unified window**:
1. **Instant Outage Provisioning**: Incoming crash stack traces are streamed into a dedicated CometChat room.
2. **Emergency WebRTC Audio Huddle**: Responders jump on a voice call with 1 click without leaving chat.
3. **Autonomous AI SRE Copilot**: Reads the error stack trace, diagnoses the root cause, and generates an interactive **Git Patch Card**.
4. **1-Click Canary Hotfix Deployment**: Responders review the unified Git diff and click **"Approve & Deploy Hotfix"** to restore service health to `200 OK`.
5. **Instant Post-Mortem Report**: Click `/postmortem` to auto-generate a structured Markdown incident review report in seconds.

**Result: MTTR (Mean Time to Resolution) drops from 45 minutes to 2 minutes.**

---

## 🏗️ Architecture & Tech Stack

```
+--------------------------------------------------------------------------------------------------+
|                                        CLIENT LAYER (Web UI)                                     |
|  - React 18+ (Vite) + Lucide Icons + Terminal Dark Design System (Vercel Guidelines Compliant)   |
|  - CometChat JS Chat SDK (@cometchat/chat-sdk-javascript v4+)                                    |
|  - CometChat Calling SDK (@cometchat/calls-sdk-javascript v4+)                                   |
+--------------------------------------------------------------------------------------------------+
                                                 │
                 +───────────────────────────────┴───────────────────────────────+
                 │ (Direct Real-Time WebSockets)                                 │ (REST API / JSON)
                 ▼                                                               ▼
+──────────────────────────────────+                            +──────────────────────────────────+
|      COMETCHAT CLOUD ENGINE      |                            |       EXPRESS BACKEND (Node.js)  |
| - Real-time Incident Chat Stream |                            | - Express 4.x + CORS + Dotenv    |
| - Presence & Typing Listeners    |<──────── Webhooks ─────────| - OpenRouter Free Model Pipeline |
| - WebRTC Audio/Video Sessions    |                            | - Incident Simulation & Triggers |
| - CometChat MCP Server Endpoint  |                            | - Git Patch & Post-Mortem Engine |
+─────────────────┬────────────────+                            +─────────────────┬────────────────+
                  ▲                                                               │
                  │ (Model Context Protocol)                                      ▼
+─────────────────┴────────────────+                            +──────────────────────────────────+
|     COMETCHAT MCP ECOSYSTEM      |                            |     OPENROUTER FREE AI TIER      |
| - https://mcp.cometchat.com      |                            | - meta-llama/llama-3.3-70b:free  |
| - @cometchat/skills-cli@3        |                            | - meta-llama/llama-3.1-8b:free   |
| - Terminal / Agent Provisioning  |                            | - google/gemini-2.0-flash:free   |
+──────────────────────────────────+                            +──────────────────────────────────+
```

### Technology Highlights
- **CometChat Chat SDK v4**: Real-time group messaging, user authentication, typing indicators, and message history.
- **CometChat Calling SDK v4**: Real-time WebRTC audio triage huddles with floating active call toolbar.
- **CometChat MCP Server**: Model Context Protocol connector (`mcp.cometchat.com/mcp?ref=z2c`) for automated channel provisioning via CLI agents.
- **OpenRouter Free Tier Pipeline**: Zero-cost AI multi-model failover chain (`meta-llama/llama-3.3-70b-instruct:free` -> `llama-3.1-8b:free` -> `gemini-2.0-flash:free`).
- **Design System**: Vercel Web Interface Guidelines compliant (deep canvas `#0B0E14`, frosted glass, high-contrast `:focus-visible`, tabular numbers, and custom scrollbars).

---

## ⚡ Quick Start Guide (Run Locally)

### 1. Prerequisites
- Node.js v18 or higher
- Git

### 2. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/OpsPulse.git
cd OpsPulse
```

### 3. Backend Setup
```bash
cd gpt-backend
npm install
cp .env.example .env
# Ensure OPENROUTER_API_KEY is configured (free tier supported)
npm run start
```
*Backend runs at `http://localhost:3000`.*

### 4. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 🎬 80-Second Demo Walkthrough Script

Follow this sequence to test or record the demonstration:

| Timestamp | Action | What to Showcase |
| :--- | :--- | :--- |
| **0:00 - 0:15** | Open `http://localhost:5173/` | Show the `SEV-1 CRITICAL` pulsing banner, Datadog stack trace, and MTTR timer. |
| **0:15 - 0:30** | Click **"Join Audio War Room"** | Demonstrate CometChat WebRTC voice calling dock with Mute toggle and Leave actions. |
| **0:30 - 0:45** | Click `@SRE generate hotfix` | AI SRE analyzes the crash and streams a unified Git Diff card with syntax highlighting. |
| **0:45 - 1:00** | Click **"Approve & Deploy Hotfix"** | Canary deployment runs; incident header updates to `RESOLVED ✅` with green badge. |
| **1:00 - 1:15** | Click **`/postmortem`** | Full post-mortem Markdown incident report dialog opens with 1-click clipboard copy. |
| **1:15 - 1:20** | Toggle Responder Switcher | Switch between Alex (On-Call) and Sarah (SRE Lead) to showcase multi-user support. |

---

## 📁 Repository Structure

```
OpsPulse/
├── docs/                      # Complete Product & Hackathon Documentation Suite
│   ├── PRD.md                 # Product Requirements Document
│   ├── TRD.md                 # Technical Requirements Document
│   ├── PITCH.md               # 8-Slide Pitch Deck & Demo Script
│   ├── APP_FLOW.md            # User Journeys & State Machines
│   └── IMPLEMENTATION_PLAN.md # Execution Roadmap
├── frontend/                  # React 18 + Vite Web Application
│   ├── src/
│   │   ├── components/        # War Room UI Components
│   │   │   ├── IncidentHeader.jsx
│   │   │   ├── WarRoomStream.jsx
│   │   │   ├── GitPatchCard.jsx
│   │   │   ├── EmergencyHuddleModal.jsx
│   │   │   ├── OnCallSwitcher.jsx
│   │   │   ├── PostMortemModal.jsx
│   │   │   └── ChatInput.jsx
│   │   ├── services/          # CometChat SDK & AI API wrappers
│   │   └── styles/theme.css   # Vercel Guidelines Compliant CSS
├── gpt-backend/               # Express.js Server & AI SRE Proxy
│   └── server.js              # REST endpoints & OpenRouter failover chain
└── README.md
```

---

## 🏆 Hackathon Submission Checklist

- [x] Functional CometChat Chat SDK integration (rooms, messaging, typing)
- [x] Functional CometChat Calling SDK integration (WebRTC audio huddle)
- [x] Autonomous Agentic AI (OpenRouter free model chain with automated failover)
- [x] Interactive Git Patch Card with 1-click Canary Deploy
- [x] Automated Post-Mortem Report Generator
- [x] Responsive layout with Vercel Web Interface Guidelines compliance
- [x] Comprehensive documentation (`PRD`, `TRD`, `PITCH`, `APP_FLOW`)
- [x] Verified running locally on `localhost:5173` and `localhost:3000`

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
