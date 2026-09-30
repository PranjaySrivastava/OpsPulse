import React, { useEffect, useRef } from "react";
import GitPatchCard from "./GitPatchCard";
import { AlertTriangle, CheckCircle, Bot, User, CheckCheck } from "lucide-react";

export default function WarRoomStream({ messages, typingUser, currentUid, onDeploySuccess }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  return (
    <div
      id="message-stream"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      tabIndex={0}
      style={{
        flex: "1 1 0%",
        minHeight: 0,
        overflowY: "auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      {messages.map((msg) => {
        // 1. Initial Diagnostic Alert Card
        if (msg.type === "alert") {
          return (
            <div
              key={msg.id}
              style={{
                borderRadius: "10px",
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                padding: "16px",
                boxShadow: "0 0 20px rgba(239, 68, 68, 0.15)",
                animation: "cardEntrance 200ms ease-out",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <AlertTriangle size={18} color="var(--sev1-red)" aria-hidden="true" />
                <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--sev1-red)" }}>
                  {msg.title || "CRITICAL SERVICE FAILURE DETECTED"}
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{msg.time}</span>
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-main)", marginBottom: "10px" }}>
                {msg.text}
              </p>
              {msg.trace && (
                <pre
                  style={{
                    background: "#080B10",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#F87171",
                    overflowX: "auto",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {msg.trace}
                </pre>
              )}
            </div>
          );
        }

        // 2. Interactive Git Patch Card from AI SRE
        if (msg.type === "git-patch") {
          return (
            <GitPatchCard
              key={msg.id}
              patchData={msg.patchData}
              onDeploySuccess={onDeploySuccess}
            />
          );
        }

        // 3. System Status / Resolution Notice
        if (msg.type === "system") {
          return (
            <div
              key={msg.id}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                margin: "4px auto",
                padding: "6px 14px",
                borderRadius: "20px",
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "var(--status-online)",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              <CheckCircle size={14} aria-hidden="true" />
              <span>{msg.text}</span>
            </div>
          );
        }

        // 4. Human / Standard Chat Bubble
        const isSelf = msg.senderUid === currentUid;
        return (
          <div
            key={msg.id}
            style={{
              display: "flex",
              flexDirection: isSelf ? "row-reverse" : "row",
              alignItems: "flex-start",
              gap: "10px",
              maxWidth: "80%",
              alignSelf: isSelf ? "flex-end" : "flex-start",
              animation: "cardEntrance 150ms ease-out",
            }}
          >
            {/* Avatar */}
            <img
              src={msg.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64"}
              alt={`${msg.senderName}'s avatar`}
              width="32"
              height="32"
              style={{
                borderRadius: "50%",
                border: "1px solid var(--border-subtle)",
                flexShrink: 0,
              }}
            />

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  justifyContent: isSelf ? "flex-end" : "flex-start",
                  marginBottom: "4px",
                }}
              >
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
                  {msg.senderName}
                </span>
                <span className="tabular-nums" style={{ fontSize: "11px", color: "var(--text-dim)" }}>
                  {msg.time}
                </span>
              </div>

              {/* Message Bubble */}
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: isSelf ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: isSelf ? "var(--accent-primary)" : "var(--bg-card)",
                  border: isSelf ? "none" : "1px solid var(--border-subtle)",
                  color: "#FFFFFF",
                  fontSize: "13px",
                  lineHeight: 1.5,
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                }}
              >
                {msg.text}

                {/* Read Receipts */}
                {isSelf && (
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2px" }}>
                    <CheckCheck size={14} color="var(--accent-cyan)" aria-hidden="true" />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Typing Indicator */}
      {typingUser && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 12px",
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.03)",
            color: "var(--text-muted)",
            fontSize: "12px",
            alignSelf: "flex-start",
          }}
        >
          <span>{typingUser} is typing</span>
          <span style={{ display: "inline-flex", gap: "3px" }}>
            <span
              className="typing-dot"
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "var(--accent-cyan)",
                animation: "typingWave 1.2s infinite ease-in-out",
              }}
            />
            <span
              className="typing-dot"
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "var(--accent-cyan)",
                animation: "typingWave 1.2s infinite ease-in-out 0.2s",
              }}
            />
            <span
              className="typing-dot"
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "var(--accent-cyan)",
                animation: "typingWave 1.2s infinite ease-in-out 0.4s",
              }}
            />
          </span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
