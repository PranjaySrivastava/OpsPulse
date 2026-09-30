import React, { useState, useEffect } from "react";
import IncidentHeader from "./components/IncidentHeader";
import WarRoomStream from "./components/WarRoomStream";
import ChatInput from "./components/ChatInput";
import OnCallSwitcher from "./components/OnCallSwitcher";
import EmergencyHuddleModal from "./components/EmergencyHuddleModal";
import PostMortemModal from "./components/PostMortemModal";
import {
  initCometChat,
  loginResponder,
  sendWarRoomMessage,
  ensureIncidentGroup,
  registerMessageListener,
  unregisterMessageListener,
  startTyping,
  endTyping,
} from "./services/cometchatService";
import {
  initCallingEngine,
  startAudioHuddle,
  acceptHuddle,
  endHuddle,
  registerCallListener,
  unregisterCallListener,
} from "./services/callingService";
import {
  triggerIncidentAlert,
  diagnoseWithSRE,
  deployHotfix,
  fetchPostMortem,
} from "./services/sreService";
import { Shield, Users, Terminal, Activity, Bell } from "lucide-react";
import "./styles/theme.css";

const INCIDENT_GUID = "inc_409_auth";

export default function App() {
  const [currentResponder, setCurrentResponder] = useState({
    uid: "alex_oncall",
    name: "Alex",
    role: "On-Call Engineer",
  });

  const [incident, setIncident] = useState({
    incidentId: "INC-409",
    severity: "SEV-1",
    title: "Auth Service 500 Outage & Pool Exhaustion",
    service: "auth-service",
    status: "INVESTIGATING",
    channelGuid: INCIDENT_GUID,
  });

  const [messages, setMessages] = useState([
    {
      id: "alert_01",
      type: "alert",
      title: "🚨 SEV-1 CRITICAL: Service Failure Alert",
      time: "02:14:01 UTC",
      text: "Datadog Alert #892: Error rate spiked above 12% on auth-service. 640 requests/min failing with HTTP 500. Auto-provisioned Incident War Room via CometChat MCP.",
      trace: `TypeError: Cannot read properties of undefined (reading 'split')
    at authController.js:42:47
    at Layer.handle [as handle_request] (express/router/layer.js:95:5)
    at next (express/router/route.js:144:13)`,
    },
    {
      id: "msg_alex_01",
      type: "human",
      senderUid: "alex_oncall",
      senderName: "Alex (On-Call)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
      time: "02:14:15",
      text: "I'm in the war room. It looks like commit 9a4f21e from 10 mins ago broke the auth token parser.",
    },
    {
      id: "msg_sarah_01",
      type: "human",
      senderUid: "sarah_lead",
      senderName: "Sarah (SRE Lead)",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80",
      time: "02:14:22",
      text: "Joined. Let's start an emergency audio huddle right now so we don't waste time typing.",
    },
  ]);

  const [typingUser, setTypingUser] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [postMortemReport, setPostMortemReport] = useState(null);

  // Initialize CometChat and Calling SDK on startup
  useEffect(() => {
    async function setupSDKs() {
      await initCometChat();
      await loginResponder(currentResponder.uid);
      await initCallingEngine();
    }
    setupSDKs();

    // Register Call & Message Listeners
    registerCallListener("WAR_ROOM_CALLS", {
      onIncomingCall: (call) => setIncomingCall(call),
      onCallEnded: () => {
        setIncomingCall(null);
        setActiveCall(null);
      },
    });

    return () => {
      unregisterCallListener("WAR_ROOM_CALLS");
    };
  }, []);

  // Handle Responder Switcher
  const handleSwitchResponder = async (uid) => {
    const isAlex = uid === "alex_oncall";
    const newResponder = {
      uid,
      name: isAlex ? "Alex" : "Sarah",
      role: isAlex ? "On-Call Engineer" : "SRE Lead",
    };
    setCurrentResponder(newResponder);
    await loginResponder(uid);
  };

  // Send Message & trigger AI SRE if requested
  const handleSendMessage = async (text) => {
    const newMsg = {
      id: "msg_" + Date.now(),
      type: "human",
      senderUid: currentResponder.uid,
      senderName: currentResponder.name,
      avatar:
        currentResponder.uid === "alex_oncall"
          ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text,
    };

    setMessages((prev) => [...prev, newMsg]);
    sendWarRoomMessage(INCIDENT_GUID, text);

    // AI SRE Detection
    if (text.toLowerCase().includes("@sre") || text.toLowerCase().includes("hotfix")) {
      setTypingUser("AI SRE Agent (OpenRouter)");
      const diagnosis = await diagnoseWithSRE(incident.incidentId, text, messages);
      setTypingUser(null);

      const patchCardMsg = {
        id: "patch_" + Date.now(),
        type: "git-patch",
        patchData: diagnosis,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, patchCardMsg]);
    } else if (text.toLowerCase().includes("/postmortem")) {
      handleTriggerPostMortem();
    }
  };

  // Trigger SRE Quick Prompt Chip
  const handleTriggerPrompt = (prompt) => {
    handleSendMessage(prompt);
  };

  // Simulate Incoming Incident Alert
  const handleSimulateAlert = async () => {
    const res = await triggerIncidentAlert();
    const alertMsg = {
      id: "alert_" + Date.now(),
      type: "alert",
      title: "🚨 SIMULATED INCOMING P1 ALERT",
      time: new Date().toLocaleTimeString(),
      text: res.errorTrace || "Database connection pool saturated (>95% threshold).",
      trace: res.errorTrace,
    };
    setMessages((prev) => [...prev, alertMsg]);
  };

  // Start Emergency Audio War Room Huddle
  const handleStartHuddle = async () => {
    if (activeCall) return;
    const call = await startAudioHuddle(INCIDENT_GUID);
    setActiveCall(call);

    // Broadcast notice to room
    setMessages((prev) => [
      ...prev,
      {
        id: "sys_call_" + Date.now(),
        type: "system",
        text: `${currentResponder.name} initiated Emergency Audio War Room Huddle.`,
      },
    ]);
  };

  // Accept Incoming Huddle
  const handleAcceptHuddle = async () => {
    if (incomingCall) {
      await acceptHuddle(incomingCall.getSessionId());
      setActiveCall(incomingCall);
      setIncomingCall(null);
    }
  };

  // Decline Huddle
  const handleDeclineHuddle = async () => {
    if (incomingCall) {
      await endHuddle(incomingCall.getSessionId());
      setIncomingCall(null);
    }
  };

  // End Active Huddle
  const handleEndCall = async () => {
    if (activeCall) {
      await endHuddle(activeCall.getSessionId());
      setActiveCall(null);
      setMessages((prev) => [
        ...prev,
        {
          id: "sys_call_end_" + Date.now(),
          type: "system",
          text: `Emergency Audio War Room Huddle ended.`,
        },
      ]);
    }
  };

  // Deploy Success Callback from GitPatchCard
  const handleDeploySuccess = async () => {
    const deployRes = await deployHotfix(incident.incidentId);
    setIncident((prev) => ({ ...prev, status: "RESOLVED" }));
    setMessages((prev) => [
      ...prev,
      {
        id: "deploy_res_" + Date.now(),
        type: "system",
        text: `✅ ${deployRes.message || "Hotfix deployed to Canary. Health check: 200 OK. MTTR: 2m 14s."}`,
      },
    ]);
  };

  // Post-Mortem Report Viewer
  const handleTriggerPostMortem = async () => {
    const report = await fetchPostMortem(incident.incidentId);
    setPostMortemReport(report.markdown);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "var(--bg-app)",
        overflow: "hidden",
      }}
    >
      {/* Top Navbar */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 20px",
          background: "#080B10",
          borderBottom: "1px solid var(--border-subtle)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Shield size={20} color="var(--accent-primary)" aria-hidden="true" />
          <span style={{ fontWeight: 700, fontSize: "15px", letterSpacing: "-0.01em" }}>
            OpsPulse
          </span>
          <span
            style={{
              fontSize: "11px",
              padding: "2px 6px",
              borderRadius: "4px",
              background: "rgba(99, 102, 241, 0.15)",
              color: "var(--accent-primary)",
              fontWeight: 600,
            }}
          >
            ZeroToChat
          </span>
        </div>

        {/* Fast Responder Switcher */}
        <OnCallSwitcher currentResponder={currentResponder} onSwitch={handleSwitchResponder} />
      </nav>

      {/* Incident Header */}
      <IncidentHeader
        incident={incident}
        onStartHuddle={handleStartHuddle}
        onSimulateAlert={handleSimulateAlert}
        isCallActive={!!activeCall}
      />

      {/* Main War Room Message Stream */}
      <WarRoomStream
        messages={messages}
        typingUser={typingUser}
        currentUid={currentResponder.uid}
        onDeploySuccess={handleDeploySuccess}
      />

      {/* Chat & Prompt Input Bar */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onTriggerPrompt={handleTriggerPrompt}
        onTyping={() => {
          startTyping(INCIDENT_GUID);
          setTimeout(() => endTyping(INCIDENT_GUID), 2000);
        }}
      />

      {/* Emergency Audio Calling Overlays */}
      <EmergencyHuddleModal
        incomingCall={incomingCall}
        activeCall={activeCall}
        onAccept={handleAcceptHuddle}
        onDecline={handleDeclineHuddle}
        onEndCall={handleEndCall}
      />

      {/* Post-Mortem Report Dialog */}
      <PostMortemModal
        reportMarkdown={postMortemReport}
        onClose={() => setPostMortemReport(null)}
      />
    </div>
  );
}
