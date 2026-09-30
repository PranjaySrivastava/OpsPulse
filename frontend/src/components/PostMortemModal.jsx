import React, { useState } from "react";
import { FileText, Copy, Check, X, Download } from "lucide-react";

export default function PostMortemModal({ reportMarkdown, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!reportMarkdown) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Post-Mortem Incident Report"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
        overscrollBehavior: "contain",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "680px",
          maxHeight: "85vh",
          background: "var(--bg-sidebar)",
          border: "1px solid var(--border-active)",
          borderRadius: "14px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "var(--shadow-glass), 0 0 32px rgba(99, 102, 241, 0.2)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-subtle)",
            background: "rgba(255, 255, 255, 0.02)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FileText size={20} color="var(--accent-cyan)" aria-hidden="true" />
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)" }}>
              Post-Mortem Incident Report: INC-409
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              id="btn-copy-postmortem"
              onClick={handleCopy}
              className="btn-action"
              aria-label="Copy markdown report to clipboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "6px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-main)",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              {copied ? <Check size={14} color="var(--status-online)" aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              <span>{copied ? "Copied!" : "Copy Markdown"}</span>
            </button>

            <button
              type="button"
              id="btn-close-postmortem"
              onClick={onClose}
              className="btn-action"
              aria-label="Close post-mortem modal"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Markdown Content Viewer */}
        <div
          style={{
            padding: "20px",
            overflowY: "auto",
            fontSize: "13px",
            lineHeight: 1.6,
            color: "var(--text-muted)",
            whiteSpace: "pre-wrap",
            fontFamily: "'JetBrains Mono', monospace",
            background: "#080B10",
          }}
        >
          {reportMarkdown}
        </div>
      </div>
    </div>
  );
}
