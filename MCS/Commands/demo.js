/**
 * ══════════════════════════════════
 * 👑 BADOL-BOT-V5 ULTIMATE ECOSYSTEM
 * 🚀 ARCHITECTURE: FULL-COMPATIBLE HARDCODED MASTER COMPONENT
 * 👤 CREATOR: MOHAMMAD BADOL [AUTHOR LOCK SECURED]
 * ═══════════════════════════════════
 */

module.exports.config = {
    name: "example",
    aliases: ["ex", "demo"],
    version: "2.0.0",
    credit: "MOHAMMAD BADOL",
    role: 0,
    prefix: true,
    cooldown: 5,
    description: "Ultimate optimized multi-purpose component structure",
    category: "utility"
};

// ━━ [ ⏳ LIFECYCLE: INITIALIZATION ] ━━━━━━━━━━━━━━━━━━━━━━━━━━
module.exports.onLoad = async function ({ api }) {
    console.log("» [BADOL-BOT] Engine core synchronization successful.");
};

// ━━ [ 🚀 CORE: EXECUTIVE COMMAND ] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
module.exports.onStart = async function (api, event, args) {
    try {
        const { threadID, messageID, senderID } = event;
        const input = args.join(" ");

        if (!input) {
            return api.sendMessage("⚡ Please provide validation text after the execution handle.", threadID, messageID);
        }

        return api.sendMessage(`✨ Runtime Response -> User: ${senderID}\n📝 Data: ${input}`, threadID, messageID);
    } catch (error) {
        return api.sendMessage(`❌ [ENGINE SYSTEM ERROR]: ${error.message}`, event.threadID);
    }
};

// ━━ [ 🔔 EVENT: DETECTOR HANDLER ] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
module.exports.onEvent = async function (api, event) {
    try {
        const { threadID, logMessageType } = event;

        if (logMessageType === "log:subscribe") {
            return api.sendMessage("⚡ System Alert: New participant authorized and synced inside thread environment.", threadID);
        }
        if (logMessageType === "log:unsubscribe") {
            return api.sendMessage("⚡ System Alert: Participant session terminated from the group context.", threadID);
        }
    } catch (error) {
        console.error("Event Runtime Failure:", error);
    }
};

// ━━ [ 💬 ROUTER: INTERACTION CHAT ] ━━━━━━━━━━━━━━━━━━━━━━━━━━━
module.exports.onChat = async function (api, event) {
    try {
        const { threadID, messageID, body } = event;

        if (body && body.toLowerCase() === "ping") {
            return api.sendMessage("⚡ Pong! System channel active.", threadID, messageID);
        }
    } catch (error) {
        console.error("Chat Router Error:", error);
    }
};

// ━━ [ 🔄 INTERACT: RESPONSE TRACKER ] ━━━━━━━━━━━━━━━━━━━━━━━━━
module.exports.onReply = async function (api, event, cache) {
    try {
        const { threadID, messageID, body } = event;
        return api.sendMessage(`🔄 Session Data Logged: "${body}"`, threadID, messageID);
    } catch (error) {
        console.error("Reply Stream Error:", error);
    }
};

// ━━ [ ❤️ REACTOR: EMOTION SYNCER ] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
module.exports.onReaction = async function (api, event) {
    try {
        const { threadID, messageID, reaction } = event;
        return api.sendMessage(`🎭 Reaction Hook Captured: ${reaction}`, threadID, messageID);
    } catch (error) {
        console.error("Reaction Sync Error:", error);
    }
};


