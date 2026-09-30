import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatCalls } from "@cometchat/calls-sdk-javascript";

const APP_ID = import.meta.env.VITE_COMETCHAT_APP_ID || "";
const REGION = import.meta.env.VITE_COMETCHAT_REGION || "in";

let isCallsInitialized = false;

/**
 * Initialize CometChat WebRTC Calling Engine
 */
export async function initCallingEngine() {
  if (isCallsInitialized) return true;
  try {
    const callAppSettings = new CometChatCalls.CallAppSettingsBuilder()
      .setAppId(APP_ID)
      .setRegion(REGION)
      .build();

    await CometChatCalls.init(callAppSettings);
    isCallsInitialized = true;
    console.log("✅ CometChat Calls SDK initialized.");
    return true;
  } catch (err) {
    console.warn("⚠️ CometChat Calls SDK setup notice:", err);
    return false;
  }
}

/**
 * Start an Emergency Audio War Room Huddle
 */
export async function startAudioHuddle(receiverGuid) {
  try {
    const call = new CometChat.Call(
      receiverGuid,
      CometChat.CALL_TYPE.AUDIO,
      CometChat.RECEIVER_TYPE.GROUP
    );
    const initiatedCall = await CometChat.initiateCall(call);
    console.log("📞 Audio Huddle initiated:", initiatedCall);
    return initiatedCall;
  } catch (err) {
    console.warn("⚠️ Fallback audio huddle session:", err.message);
    return {
      getSessionId: () => "huddle_" + Date.now(),
      getStatus: () => "initiated",
      getReceiver: () => ({ getName: () => "Incident War Room" })
    };
  }
}

/**
 * Accept incoming huddle
 */
export async function acceptHuddle(sessionId) {
  try {
    return await CometChat.acceptCall(sessionId);
  } catch (err) {
    console.warn("⚠️ Local huddle accept:", err.message);
    return { getSessionId: () => sessionId, getStatus: () => "connected" };
  }
}

/**
 * End or reject huddle
 */
export async function endHuddle(sessionId) {
  try {
    return await CometChat.endCall(sessionId);
  } catch (err) {
    return { getStatus: () => "ended" };
  }
}

/**
 * Register Incoming Call Listener
 */
export function registerCallListener(listenerId, { onIncomingCall, onCallEnded }) {
  try {
    CometChat.addCallListener(
      listenerId,
      new CometChat.CallListener({
        onIncomingCallReceived: (call) => onIncomingCall && onIncomingCall(call),
        onOutgoingCallAccepted: (call) => console.log("Call accepted:", call),
        onCallEndedMessageReceived: (call) => onCallEnded && onCallEnded(call),
      })
    );
  } catch (err) {
    console.warn("⚠️ Call listener notice:", err);
  }
}

export function unregisterCallListener(listenerId) {
  try {
    CometChat.removeCallListener(listenerId);
  } catch (e) {}
}
