# 📋 Implementation Plan & Milestone Execution Guide
## Project: OpsPulse — Autonomous SRE & Real-Time Incident War Room
### Hackathon: Zero to Chat (CometChat Hackathon)

---

### 1. Overview & Phase Roadmap

```
+----------------------------------------------------------------------------------------------------+
| PHASE 1: FOUNDATION & MCP ORCHESTRATION (Days 1–3)                                                 |
| • CometChat App Credentials & MCP Connector Setup (`mcp.cometchat.com`)                            |
| • Initialize Vite + React Frontend with Terminal Dark DevOps Design System                         |
| • Backend Setup with Incident Alert Simulator & OpenRouter Free Pipeline                           |
+----------------------------------------------------------------------------------------------------+
                                                  │
                                                  ▼
+----------------------------------------------------------------------------------------------------+
| PHASE 2: REAL-TIME INCIDENT WAR ROOM (Days 4–7)                                                    |
| • CometChat JS SDK Initialization & Responder Auth Flow                                            |
| • Incident War Room Stream (Alert Severity Badges, Real-Time Logs, Typing Cues, Read Receipts)     |
| • Multi-Responder Collaboration Roster (Alex On-Call, Sarah SRE Lead, AI SRE Bot)                 |
+----------------------------------------------------------------------------------------------------+
                                                  │
                                                  ▼
+----------------------------------------------------------------------------------------------------+
| PHASE 3: AUTONOMOUS SRE COPILOT & EMERGENCY CALLING (Days 8–11)                                    |
| • Interactive Git Patch Card Component with `[ 🚀 Approve & Deploy Hotfix ]` Button                |
| • OpenRouter Free Tier AI Diagnostic Engine (LLaMA 3.3 70B:free with automatic failover)           |
| • CometChat Calling SDK Integration for 1-Click Emergency Audio/Video Huddle                       |
| • 1-Click Markdown Post-Mortem Report Generator (`/postmortem`)                                    |
+----------------------------------------------------------------------------------------------------+
                                                  │
                                                  ▼
+----------------------------------------------------------------------------------------------------+
| PHASE 4: POLISH, SPLIT-SCREEN TESTING & SUBMISSION (Days 12–14)                                     |
| • Dual-Browser Multi-User Verification (Live Typing, Voice Call, Hotfix Deployment)                |
| • Record Sub-90s High-Impact Demo Video showcasing MCP Terminal & Live War Room                   |
| • Final README, Architecture Diagrams, MCP Screenshots, & Submission Tweet                         |
+----------------------------------------------------------------------------------------------------+
```

---

### 2. Workstream Breakdown & Task Checklist

#### 🟢 Phase 1: Foundation & MCP Infrastructure (Days 1–3)
- [x] **Task 1.1: CometChat App Setup**
  - Create CometChat account at [app.cometchat.com](https://app.cometchat.com).
  - Create app `opspulse` and record `APP_ID`, `AUTH_KEY`, `REST_API_KEY`, and `REGION`.
  - Create pre-provisioned demo users: `alex_oncall` (Primary), `sarah_lead` (SRE Lead), and `ai_sre_bot` (Autonomous SRE).
- [x] **Task 1.2: CometChat MCP Server & CLI Installation**
  - Connect MCP: `claude mcp add --transport http cometchat https://mcp.cometchat.com/mcp?ref=z2c`.
  - Run `npx @cometchat/skills-cli@3 auth login`.
  - Capture terminal snapshots for the video demo.
- [x] **Task 1.3: Initialize Frontend Application**
  - Scaffold Vite React client in `frontend/`.
  - Install dependencies: `@cometchat/chat-sdk-javascript`, `@cometchat/calls-sdk-javascript`, `lucide-react`.
  - Implement design tokens in `frontend/src/styles/theme.css` following [UI_UX_DESIGN_BRIEF.md](file:///c:/Users/Pranjay/Desktop/hackathon/COMET-CHAT/OpsPulse/docs/UI_UX_DESIGN_BRIEF.md) with full Vercel guidelines compliance.
- [x] **Task 1.4: Backend Modernization (`gpt-backend`)**
  - Configure `.env` with `OPENROUTER_API_KEY`, `OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free`, `OPENROUTER_FALLBACK_MODELS`, and CometChat credentials.
  - Implement modular routes: `/routes/incident.js` (simulation) and `/routes/sre.js` (AI diagnostics).
  - Test health endpoint `GET /api/health`.

---

#### 🔵 Phase 2: Real-Time Incident War Room (Days 4–7)
- [x] **Task 2.1: CometChat Service Client (`cometchatService.js`)**
  - Implement `initCometChat()`.
  - Implement `loginResponder(uid)` with fast 1-click switcher.
  - Implement `joinIncidentChannel(guid)`.
- [x] **Task 2.2: Incident Stream & Header UI**
  - Build incident header with pulsing severity badge (`P1 - CRITICAL`), failing service tag (`auth-service`), and "Join Audio War Room" button.
  - Build message stream with support for system alert cards, human bubbles, and code blocks.
- [x] **Task 2.3: Real-Time Typing & Read Receipts**
  - Bind `onTypingStarted` and `onTypingEnded` listeners for real-time typing waves.
  - Bind `onMessagesRead` listener for double cyan checkmarks (`✓✓`).

---

#### 🟣 Phase 3: AI SRE Copilot & Emergency Calling (Days 8–11)
- [x] **Task 3.1: OpenRouter Free Model Diagnostic Engine**
  - Implement `POST /api/sre/diagnose` passing stack traces to `meta-llama/llama-3.3-70b-instruct:free` with OpenRouter native fallback array.
  - Generate structured unified Git diffs and root cause explanations.
- [x] **Task 3.2: Interactive Git Patch Card Component**
  - Render radiant border card with syntax-highlighted diff (`+` green, `-` red).
  - Implement `[ 🚀 Approve & Deploy Hotfix ]` button triggering `/api/sre/deploy`.
  - Broadcast health restoration (`Health Check: 200 OK`) to the CometChat channel.
- [x] **Task 3.3: Emergency WebRTC Voice Huddle (CometChat Calling SDK)**
  - Integrate `@cometchat/calls-sdk-javascript`.
  - Trigger audio call on "Join Audio War Room" click.
  - Implement `onIncomingCallReceived` modal with audio chime and Accept/Decline actions.
  - Build active call toolbar (Mute, Camera Toggle, End Huddle).
- [x] **Task 3.4: 1-Click Post-Mortem Generator**
  - Intercept `/postmortem` command or click prompt chip.
  - Call `/api/sre/postmortem` to generate full Markdown incident review report.

---

#### 🟡 Phase 4: Polish, Testing & Demo Submission (Days 12–14)
- [x] **Task 4.1: Split-Screen Live Verification**
  - Open Browser A (Alex) and Browser B (Sarah) side by side.
  - Verify live alert dispatch, typing indicator, instant voice huddle, Git patch card deploy, and post-mortem generation.
- [ ] **Task 4.2: Record 80-Second Demo Video (User Action)**
  - Follow the storyboard in [PITCH.md](file:///c:/Users/Pranjay/Desktop/hackathon/COMET-CHAT/OpsPulse/docs/PITCH.md):
    1. Alert & MCP terminal auto-creation (15s)
    2. Responders enter war room (15s)
    3. Emergency audio huddle initiation (15s)
    4. AI Git patch card & 1-click deploy (25s)
    5. Post-Mortem generation & wrap-up (10s)
- [x] **Task 4.3: Submission Package**
  - Update `README.md` with features, architecture, and MCP screenshots.
  - Ready for project submission on Unstop.
