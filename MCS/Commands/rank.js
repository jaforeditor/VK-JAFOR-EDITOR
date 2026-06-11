/**
 * 🛠️ BADOL-BOT V5 RANKUP SYSTEM
 * 👤 AUTHOR: MOHAMMAD BADOL
 * Auto level up + /rank command
 */

const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "rankup",
    version: "3.1.0",
    role: 0,
    credit: "MOHAMMAD BADOL",
    description: "Auto level up system + rank check",
    commandCategory: "system",
    usages: "/rank [@mention/reply]",
    cooldown: 3,
    prefix: true,
    aliases: ["rank", "level", "exp"]
};

const LEVELS = [
    { exp: 0, level: 0, title: "Newbie" },
    { exp: 50, level: 1, title: "Rookie" },
    { exp: 150, level: 2, title: "Member" },
    { exp: 300, level: 3, title: "Active" },
    { exp: 500, level: 4, title: "Bronze" },
    { exp: 800, level: 5, title: "Silver" },
    { exp: 1200, level: 6, title: "Gold" },
    { exp: 1700, level: 7, title: "Platinum" },
    { exp: 2300, level: 8, title: "Diamond" },
    { exp: 3000, level: 9, title: "Master" },
    { exp: 4000, level: 10, title: "Grandmaster" },
    { exp: 5500, level: 11, title: "Legend" },
    { exp: 7500, level: 12, title: "Mythic" },
    { exp: 10000, level: 13, title: "Immortal" },
    { exp: 15000, level: 14, title: "Godlike" },
    { exp: 25000, level: 15, title: "BADOL VIP" }
];

// 🔥 পাথ ম্যানেজমেন্ট: MCS/Commands/B4D9L/rankData.json
const getRankPath = () => {
    const dataDir = path.join(__dirname, "B4D9L");
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    return path.join(dataDir, "rankData.json");
};

const loadRankData = () => {
    const rankPath = getRankPath();
    try {
        return JSON.parse(fs.readFileSync(rankPath, "utf-8"));
    } catch (e) {
        return {};
    }
};

const saveRankData = (data) => {
    const rankPath = getRankPath();
    fs.writeFileSync(rankPath, JSON.stringify(data, null, 4));
};

// 🔥 AUTO LEVEL UP - প্যারামিটার ফিক্স করা হয়েছে badol.js অনুযায়ী
module.exports.onChat = async function (api, event) {
    if (!event || !event.senderID) return;
    const { threadID, messageID, senderID, body } = event;

    if (senderID == api.getCurrentUserID()) return;
    if (!body) return;

    const rankData = loadRankData();

    if (!rankData[senderID]) {
        rankData[senderID] = {
            exp: 0,
            level: 0,
            name: "",
            msgCount: 0,
            lastUpdate: Date.now()
        };
    }

    const user = rankData[senderID];

    // EXP হিসাব লজিক
    const expGain = Math.floor(Math.random() * 11) + 5 + Math.min(Math.floor(body.length / 20), 5);
    user.exp += expGain;
    user.msgCount += 1;

    try {
        if (!user.name || user.name === "User") {
            const userInfo = await api.getUserInfo(senderID);
            user.name = userInfo[senderID]?.name || "User";
        }
    } catch (e) {}

    let newLevel = 0;
    let newTitle = "Newbie";

    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (user.exp >= LEVELS[i].exp) {
            newLevel = LEVELS[i].level;
            newTitle = LEVELS[i].title;
            break;
        }
    }

    if (newLevel > user.level) {
        user.level = newLevel;
        user.lastUpdate = Date.now();

        const nextLevelData = LEVELS[newLevel + 1];
        const nextExp = nextLevelData ? nextLevelData.exp : "MAX";

        const msg = `╔══════════════════╗\n` +
                    ` 🎉 LEVEL UP! 🎉\n` +
                    `╚══════════════════╝\n\n` +
                    `👤 **${user.name}**\n` +
                    `📊 **Level:** ${user.level} [${newTitle}]\n` +
                    `⭐ **Total EXP:** ${user.exp}\n` +
                    `💬 **Messages:** ${user.msgCount}\n` +
                    `🚀 **Next:** ${typeof nextExp === "number" ? nextExp - user.exp : "MAX LEVEL"} EXP\n\n` +
                    `━━━━━━━━━━━━━━━━━━━━`;

        api.sendMessage(msg, threadID);
    }

    saveRankData(rankData);
};

// 🔥 /rank কমান্ড - প্যারামিটার ফিক্স করা হয়েছে badol.js অনুযায়ী
module.exports.onStart = async function (api, event, args) {
    if (!event) return;
    const { threadID, messageID, senderID, messageReply, mentions } = event;

    let targetID = senderID;
    if (messageReply) targetID = messageReply.senderID;
    else if (mentions && Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0];
    else if (args[0] && !isNaN(args[0])) targetID = args[0];

    const rankData = loadRankData();
    const user = rankData[targetID];

    if (!user) {
        return api.sendMessage(
            "❌ এই ইউজারের কোনো rank data নাই!\n💬 চ্যাট করো EXP পাওয়ার জন্য।",
            threadID,
            messageID
        );
    }

    let currentTitle = "Newbie";
    let nextExp = 50;
    let currentLevelExp = 0;

    for (let i = 0; i < LEVELS.length; i++) {
        if (user.level === LEVELS[i].level) {
            currentTitle = LEVELS[i].title;
            currentLevelExp = LEVELS[i].exp;
            nextExp = LEVELS[i + 1] ? LEVELS[i + 1].exp : user.exp;
            break;
        }
    }

    const needExp = typeof nextExp === "number" ? nextExp - user.exp : 0;
    const progressExp = user.exp - currentLevelExp;
    const totalNeeded = typeof nextExp === "number" ? nextExp - currentLevelExp : progressExp;
    const progress = typeof nextExp === "number" ? Math.floor((progressExp / totalNeeded) * 20) : 20;
    const bar = "█".repeat(progress) + "░".repeat(20 - progress);

    const userRank = Object.entries(rankData)
        .sort(([, a], [, b]) => b.exp - a.exp)
        .findIndex(([id]) => id == targetID) + 1;

    const msg = `╔══════════════════╗\n` +
                ` 📊 RANK CARD 📊\n` +
                `╚══════════════════╝\n\n` +
                `👤 **Name:** ${user.name}\n` +
                `🏆 **Rank:** #${userRank} / ${Object.keys(rankData).length}\n` +
                `🎖️ **Level:** ${user.level} [${currentTitle}]\n` +
                `⭐ **EXP:** ${user.exp} / ${nextExp}\n` +
                `💬 **Messages:** ${user.msgCount}\n\n` +
                `📈 **Progress:**\n${bar} ${typeof nextExp === "number" ? Math.floor((progressExp / totalNeeded) * 100) : 100}%\n` +
                `🚀 **Need:** ${needExp} EXP to level up\n\n` +
                `━━━━━━━━━━━━━━━━━━━━`;

    return api.sendMessage(msg, threadID, messageID);
};

// 🔥 onLoad সিস্টেম (badol.js-এ অবজেক্ট আকারে পাঠানো হয়েছে)
module.exports.onLoad = function ({ api }) {
    const rankPath = getRankPath();
    if (!fs.existsSync(rankPath)) {
        fs.writeFileSync(rankPath, JSON.stringify({}, null, 4));
    }
    console.log("[RANKUP] Auto level system loaded | Path: MCS/Commands/B4D9L/rankData.json");
};

