# 🛠️ Technical Requirements Document (TRD)
## Project: OpsPulse — Autonomous SRE & Real-Time Incident War Room
### Hackathon: Zero to Chat (CometChat Hackathon)

---

### 1. Technology Stack Selection & Architecture

```
+--------------------------------------------------------------------------------------------------+
|                                        CLIENT LAYER (Web UI)                                     |
|  - React 18+ (Vite) + Lucide Icons + Terminal Dark Design System (Vercel Guidelines Compliant)   |
|  - CometChat JS Chat SDK (@cometchat/chat-sdk-javascript v4+)                                    |
|  - CometChat Calling SDK (@cometchat/calls-sdk-javascript v4+)                                   |
+--------------------------------------------------------------------------------------------------+
                                                 |
                 +-------------------------------+-------------------------------+
                 | (Direct Real-Time WebSockets)                                 | (REST API / JSON)
                 v                                                               v
+----------------------------------+                            +----------------------------------+
|      COMETCHAT CLOUD ENGINE      |                            |       EXPRESS BACKEND (Node.js)  |
| - Real-time Incident Chat Stream |                            | - Express 4.x + CORS + Dotenv    |
| - Presence & Typing Listeners    |<-------- Webhooks ---------| - OpenRouter Free Model Pipeline |
| - WebRTC Audio/Video Sessions    |                            | - Incident Simulation & Triggers |
| - CometChat MCP Server Endpoint  |                            | - Git Patch & Post-Mortem Engine |
+-----------------+----------------+                            +-----------------+----------------+
                  ^                                                               |
                  | (Model Context Protocol)                                      v
+-----------------+----------------+                            +----------------------------------+
|     COMETCHAT MCP ECOSYSTEM      |                            |     OPENROUTER FREE AI TIER      |
| - https://mcp.cometchat.com      |                            | - meta-llama/llama-3.3-70b:free  |
| - @cometchat/skills-cli@3        |                            | - meta-llama/llama-3.1-8b:free   |
| - Terminal / Agent Provisioning  |                            | - google/gemini-2.0-flash:free   |
+----------------------------------+                            +----------------------------------+
```

#### 1.1 Frontend
- **Framework**: React 18+ bundled with Vite.
- **Core SDKs**:
  - `@cometchat/chat-sdk-javascript`: Real-time incident room messaging, member presence, typing cues, read receipts.
  - `@cometchat/calls-sdk-javascript`: Real-time WebRTC audio & video calling for emergency triage huddles.
  - `lucide-react`: Technical iconography (Terminal, AlertOctagon, GitPullRequest, PhoneCall, CheckCircle).
- **Styling**: Vanilla Modern CSS using design tokens, glassmorphism overlays, and strict Vercel Web Interface Guidelines compliance (`color-scheme: dark`, compositor-only transforms, `prefers-reduced-motion` support).

#### 1.2 Backend (`gpt-backend`)
- **Runtime**: Node.js (v18+) with Express.js.
- **Key Modules**:
  - `openai`: Configured with OpenRouter endpoint (`baseURL: "https://openrouter.ai/api/v1"`).
  - `cors`: Secure cross-origin requests.
  - `dotenv`: Secrets configuration (`OPENROUTER_API_KEY`, `COMETCHAT_API_KEY`).
  - `axios`: Direct calls to CometChat REST API and webhook simulation.

#### 1.3 CometChat MCP Connector
- **Endpoint**: `https://mcp.cometchat.com/mcp?ref=z2c`
- **Tooling**: `@cometchat/skills-cli@3`
- **Function in OpsPulse**: The MCP server enables automated provisioning of incident channels (`create_group`), membership assignment (`add_members`), and diagnostic dispatch directly from developer agents or CLI commands.

---

### 2. Data Models & Schemas

#### 2.1 Incident Payload
```typescript
interface IncidentAlert {
  incidentId: string;         // e.g. "INC-409"
  severity: "SEV-1" | "SEV-2" | "SEV-3";
  title: string;              // "Database Connection Pool Exhaustion"
  service: string;            // "auth-service"
  errorTrace: string;         // Stack trace or log snippet
  impactedUsersCount: number;
  channelGuid: string;        // CometChat Group GUID (e.g. "inc_409_auth")
  status: "INVESTIGATING" | "MITIGATING" | "RESOLVED";
  createdAt: number;
}
```

