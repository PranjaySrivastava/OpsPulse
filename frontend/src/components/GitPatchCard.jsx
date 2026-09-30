import React, { useState } from "react";
import { GitPullRequest, CheckCircle2, RotateCcw, Sparkles, Terminal } from "lucide-react";

export default function GitPatchCard({ patchData, onDeploySuccess }) {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);

  const handleDeploy = async () => {
    setIsDeploying(true);
    // Simulate real deployment pipeline delay
    setTimeout(() => {
      setIsDeploying(false);
      setIsDeployed(true);
      if (onDeploySuccess) {
        onDeploySuccess();
      }
    }, 1200);
  };

  const renderDiffLines = (diffText) => {
    if (!diffText) return null;
    return diffText.split("\n").map((line, idx) => {
      let bg = "transparent";
      let color = "var(--text-main)";

      if (line.startsWith("+") && !line.startsWith("+++")) {
        bg = "var(--bg-diff-add)";
        color = "#34D399"; // Crisp green
      } else if (line.startsWith("-") && !line.startsWith("---")) {
        bg = "var(--bg-diff-del)";
        color = "#F87171"; // Soft red
      } else if (line.startsWith("@@")) {
        color = "var(--accent-cyan)";
      }

      return (
        <div
          key={idx}
          style={{
            padding: "2px 8px",
            backgroundColor: bg,
            color: color,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            whiteSpace: "pre-wrap",
            lineHeight: 1.5,
          }}
        >
          {line}
        </div>
      );
    });
  };

  return (
    <div
      style={{
        margin: "12px 0",
        borderRadius: "10px",
        background: "var(--bg-card)",
        border: "1px solid var(--ai-border)",
        boxShadow: "var(--shadow-glass), 0 0 24px var(--ai-glow)",
        overflow: "hidden",
        animation: "cardEntrance 200ms ease-out",
      }}
    >
      {/* Header Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          background: "linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkles size={16} color="var(--accent-purple)" aria-hidden="true" />
          <span style={{ fontWeight: 600, fontSize: "13px", color: "var(--text-main)" }}>
            Autonomous AI SRE • Verified Git Hotfix
          </span>
          <span
            style={{
              fontSize: "11px",
              padding: "1px 6px",
              borderRadius: "4px",
              background: "rgba(255, 255, 255, 0.08)",
              color: "var(--text-muted)",
              fontFamily: "monospace",
            }}
          >
            llama-3.3-70b:free
          </span>
        </div>
        <span style={{ fontSize: "11px", color: "var(--status-online)", fontWeight: 600 }}>
          Confidence: 98%
        </span>
      </div>

      {/* Explanation */}
      <div style={{ padding: "12px 14px", fontSize: "13px", color: "var(--text-muted)", borderBottom: "1px solid var(--border-subtle)" }}>
        {patchData?.explanation || "Missing defensive check on authorization header causes uncaught TypeError on unauthenticated endpoints."}
      </div>

      {/* Code Diff Display */}
      <div
        style={{
          background: "#080B10",
          padding: "8px 0",
          maxHeight: "220px",
          overflowY: "auto",
        }}
      >
        {renderDiffLines(
          patchData?.diff ||
            `--- a/src/controllers/authController.js
+++ b/src/controllers/authController.js
@@ -40,4 +40,5 @@
- const authHeader = req.headers.authorization;
- const token = authHeader.split(" ")[1];
+ const authHeader = req.headers.authorization || "";
+ const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
+ if (!token) return res.status(401).json({ error: "Missing or malformed Authorization header" });`
        )}
      </div>

      {/* Actions Dock */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          background: "rgba(0, 0, 0, 0.2)",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {isDeployed ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--status-online)",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={16} aria-hidden="true" />
              <span>Hotfix Deployed to Canary • Health 200 OK</span>
            </div>
          ) : (
            <button
              type="button"
              id="btn-deploy-hotfix"
              onClick={handleDeploy}
              disabled={isDeploying}
              className="btn-action"
              aria-label="Approve and deploy hotfix to production"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "6px",
                background: "var(--status-online)",
                border: "none",
                color: "#0B0E14",
                fontWeight: 700,
                fontSize: "13px",
                cursor: isDeploying ? "wait" : "pointer",
                opacity: isDeploying ? 0.7 : 1,
              }}
            >
              <GitPullRequest size={15} aria-hidden="true" />
              <span>{isDeploying ? "Deploying Hotfix…" : "Approve & Deploy Hotfix"}</span>
            </button>
          )}

          <button
            type="button"
            className="btn-action"
            aria-label="Rollback recent commit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
              borderRadius: "6px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-main)",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            <RotateCcw size={14} aria-hidden="true" />
            <span>Rollback Commit</span>
          </button>
        </div>

        <span style={{ fontSize: "11px", color: "var(--text-dim)", fontFamily: "monospace" }}>
          Target: Canary-Cluster-US-East
        </span>
      </div>
    </div>
  );
}
