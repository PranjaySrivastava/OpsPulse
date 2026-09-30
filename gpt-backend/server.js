// server.js — OpsPulse Backend & AI SRE Proxy
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const path = require("path");

// Load .env from local or parent directory
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = express();
app.use(cors());
app.use(express.json());

// OpenRouter Free Models Chain with automated failover
const OPENROUTER_MODELS = [
  process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "google/gemini-2.0-flash-exp:free",
  "qwen/qwen-2.5-coder-32b-instruct:free",
];

const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPEN_ROUTER_API_KEY || process.env.OPENAI_API_KEY || "";

let client = null;
if (apiKey) {
  client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
    defaultHeaders: {
      "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
      "X-Title": process.env.SITE_NAME || "OpsPulse Incident War Room",
    },
  });
  console.log("✅ OpenRouter AI client configured with free model chain.");
} else {
  console.warn("⚠️ No OPENROUTER_API_KEY detected in .env. Running with local SRE heuristic engine.");
}

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "OpsPulse Backend",
    timestamp: Date.now(),
    modelChain: OPENROUTER_MODELS,
  });
});

// 2. Simulate or Trigger Incident Alert
app.post("/api/incident/trigger", (req, res) => {
  const incidentData = {
    incidentId: "INC-" + Math.floor(100 + Math.random() * 900),
    severity: "SEV-1",
    title: "Auth Service 500 Outage & Pool Exhaustion",
    service: "auth-service",
    channelGuid: "inc_409_auth",
    impactedUsers: 640,
    timestamp: Date.now(),
    errorTrace: `TypeError: Cannot read properties of undefined (reading 'split')
    at authController.js:42:47
    at Layer.handle [as handle_request] (express/router/layer.js:95:5)
    at next (express/router/route.js:144:13)
    at Route.dispatch (express/router/route.js:114:3)`,
  };

  res.json(incidentData);
});

// 3. AI SRE Diagnostics & Git Diff Patch Generator
app.post("/api/sre/diagnose", async (req, res) => {
  const { incidentId, query, conversationContext } = req.body;

  // Fallback diagnostic patch
  const fallbackPatch = {
    explanation:
      "The incoming request is missing the standard 'Authorization' bearer header. `req.headers.authorization.split(' ')` causes an uncaught TypeError crash on null/undefined.",
    failingFile: "src/controllers/authController.js",
    diff: `--- a/src/controllers/authController.js
+++ b/src/controllers/authController.js
@@ -40,4 +40,5 @@
- const authHeader = req.headers.authorization;
- const token = authHeader.split(" ")[1];
+ const authHeader = req.headers.authorization || "";
+ const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
+ if (!token) return res.status(401).json({ error: "Missing or malformed Authorization header" });`,
    action: "deploy_ready",
  };

  if (!client) {
    return res.json(fallbackPatch);
  }

  try {
    const prompt = `You are an Autonomous SRE (Site Reliability Engineer) inside a mission-critical Incident War Room.
An outage occurred with stack trace:
TypeError: Cannot read properties of undefined (reading 'split') at authController.js:42:47

The user asked: "${query || "generate hotfix patch"}"

Analyze the error and respond in JSON with:
{
  "explanation": "concise 2-sentence root cause explanation",
  "failingFile": "src/controllers/authController.js",
  "diff": "unified git diff showing the fix with - and +",
  "action": "deploy_ready"
}`;

    const completion = await client.chat.completions.create({
      model: OPENROUTER_MODELS[0],
      messages: [{ role: "user", content: prompt }],
      extra_body: {
        models: OPENROUTER_MODELS,
      },
    });

    const replyText = completion.choices?.[0]?.message?.content || "";
    try {
      const jsonStart = replyText.indexOf("{");
      const jsonEnd = replyText.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const parsed = JSON.parse(replyText.substring(jsonStart, jsonEnd + 1));
        return res.json(parsed);
      }
    } catch (parseErr) {
      // Return fallback if parse fails
    }
    return res.json(fallbackPatch);
  } catch (err) {
    console.warn("OpenRouter API notice, using fallback patch:", err.message);
    return res.json(fallbackPatch);
  }
});

// 4. Hotfix Deployment Simulator
app.post("/api/sre/deploy", (req, res) => {
  const { incidentId } = req.body;
  res.json({
    success: true,
    incidentId: incidentId || "INC-409",
    healthStatus: "200 OK",
    mttr: "2m 14s",
    message: "Hotfix deployed to Canary cluster. Error rate dropped to 0.00%.",
    deployedAt: Date.now(),
  });
});

// 5. Automated Post-Mortem Report Generator
app.post("/api/sre/postmortem", (req, res) => {
  const { incidentId } = req.body;
  const report = `# 📋 Post-Mortem Incident Report: ${incidentId || "INC-409"}

**Incident Title**: Auth Service 500 Spike & Connection Pool Exhaustion  
**Severity**: SEV-1 (Critical)  
**Duration / MTTR**: 2 minutes, 14 seconds  
**Status**: RESOLVED ✅  

---

### 1. Executive Summary
At 02:14 UTC, a sudden spike in HTTP 500 errors was detected in the \`auth-service\`. An automated incident war room was provisioned via CometChat MCP. Responders connected via emergency WebRTC voice huddle, diagnosed the unhandled authorization token header parsing bug using the AI SRE copilot, and deployed an automated hotfix patch in 2 minutes.

### 2. Root Cause Analysis
Recent commit \`9a4f21e\` did not include defensive checks on incoming requests lacking an \`Authorization\` header. Uncaught TypeErrors crashed worker threads and blocked database connection recycling.

### 3. Timeline
- **02:14:01**: Automated Datadog alert detected error threshold (>5% failure rate).
- **02:14:03**: CometChat MCP spawned room \`#inc-409-auth-outage\` & invited on-call responders.
- **02:14:15**: Primary responder Alex and SRE Lead Sarah joined the war room.
- **02:14:22**: Emergency WebRTC audio triage huddle initiated.
- **02:14:30**: AI SRE proposed verified Git patch card.
- **02:14:38**: Hotfix approved and deployed. Health check restored to 200 OK.

### 4. Preventative Action Items
1. Add strict contract testing for missing header payloads in CI/CD pipeline (*Owner: Alex*).
2. Configure automatic Canary rollbacks on error rate surge (*Owner: Sarah*).`;

  res.json({ markdown: report });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ OpsPulse Backend running at http://localhost:${PORT}`);
});
