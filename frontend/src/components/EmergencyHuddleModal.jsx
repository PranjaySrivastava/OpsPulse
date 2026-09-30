import React, { useState } from "react";
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Users, Radio } from "lucide-react";

export default function EmergencyHuddleModal({
  incomingCall,
  activeCall,
  onAccept,
  onDecline,
  onEndCall,
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  // 1. Incoming Call Dialog
  if (incomingCall) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Incoming Emergency Audio War Room Huddle"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          overscrollBehavior: "contain",
        }}
      >
        <div
          style={{
            width: "90%",
            maxWidth: "420px",
            background: "var(--bg-sidebar)",
            border: "1px solid var(--border-active)",
            borderRadius: "14px",
            padding: "24px",
            textAlign: "center",
            boxShadow: "var(--shadow-glass), 0 0 30px rgba(99, 102, 241, 0.3)",
          }}
        >
          {/* Pulsing Radar Ring */}
          <div
            className="pulse-radar"
            style={{
              width: "72px",
              height: "72px",
              margin: "0 auto 16px",
              borderRadius: "50%",
              background: "rgba(99, 102, 241, 0.2)",
              border: "2px solid var(--accent-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)",
            }}
          >
            <Radio size={32} color="var(--accent-cyan)" aria-hidden="true" />
          </div>

          <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>
            Incoming Emergency Audio Huddle
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
            Incident War Room #inc-409 • WebRTC Audio Calling
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              type="button"
              onClick={onDecline}
              className="btn-action"
              aria-label="Decline incoming audio call"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "8px",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid var(--sev1-red)",
                color: "var(--sev1-red)",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              <PhoneOff size={16} aria-hidden="true" />
              <span>Decline</span>
            </button>

            <button
              type="button"
              onClick={onAccept}
              className="btn-action"
              aria-label="Accept incoming audio call"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 24px",
                borderRadius: "8px",
                background: "var(--status-online)",
                border: "none",
                color: "#0B0E14",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                boxShadow: "0 0 16px rgba(16, 185, 129, 0.4)",
              }}
            >
              <Phone size={16} aria-hidden="true" />
              <span>Join Huddle</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Active Call Floating Toolbar
  if (activeCall) {
    return (
      <aside
        aria-label="Active emergency audio huddle controls"
        style={{
          position: "fixed",
          bottom: "80px",
          right: "24px",
          background: "rgba(16, 21, 34, 0.95)",
          border: "1px solid var(--border-active)",
          backdropFilter: "blur(12px)",
          borderRadius: "30px",
          padding: "8px 18px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          boxShadow: "var(--shadow-glass), 0 0 20px rgba(16, 185, 129, 0.25)",
          zIndex: 900,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "var(--status-online)",
              boxShadow: "0 0 8px var(--status-online)",
            }}
          />
          <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-main)" }}>
            Audio War Room Live
          </span>
          <span style={{ fontSize: "11px", color: "var(--accent-cyan)", fontFamily: "monospace" }}>
            2 Responders
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Mute Toggle */}
          <button
            type="button"
            id="btn-mute-toggle"
            onClick={() => setIsMuted(!isMuted)}
            className="btn-action"
            aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: isMuted ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 255, 255, 0.08)",
              border: isMuted ? "1px solid var(--sev1-red)" : "1px solid var(--border-subtle)",
              color: isMuted ? "var(--sev1-red)" : "var(--text-main)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {isMuted ? <MicOff size={15} aria-hidden="true" /> : <Mic size={15} aria-hidden="true" />}
          </button>

          {/* Video Toggle */}
          <button
            type="button"
            id="btn-video-toggle"
            onClick={() => setIsVideoOn(!isVideoOn)}
            className="btn-action"
            aria-label={isVideoOn ? "Turn camera off" : "Turn camera on"}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: isVideoOn ? "rgba(99, 102, 241, 0.2)" : "rgba(255, 255, 255, 0.08)",
              border: isVideoOn ? "1px solid var(--accent-primary)" : "1px solid var(--border-subtle)",
              color: isVideoOn ? "var(--accent-cyan)" : "var(--text-main)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {isVideoOn ? <Video size={15} aria-hidden="true" /> : <VideoOff size={15} aria-hidden="true" />}
          </button>

          {/* End Call Pill */}
          <button
            type="button"
            id="btn-leave-huddle"
            onClick={onEndCall}
            className="btn-action"
            aria-label="Leave emergency audio huddle"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "20px",
              background: "var(--sev1-red)",
              border: "none",
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            <PhoneOff size={13} aria-hidden="true" />
            <span>Leave</span>
          </button>
        </div>
      </aside>
    );
  }

  return null;
}
