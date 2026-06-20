const axios = require("axios");

const getStream = async (url) => {
    try {
        const res = await axios.get(url, { responseType: "stream" });
        return res.data;
    } catch (e) {
        return null;
    }
};

module.exports = {
    config: {
        name: "joinNoti",
        credit: "MOHAMMAD BADOL",
        description: "Welcome Notification"
    },

    onEvent: async (api, event) => {
        if (event.logMessageType !== "log:subscribe") return;

        const { threadID, logMessageData, author } = event;
        const botID = api.getCurrentUserID();

        const botName = "BADOL-BOT";
        const ownerName = "MOHAMMAD BADOL";
        const prefix = "/";
        const imgURL = "https://drive.google.com/uc?export=download&id=11sDvR01uetgBfUiOQTLJsqkl_NevLJOL";

        const threadInfo = await api.getThreadInfo(threadID);
        const groupName = threadInfo.threadName || "Group";
        const memberCount = threadInfo.participantIDs.length;

        let adderName = "Admin";
        try {
            const adderInfo = await api.getUserInfo(author);
            adderName = adderInfo[author]?.name || "Admin";
        } catch (e) {}

        for (const user of logMessageData.addedParticipants) {
            if (user.userFbId === botID) {
                try {
                    await api.changeNickname(botName, threadID, botID);
                } catch (e) {}

                const botWelcomeMsg =
`╭────────────────────────╮
│ 🤖 𝗕𝗢𝗧 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗 🤖 │
╰────────────────────────╯

হ্যালো ${groupName}! 👋

আমি ${botName}
আমাকে এড করার জন্য ধন্যবাদ ${adderName}! ❤️

━━━━━━━━━━━━━━━━━━━━━━
📌 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢:
👥 মেম্বার: ${memberCount} জন
🤖 বট প্রিফিক্স: ${prefix}
━━━━━━━━━━━━━━━━━━━━━━

💡 𝗚𝗘𝗧 𝗦𝗧𝗔𝗥𝗧𝗘𝗗:
সব কমান্ড দেখতে টাইপ করো:
${prefix}help

━━━━━━━━━━━━━━━━━━━━━━
👑 𝗢𝗪𝗡𝗘𝗥: ${ownerName}

সবাইকে স্বাগতম! 🌸
╰────────────────────────╯`;

                return api.sendMessage({
                    body: botWelcomeMsg,
                    attachment: await getStream(imgURL)
                }, threadID);
            } else {
                const newUserName = user.fullName;
                const memberMsg =
`╔══════════════════════╗
║ 🎉 WELCOME 🎉 ║
╚══════════════════════╝

👤 𝗡𝗲𝘄 𝗠𝗲𝗺𝗯𝗲𝗿 : ${newUserName}
➕ 𝗔𝗱𝗱𝗲𝗱 𝗕𝘆 : ${adderName}
👥 𝗚𝗿𝗼𝘂𝗽 𝗡𝗮𝗺𝗲 : ${groupName}
🔢 𝗠𝗲𝗺𝗯𝗲𝗿 𝗡𝗼. : #${memberCount}

🌟 আমাদের পরিবারে আপনাকে স্বাগতম! 🌟`;

                api.sendMessage({
                    body: memberMsg,
                    attachment: await getStream(imgURL)
                }, threadID);
            }
        }
    }
};
