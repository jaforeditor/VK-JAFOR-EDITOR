const fs = require("fs-extra");
const path = require("path");

const NOTICE_GROUP_ID = "3191064241091091"; 
const OWNER_NAME = "MOHAMMAD BADOL"; 

module.exports.config = {
    name: "antibotkick",
    version: "5.5.0",
    credit: "MOHAMMAD BADOL",
    description: "Advanced monitoring for bot kicks, additions, and group name changes."
};

module.exports.onEvent = async function (api, event) {
    if (!event.logMessageType) return;
    
    if (event.logMessageType !== "log:subscribe" && 
        event.logMessageType !== "log:unsubscribe" && 
        event.logMessageType !== "log:thread-name") return;

    const { threadID, logMessageType, logMessageData, author } = event;
    const botID = api.getCurrentUserID();
    const startTime = Date.now();

    if (logMessageType === "log:thread-name") {
        setTimeout(async () => {
            try {
                const userInfo = await api.getUserInfo(author);
                const changerName = userInfo[author]?.name || "Unknown User";
                const oldName = logMessageData.oldName || "No Name (Blank)";
                const newName = logMessageData.name || "No Name (Blank)";
                const latency = Date.now() - startTime;

                const msg = `╭━━━━━━━━━━━━━━━━━━━━╮
┃ 📝 𝐆𝐑𝐎𝐔𝐏 𝐍𝐀𝐌𝐄 𝐂𝐇𝐀𝐍𝐆𝐄𝐃 ┃
╰━━━━━━━━━━━━━━━━━━━━╯

📢 ${OWNER_NAME} ভাই, গ্রুপের নাম পরিবর্তন করা হয়েছে!

╔════════════════════╗
║ 📋 𝐍𝐀𝐌𝐄 𝐃𝐄𝐓𝐀𝐈𝐋𝐒
╚════════════════════╝
❌ পুরাতন নাম: ${oldName}
✅ নতুন নাম: ${newName}
🆔 TID: ${threadID}

╔════════════════════╗
║ 👤 𝐂𝐇𝐀𝐍𝐆𝐄𝐃 𝐁𝐘
╚════════════════════╝
📛 নাম: ${changerName}
🆔 UID: ${author}
🔗 প্রোফাইল: fb.com/${author}

⚡ রেসপন্স স্পিড: ${latency}ms
⏰ সময়: ${new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" })}
`;
                await api.sendMessage(msg, NOTICE_GROUP_ID);
            } catch (e) {}
        }, 1000);
        return;
    }

    if (logMessageType === "log:subscribe") {
        const botAdded = logMessageData.addedParticipants?.some(user => user.userFbId == botID);
        if (botAdded) {
            setTimeout(async () => {
                try {
                    const threadInfo = await api.getThreadInfo(threadID);
                    const userInfo = await api.getUserInfo(author);
                    const adderName = userInfo[author]?.name || "Unknown User";
                    const latency = Date.now() - startTime;
                    const isCommunity = threadInfo.isGroup && threadInfo.threadType === "COMMUNITY_THREAD" ? "Community (Sub-Group)" : "Regular Group";
                    const groupIcon = threadInfo.imageSrc || "No Icon Available";

                    const msg = `╭━━━━━━━━━━━━━━━━━━━━╮
┃ ✅ 𝐁𝐎𝐓 𝐀𝐃𝐃𝐄𝐃 𝐍𝐎𝐓𝐈𝐂𝐄 ✅ ┃
╰━━━━━━━━━━━━━━━━━━━━╯

📢 ${OWNER_NAME} ভাই, আমাকে নতুন গ্রুপে অ্যাড করা হইছে!

╔════════════════════╗
║ 📊 𝐆𝐑𝐎𝐔𝐏 𝐈𝐍𝐅𝐎
╚════════════════════╝
🏷️ নাম: ${threadInfo.threadName || "Unnamed Group"}
🆔 TID: ${threadID}
🗂️ টাইপ: ${isCommunity}
👥 মেম্বার: ${threadInfo.participantIDs.length} জন
👑 অ্যাডমিন: ${threadInfo.adminIDs.length} জন

╔════════════════════╗
║ 👤 𝐀𝐃𝐃𝐄𝐃 𝐁𝐘
╚════════════════════╝
📛 নাম: ${adderName}
🆔 UID: ${author}
🔗 প্রোফাইল: fb.com/${author}

⚡ রেসপন্স স্পিড: ${latency}ms
⏰ সময়: ${new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" })}
`;
                    await api.sendMessage(msg, NOTICE_GROUP_ID);
                } catch (e) {}
            }, 1500);
        }
    }

    if (logMessageType === "log:unsubscribe") {
        if (logMessageData.leftParticipantFbId == botID) {
            setTimeout(async () => {
                try {
                    let threadName = "Unknown Group", kickerName = "Unknown User", isCommunity = "Unknown";
                    try {
                        const threadInfo = await api.getThreadInfo(threadID);
                        threadName = threadInfo.threadName || "Unnamed Group";
                        isCommunity = threadInfo.isGroup && threadInfo.threadType === "COMMUNITY_THREAD" ? "Community (Sub-Group)" : "Regular Group";
                    } catch (e) {}
                    try {
                        const userInfo = await api.getUserInfo(author);
                        kickerName = userInfo[author]?.name || "Unknown User";
                    } catch (e) {}

                    const latency = Date.now() - startTime;
                    const msg = `╭━━━━━━━━━━━━━━━━━━━━╮
┃ ⚠️ 𝐁𝐎𝐓 𝐊𝐈𝐂𝐊𝐄𝐃 𝐀𝐋𝐄𝐑𝐓 ⚠️ ┃
╰━━━━━━━━━━━━━━━━━━━━╯

🚨 ${OWNER_NAME} ভাই, আমাকে গ্রুপ থেকে কিক করা হইছে!

╔════════════════════╗
║ 📊 𝐆𝐑𝐎𝐔𝐏 𝐈𝐍𝐅𝐎
╚════════════════════╝
🏷️ নাম: ${threadName}
🆔 TID: ${threadID}
🗂️ টাইপ: ${isCommunity}

╔════════════════════╗
║ 🔨 𝐊𝐈𝐂𝐊𝐄𝐃 𝐁𝐘
╚════════════════════╝
📛 নাম: ${kickerName}
🆔 UID: ${author}
🔗 প্রোফাইল: fb.com/${author}

⚡ রেসপন্স স্পিড: ${latency}ms
⏰ সময়: ${new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" })}

💡 ব্যান করতে চাইলে /ban ${author} লিখুন
`;
                    await api.sendMessage(msg, NOTICE_GROUP_ID);
                    const logDir = path.join(__dirname, "../../logs");
                    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
                    fs.appendFileSync(path.join(logDir, "kick_log.txt"), `[${new Date().toISOString()}] KICKED from ${threadName} (${threadID}) by ${kickerName} (${author})\n`);
                } catch (e) {}
            }, 1000);
        }
    }
};
