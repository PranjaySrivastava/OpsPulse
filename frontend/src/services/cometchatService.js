import { CometChat } from "@cometchat/chat-sdk-javascript";

const APP_ID = import.meta.env.VITE_COMETCHAT_APP_ID || "";
const REGION = import.meta.env.VITE_COMETCHAT_REGION || "in";
const AUTH_KEY = import.meta.env.VITE_COMETCHAT_AUTH_KEY || "";

let isInitialized = false;

/**
 * Initialize CometChat Chat SDK
 */
export async function initCometChat() {
  if (isInitialized) return true;

  try {
    const appSettings = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(REGION)
      .autoEstablishSocketConnection(true)
      .build();

    await CometChat.init(APP_ID, appSettings);
    isInitialized = true;
    console.log("✅ CometChat initialized successfully.");
    return true;
  } catch (err) {
    console.warn("⚠️ CometChat initialization notice (Running with local mock fallback if offline):", err);
    return false;
  }
}

/**
 * Log in a responder (Alex, Sarah, or AI Bot) with automatic user provisioning
 */
export async function loginResponder(uid, authKey = AUTH_KEY) {
  try {
    const currentUser = await CometChat.getLoggedInUser();
    if (currentUser && currentUser.getUid() === uid) {
      return currentUser;
    }
    if (currentUser) {
      await CometChat.logout();
    }

    try {
      const user = await CometChat.login(uid, authKey);
      console.log("✅ Logged in to CometChat as:", user.getName());
      return user;
    } catch (loginErr) {
      // Auto-create user if not found in CometChat Cloud
      console.log(`ℹ️ Auto-provisioning user ${uid} in CometChat...`);
      const name = uid === "alex_oncall" ? "Alex (On-Call Engineer)" : "Sarah (SRE Lead)";
      const newUser = new CometChat.User(uid);
      newUser.setName(name);
      try {
        await CometChat.createUser(newUser, authKey);
        const loggedIn = await CometChat.login(uid, authKey);
        console.log("✅ Auto-provisioned & logged in as:", loggedIn.getName());
        return loggedIn;
      } catch (createErr) {
        throw loginErr;
      }
    }
  } catch (err) {
    console.warn(`⚠️ CometChat login notice for ${uid}:`, err.message || err);
    return {
      getUid: () => uid,
      getName: () => (uid === "alex_oncall" ? "Alex (On-Call Engineer)" : "Sarah (SRE Lead)"),
      getAvatar: () => (uid === "alex_oncall" ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" : "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100"),
      getStatus: () => "online"
    };
  }
}

/**
 * Ensure incident war room group exists in CometChat Cloud
 */
export async function ensureIncidentGroup(guid, groupName = "INC-409 Auth Outage") {
  try {
    return await CometChat.getGroup(guid);
  } catch (err) {
    try {
      const group = new CometChat.Group(guid, groupName, CometChat.GROUP_TYPE.PUBLIC);
      const created = await CometChat.createGroup(group);
      console.log("✅ Auto-created Incident War Room Group:", guid);
      return created;
    } catch (createErr) {
      console.warn("Incident group notice:", createErr.message);
    }
  }
}

/**
 * Send a message to an incident war room
 */
export async function sendWarRoomMessage(guid, text) {
  try {
    const textMessage = new CometChat.TextMessage(
      guid,
      text,
      CometChat.RECEIVER_TYPE.GROUP
    );
    return await CometChat.sendMessage(textMessage);
  } catch (err) {
    console.warn("⚠️ Failed to send via CometChat socket, local mock dispatch:", err.message);
    return {
      getId: () => "msg_" + Date.now(),
      getText: () => text,
      getSentAt: () => Math.floor(Date.now() / 1000),
      getSender: () => ({
        getUid: () => "current_user",
        getName: () => "You",
      })
    };
  }
}

/**
 * Register real-time listeners for war room events
 */
export function registerMessageListener(listenerId, { onMessage, onTypingStart, onTypingEnd }) {
  try {
    CometChat.addMessageListener(
      listenerId,
      new CometChat.MessageListener({
        onTextMessageReceived: (msg) => onMessage && onMessage(msg),
        onTypingStarted: (typing) => onTypingStart && onTypingStart(typing),
        onTypingEnded: (typing) => onTypingEnd && onTypingEnd(typing),
      })
    );
  } catch (err) {
    console.warn("⚠️ Message listener setup notice:", err);
  }
}

export function unregisterMessageListener(listenerId) {
  try {
    CometChat.removeMessageListener(listenerId);
  } catch (err) {
    // Ignore cleanup error
  }
}

export function startTyping(guid) {
  try {
    const indicator = new CometChat.TypingIndicator(guid, CometChat.RECEIVER_TYPE.GROUP);
    CometChat.startTyping(indicator);
  } catch (e) {}
}

export function endTyping(guid) {
  try {
    const indicator = new CometChat.TypingIndicator(guid, CometChat.RECEIVER_TYPE.GROUP);
    CometChat.endTyping(indicator);
  } catch (e) {}
}

export { CometChat };
