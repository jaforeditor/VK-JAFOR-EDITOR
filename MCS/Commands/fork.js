const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "fork",
    aliases: ["botlink", "source", "botinfo", "setup", "guide"],
    version: "5.3.0",
    credit: "MOHAMMAD BADOL",
    role: 0,
    cooldown: 10,
    prefix: true,
    description: "BADOL-BOT-V5 এর সব ফিউচার, ফোর্ক গাইড ও সেটআপ ইনফরমেশন"
};

module.exports.onStart = async function (api, event, args) {
    const { threadID, messageID } = event;
    
    // config লোড
    let config;
    try {
        config = require("../../config.json");
    } catch (e) {
        config = {
            BOT_INFO: { PREFIX: "/" },
            OWNER_LOCK: { NAME: "MOHAMMAD BADOL", ID: "1086955587" }
        };
    }

    // আপটাইম ক্যালকুলেশন
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeStr = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    // কমান্ড/ইভেন্ট কাউন্ট
    const cmdCount = global.commands ? global.commands.size : 0;
    const evtCount = global.events ? global.events.size : 0;
    const botID = api.getCurrentUserID();
    const prefix = config.BOT_INFO.PREFIX;
    const ownerName = config.OWNER_LOCK.NAME;

    // গুগল ড্রাইভ ইমেজ
    const imgUrl = "https://docs.google.com/uc?export=download&id=1GiiKWEMys62UOHz3PW-yjmBYg7jCccL4";
    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, `fork_${Date.now()}.jpg`);

    const replyMsg = 
`╭━━━━━━━━━━━━━━━━━━━━━━━╮
 🌟 BADOL-BOT V5 [ULTIMATE] 🌟 ╰━━━━━━━━━━━━━━━━━━━━━━━╯

👋 এটি একটি সম্পূর্ণ ওপেন সোর্স Messenger বট!
নিচের গাইড ফলো করে 5 মিনিটে আপনার বট রান করুন।

╔══════════════════╗
║ 📦 𝐆𝐢𝐭𝐇𝐮𝐛 𝐑𝐞𝐩𝐨𝐬𝐢𝐭𝐨𝐫𝐲
╚══════════════════╝
🔗 https://github.com/badolvai007/BADOL-BOT-V5

╔═══════════════════╗
║ 🛠️ 𝐒𝐄𝐓𝐔𝐏 𝐑𝐄𝐐𝐔𝐈𝐑𝐄𝐌𝐄𝐍𝐓𝐒
╚═══════════════════╝
 ├─ 📦 Node.js v16+ [nodejs.org]
 ├─ 🔑 BADOL-Appstate.json [FB Cookies]
 │   └─ c3c-fbstate টুল দিয়ে বের করবেন
 ├─ ⚙️ config.json [Owner ID, Prefix]
 ├─ 📱 Facebook Account [2FA বন্ধ রাখুন]
 └─ 💻 VPS/PC/Termux [24/7 চালানোর জন্য]

╔═════════════════════╗
║ 🚀 𝐇𝐎𝐖 𝐓𝐎 𝐑𝐔𝐍 [স্টেপ বাই স্টেপ]
╚═════════════════════╝
 1️⃣ git clone https://github.com/badolvai007/BADOL-BOT-V5.git
 2️⃣ cd BADOL-BOT-V5
 3️⃣ npm install
 4️⃣ BADOL-Appstate.json ফাইল রুটে রাখুন
 5️⃣ config.json এ OWNER_LOCK.ID চেঞ্জ করুন
 6️⃣ npm start

╔════════════════════╗
║ ✨ 𝐀𝐋𝐋 𝐒𝐘𝐒𝐓𝐄𝐌 𝐅𝐄𝐀𝐓𝐔𝐑𝐄𝐒
╚════════════════════╝
 🧠 Smart Suggestion - ভুল কমান্ডে অটো সাজেস্ট
 🛡️ Owner Lock System - ID/NAME চেক করে
 🚫 Remote Ban System - GitHub JSON দিয়ে ব্যান
 👥 Auto-Approval - নতুন গ্রুপ অটো Pending
 ♻️ Command/Event Hot Reload
 💬 onChat/onReply/onReaction সাপোর্ট
 🔄 Auto Restart System
 📊 Live Uptime & Stats Monitor
 🗂️ Message Cache System [5 min]
 🔐 Anti-Tamper Security - Credit চেক
 ⏰ Cooldown System - স্প্যাম ব্লক
 🎭 Role System - Admin/User পারমিশন
 📢 Auto Notice - বট অন হলে Owner কে মেসেজ
 🖼️ Auto Banner - স্টার্টআপে ASCII আর্ট
 🔔 Log System - সব চ্যাট/এরর লগ
 📥 Memory System - Thread ডাটা লোড

╔══════════════════╗
║ 📁 𝐅𝐎𝐋𝐃𝐄𝐑 𝐒𝐓𝐑𝐔𝐂𝐓𝐔𝐑𝐄
╚══════════════════╝
 ├─ index.js - মেইন এন্ট্রি [Login]
 ├─ BADOL-Main/badol.js - Core Handler
 ├─ BADOL-Main/logger.js - Logger System
 ├─ MCS/Commands/ - সব কমান্ড [.js]
 ├─ MCS/Events/ - সব ইভেন্ট [.js]
 ├─ config.json - বট কনফিগ
 ├─ BADOL-Appstate.json - FB কুকি
 └─ notices.js - সব মেসেজ টেমপ্লেট

╔═════════════════╗
║ 📊 𝐋𝐈𝐕𝐄 𝐁𝐎𝐓 𝐒𝐓𝐀𝐓𝐔𝐒
╚═════════════════╝
 ⏰ Uptime   : ${uptimeStr}
 📦 Commands : ${cmdCount} Loaded
 📡 Events   : ${evtCount} Loaded
 🆔 Bot UID  : ${botID}
 🔣 Prefix   : ${prefix}
 👑 Owner    : ${ownerName}

━━━━━━━━━━━━━━━━━━━━━━━
💡 টিপস: ${prefix}help লিখে সব কমান্ড দেখুন
⚠️ সতর্কতা: Appstate কারো সাথে শেয়ার করবেন না!
👑 Developed By: MOHAMMAD BADOL`;

    try {
        // ক্যাশ ফোল্ডার চেক
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        // ইমেজ ডাউনলোড
        const response = await axios({
            method: "GET",
            url: imgUrl,
            responseType: "stream",
            timeout: 15000,
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const writer = fs.createWriteStream(imgPath);
        response.data.pipe(writer);

        writer.on("finish", async () => {
            try {
                await api.sendMessage({
                    body: replyMsg,
                    attachment: fs.createReadStream(imgPath)
                }, threadID, () => {
                    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
                }, messageID);
            } catch (e) {
                api.sendMessage(replyMsg, threadID, messageID);
                if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
            }
        });

        writer.on("error", () => {
            api.sendMessage(replyMsg, threadID, messageID);
        });

    } catch (e) {
        console.error("[FORK CMD ERROR]", e.message);
        return api.sendMessage(replyMsg, threadID, messageID);
    }
};
