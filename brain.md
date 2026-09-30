# 🧠 BRAIN.md — OpsPulse Global Project Context & Architecture

> **Purpose**: Single source of truth and global context memory for AI assistants working on **OpsPulse**.

*See detailed docs in [docs/brain.md](file:///c:/Users/Pranjay/Desktop/hackathon/COMET-CHAT/OpsPulse/docs/brain.md) and [docs/](file:///c:/Users/Pranjay/Desktop/hackathon/COMET-CHAT/OpsPulse/docs).*

---

### 1. Project Quick Facts
- **Project**: OpsPulse — Autonomous SRE & Real-Time Incident War Room
- **Hackathon**: Zero to Chat (CometChat Hackathon on Unstop)
- **Concept**: Real-time Human Incident Triage (CometChat WebSockets & WebRTC Calling) + Autonomous SRE Intelligence (OpenRouter Free Tier Chain) + Automated Infrastructure Orchestration (CometChat MCP).
- **Frontend**: React 18+ (Vite) + CometChat JS SDK & Calling SDK + Terminal Dark Vercel-Compliant Design System.
- **Backend**: Node.js + Express (`gpt-backend/`) + OpenRouter Free Tier API (`https://openrouter.ai/api/v1` with model `meta-llama/llama-3.3-70b-instruct:free`).
- **Core Commands**:
  - Frontend: `npm run dev`
  - Backend: `node server.js`
  - CometChat CLI: `npx @cometchat/skills-cli@3 auth login`
  - CometChat MCP: `https://mcp.cometchat.com/mcp?ref=z2c`

---

### 2. Hackathon Judging Criteria Check
- ✅ **It Runs**: Real-time incident war room with live message stream, typing, presence, and WebRTC voice calls.
- ✅ **It's Interesting**: Mission-critical SRE incident triage replacing broken multi-tool workflows with an autonomous in-room AI partner.
- ✅ **It Uses MCP**: CometChat MCP server automatically provisions incident channels, sets responder access, and seeds diagnostic payloads.
- ✅ **Demo Video**: High-paced 80-second recording demonstrating alert trigger, voice huddle, interactive Git patch card, 1-click deploy, and post-mortem report.