#### 2.2 Interactive Git Patch Card
```typescript
interface GitPatchCard {
  incidentId: string;
  failingFile: string;        // "src/controllers/authController.js"
  diff: string;               // Unified diff string
  explanation: string;        // Root cause breakdown
  confidenceScore: number;    // e.g. 0.96
  actions: Array<{
    id: "deploy_hotfix" | "rollback" | "rerun_tests";
    label: string;
    variant: "primary" | "danger" | "secondary";
  }>;
}
```

#### 2.3 Post-Mortem Report
```typescript
interface PostMortemReport {
  incidentId: string;
  title: string;
  durationMinutes: number;
  rootCause: string;
  timeline: Array<{ time: string; event: string }>;
  actionItems: Array<{ task: string; owner: string; status: string }>;
  markdownContent: string;
}
```

---

### 3. API Specifications & Endpoints

#### `POST /api/incident/trigger`
- **Purpose**: Simulates an incoming server crash alert and auto-provisions the CometChat Incident War Room.
- **Request Body**: `{ severity: "SEV-1", service: "auth-service", error: "NullPointer in token parser" }`
- **Response**: `{ incidentId: "INC-409", channelGuid: "inc_409_auth", status: "provisioned" }`

#### `POST /api/sre/diagnose`
- **Purpose**: Generates root cause diagnosis and Git diff patch using OpenRouter free models with failover.
- **Request Body**: `{ incidentId: "INC-409", query: "generate hotfix patch", conversationHistory: [...] }`
- **Response**:
  ```json
  {
    "explanation": "Missing optional chaining on Authorization header causes uncaught TypeError.",
    "diff": "--- a/authController.js\n+++ b/authController.js\n@@ -42,1 +42,1 @@\n- const token = req.headers.authorization.split(' ')[1];\n+ const token = req.headers.authorization?.split(' ')[1] || null;",
    "action": "deploy_ready"
  }
  ```

#### `POST /api/sre/deploy`
- **Purpose**: Executes simulated hotfix deployment, updates health check status, and broadcasts resolution to the CometChat room.
- **Request Body**: `{ incidentId: "INC-409", patchId: "patch_01" }`
- **Response**: `{ success: true, healthStatus: "200 OK", mttrMinutes: "2m 14s" }`

#### `POST /api/sre/postmortem`
- **Purpose**: Compiles full conversation timeline and resolution into a complete Post-Mortem Incident Report.
- **Request Body**: `{ incidentId: "INC-409" }`
- **Response**: `{ markdown: "# 📋 Post-Mortem Report: INC-409\n..." }`

---

### 4. OpenRouter Free Tier Model Chain & Failover Strategy

OpsPulse passes an automated failover chain to OpenRouter to ensure zero downtime and zero cost:
```javascript
const OPENROUTER_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free", // Primary: 70B Flagship Reasoning & Diffs
  "meta-llama/llama-3.1-8b-instruct:free",  // Fallback 1: High speed triage
  "google/gemini-2.0-flash-exp:free",       // Fallback 2: Massive context window
  "qwen/qwen-2.5-coder-32b-instruct:free"   // Fallback 3: Specialized code syntax
];
```

OpenRouter native failover:
```javascript
const completion = await openai.chat.completions.create({
  model: OPENROUTER_MODELS[0],
  messages: [...],
  extra_body: {
    models: OPENROUTER_MODELS
  }
});
```

---

### 5. Environment Variables Specification (`.env.example`)

#### Backend (`gpt-backend/.env`)
```bash
# OpenRouter Free Tier Configuration (Zero Cost)
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free
OPENROUTER_FALLBACK_MODELS=meta-llama/llama-3.1-8b-instruct:free,google/gemini-2.0-flash-exp:free,qwen/qwen-2.5-coder-32b-instruct:free

# CometChat Cloud Credentials
COMETCHAT_APP_ID=your_cometchat_app_id
COMETCHAT_REGION=us
COMETCHAT_AUTH_KEY=your_cometchat_auth_key
COMETCHAT_API_KEY=your_cometchat_rest_api_key

# Server Port
PORT=3000
```

#### Frontend (`frontend/.env`)
```bash
VITE_COMETCHAT_APP_ID=your_cometchat_app_id
VITE_COMETCHAT_REGION=us
VITE_COMETCHAT_AUTH_KEY=your_cometchat_auth_key
VITE_BACKEND_URL=http://localhost:3000
```
