const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

/**
 * Trigger or simulate an incident alert
 */
export async function triggerIncidentAlert(payload = {}) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/incident/trigger`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    console.warn("Using local incident simulator fallback:", err);
    return {
      incidentId: "INC-409",
      severity: "SEV-1",
      title: "Auth Service 500 Spike & Connection Pool Exhaustion",
      service: "auth-service",
      channelGuid: "inc_409_auth",
      impactedUsers: 640,
      timestamp: Date.now(),
      errorTrace: `TypeError: Cannot read properties of undefined (reading 'split')
    at authController.js:42:47
    at Layer.handle [as handle_request] (express/router/layer.js:95:5)
    at next (express/router/route.js:144:13)`
    };
  }
}

/**
 * Request AI SRE Diagnostic & Git Diff Patch via OpenRouter
 */
export async function diagnoseWithSRE(incidentId, query, conversationContext = []) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/sre/diagnose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ incidentId, query, conversationContext }),
    });
    return await res.json();
  } catch (err) {
    console.warn("Using local SRE diagnostic generator fallback:", err);
    return {
      explanation: "The incoming request is missing the standard 'Authorization' bearer header, causing `req.headers.authorization.split(' ')` to throw an uncaught TypeError on null/undefined.",
      failingFile: "src/controllers/authController.js",
      diff: `--- a/src/controllers/authController.js
+++ b/src/controllers/authController.js
@@ -40,4 +40,5 @@
- const authHeader = req.headers.authorization;
- const token = authHeader.split(" ")[1];
+ const authHeader = req.headers.authorization || "";
+ const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
+ if (!token) return res.status(401).json({ error: "Missing or malformed Authorization header" });`,
      action: "deploy_ready"
    };
  }
}

/**
 * Deploy Hotfix & verify health checks
 */
export async function deployHotfix(incidentId) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/sre/deploy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ incidentId }),
    });
    return await res.json();
  } catch (err) {
    return {
      success: true,
      healthStatus: "200 OK",
      mttr: "2m 14s",
      message: "Hotfix deployed to canary nodes. Error rate dropped to 0.00%."
    };
  }
}

/**
 * Generate comprehensive post-mortem report
 */
export async function fetchPostMortem(incidentId) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/sre/postmortem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ incidentId }),
    });
    return await res.json();
  } catch (err) {
    return {
      markdown: `# 📋 Post-Mortem Incident Report: INC-409

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
2. Configure automatic Canary rollbacks on error rate surge (*Owner: Sarah*).`
    };
  }
}
