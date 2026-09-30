import React, { useState, useEffect } from "react";
import { AlertOctagon, PhoneCall, ShieldAlert, CheckCircle, RefreshCw, Radio } from "lucide-react";

export default function IncidentHeader({ incident, onStartHuddle, onSimulateAlert, isCallActive }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(134); // ~2m 14s

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        background: "var(--bg-sidebar)",
        borderBottom: "1px solid var(--border-subtle)",
        gap: "16px",
        flexWrap: "wrap",
        flexShrink: 0,
      }}
    >
      {/* Left: Incident Details */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
        <div
          className="pulse-sev1"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 10px",
            borderRadius: "6px",
            background: incident?.status === "RESOLVED" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.2)",
            border: incident?.status === "RESOLVED" ? "1px solid var(--status-online)" : "1px solid var(--sev1-red)",
            color: incident?.status === "RESOLVED" ? "var(--status-online)" : "var(--sev1-red)",
            fontWeight: 700,
            fontSize: "12px",
            letterSpacing: "0.05em",
            animation: incident?.status === "RESOLVED" ? "none" : "sev1Pulse 2s infinite",
          }}
        >
          {incident?.status === "RESOLVED" ? (
            <>
              <CheckCircle size={14} aria-hidden="true" /> RESOLVED
            </>
          ) : (
            <>
              <AlertOctagon size={14} aria-hidden="true" /> SEV-1 CRITICAL
            </>
          )}
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "var(--text-main)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {incident?.incidentId || "INC-409"}: {incident?.title || "Auth Service 500 Outage"}
            </h1>
            <span
              style={{
                fontSize: "11px",
                padding: "2px 6px",
                borderRadius: "4px",
                background: "rgba(255, 255, 255, 0.06)",
                color: "var(--accent-cyan)",
                fontFamily: "monospace",
              }}
            >
              #{incident?.service || "auth-service"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: "var(--text-muted)" }}>
            <span>Auto-provisioned via CometChat MCP</span>
            <span>•</span>
            <span className="tabular-nums">
              Duration: <strong>{formatTimer(elapsedSeconds)}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions (Voice Huddle & Simulation) */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          type="button"
          id="btn-simulate-alert"
          onClick={onSimulateAlert}
          className="btn-action"
          aria-label="Simulate incoming incident alert"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 12px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-main)",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          <Radio size={15} color="var(--accent-cyan)" aria-hidden="true" />
          <span>Simulate Alert</span>
        </button>

        <button
          type="button"
          id="btn-join-huddle"
          onClick={onStartHuddle}
          className="btn-action"
          aria-label={isCallActive ? "Audio War Room Active" : "Join Emergency Audio War Room"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "8px",
            background: isCallActive ? "var(--status-online)" : "var(--sev1-red)",
            border: "none",
            color: "#FFFFFF",
            fontWeight: 600,
            fontSize: "13px",
            cursor: "pointer",
            boxShadow: isCallActive ? "0 0 16px rgba(16, 185, 129, 0.4)" : "0 0 16px rgba(239, 68, 68, 0.4)",
          }}
        >
          <PhoneCall size={16} aria-hidden="true" />
          <span>{isCallActive ? "Huddle Connected (Audio)" : "Join Audio War Room"}</span>
        </button>
      </div>
    </header>
  );
}
