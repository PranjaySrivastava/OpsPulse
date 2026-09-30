import React, { useState } from "react";
import { Send, Sparkles, Terminal, Activity, FileText } from "lucide-react";

export default function ChatInput({ onSendMessage, onTriggerPrompt, onTyping }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    if (onTyping) onTyping();
  };

  const quickChips = [
    { label: "@SRE generate hotfix", icon: Sparkles, color: "var(--accent-purple)" },
    { label: "/postmortem", icon: FileText, color: "var(--accent-cyan)" },
    { label: "/rollback commit", icon: Terminal, color: "var(--sev2-amber)" },
    { label: "/health check", icon: Activity, color: "var(--status-online)" },
  ];

  return (
    <div
      style={{
        padding: "12px 20px 16px",
        background: "var(--bg-sidebar)",
        borderTop: "1px solid var(--border-subtle)",
        flexShrink: 0,
      }}
    >
      {/* Quick Prompt Chips */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "10px",
          overflowX: "auto",
          paddingBottom: "4px",
        }}
      >
        <span style={{ fontSize: "11px", color: "var(--text-dim)", whiteSpace: "nowrap" }}>
          Quick Triage:
        </span>
        {quickChips.map((chip, i) => {
          const Icon = chip.icon;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onTriggerPrompt(chip.label)}
              className="btn-action"
              aria-label={`Insert command ${chip.label}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                borderRadius: "14px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-muted)",
                fontSize: "12px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <Icon size={13} color={chip.color} aria-hidden="true" />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          id="chat-message-input"
          name="message"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type message, @SRE hotfix, or /postmortem…"
          autoComplete="off"
          spellCheck="false"
          aria-label="Type message or command for the incident war room"
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: "8px",
            background: "var(--bg-input)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-main)",
            fontSize: "14px",
            outline: "none",
          }}
        />

        <button
          type="submit"
          className="btn-action"
          aria-label="Send message to incident war room"
          disabled={!text.trim()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 18px",
            borderRadius: "8px",
            background: text.trim() ? "var(--accent-primary)" : "rgba(255, 255, 255, 0.05)",
            border: "none",
            color: text.trim() ? "#FFFFFF" : "var(--text-dim)",
            cursor: text.trim() ? "pointer" : "not-allowed",
          }}
        >
          <Send size={16} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
