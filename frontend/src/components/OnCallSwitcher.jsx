import React from "react";
import { UserCheck, ShieldCheck } from "lucide-react";

export default function OnCallSwitcher({ currentResponder, onSwitch }) {
  const responders = [
    {
      uid: "alex_oncall",
      name: "Alex",
      role: "On-Call Engineer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
    },
    {
      uid: "sarah_lead",
      name: "Sarah",
      role: "SRE Lead",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "20px",
        padding: "3px 6px",
      }}
    >
      <span style={{ fontSize: "11px", color: "var(--text-dim)", marginLeft: "4px" }}>
        Active:
      </span>
      {responders.map((resp) => {
        const isActive = currentResponder?.uid === resp.uid;
        return (
          <button
            key={resp.uid}
            type="button"
            id={`btn-switcher-${resp.uid}`}
            onClick={() => onSwitch(resp.uid)}
            className="btn-action"
            aria-label={`Switch active responder to ${resp.name} (${resp.role})`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "16px",
              background: isActive ? "var(--accent-primary)" : "transparent",
              border: "none",
              color: isActive ? "#FFFFFF" : "var(--text-muted)",
              fontSize: "12px",
              fontWeight: isActive ? 600 : 500,
              cursor: "pointer",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--status-online)",
              }}
            />
            <span>{resp.name}</span>
          </button>
        );
      })}
    </div>
  );
}
