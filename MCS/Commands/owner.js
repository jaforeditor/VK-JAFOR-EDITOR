const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "owner",
    aliases: ["dev", "developer", "info", "admin"],
    version: "5.4.0",
    role: 0,
    credit: "MOHAMMAD BADOL",
    prefix: true,
    description: "Bot Owner এর পার্সোনাল ইনফরমেশন ও কন্টাক্ট",
    category: "Info",
    usages: "[owner]",
    cooldown: 5
};

module.exports.onStart = async function (api, event, args) {
    const { threadID, messageID } = event;
    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, `owner_${threadID}.jpg`);

    // তোর পাবলিক Drive লিংক
    const fileID = "1NNsMrAbn6NfGWYGzhFvQBViZr9-UlUOt";
    const imgUrl = `https://drive.google.com/uc?export=download&id=${fileID}&confirm=t`;

    const msgBody = `╭━━━━━━━━━━━━━━━━━━━━━━━━╮
┃ 👑 𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 👑 ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━╯

╔═════════════════════╗
║ 👤 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑 𝐏𝐑𝐎𝐅𝐈𝐋𝐄
╚═════════════════════╝
 ● Name: MOHAMMAD BADOL
 ● Age: 28+ Years
 ● Home: Paikgacha, Khulna
 ● Base: Dhaka | Bangladesh
 ● Experience: 5+ Years in Programming
 ● Nickname: B4D9L00

╔═════════════════════╗
║ 💻 𝐒𝐊𝐈𝐋𝐒 & 𝐄𝐗𝐏𝐄𝐑𝐓𝐈𝐒𝐄
╚═════════════════════╝
 🚀 Full Stack Developer [Node.js/JavaScript]
 🤖 Bot Automation Specialist [FB/Telegram]
 🛡 Cyber Security & API Research
 ⚡ VPS & Server Management
 🔧 MCS System Architecture
 📱 Messenger API Expert
 🎯 Problem Solving & Debugging

╔════════════════════╗
║ 📱 𝐃𝐈𝐑𝐄𝐂𝐓 𝐂𝐎𝐍𝐓𝐀𝐂𝐓
╚════════════════════╝
 ● Facebook: m.me/B4D9L00
 ● Telegram: t.me/B4D9L_007
 ● WhatsApp: +8801782721761
 ● GitHub: github.com/badolvai007
 ● Email: badol.dev@gmail.com

╔═══════════════════╗
║ 🤖 𝐌𝐘 𝐓𝐄𝐋𝐄𝐆𝐑𝐀𝐌 𝐁𝐎𝐓𝐒
╚═══════════════════╝
 ● Personal Bot: t.me/B4D9LBOT
 ● Video Downloader: t.me/MbVideoDownloadbot

╔═══════════════════╗
║ 📢 𝐎𝐅𝐅𝐈𝐂𝐈𝐀𝐋 𝐒𝐔𝐏𝐎𝐑𝐓
╚═══════════════════╝
 🔹 MR EDITOR ZONE: t.me/mreditorzone
 🔹 MCS SUPPORT: t.me/mcssupport
 🔹 BADOL BOT GC: t.me/BADOLBOTGC
 🔹 SB MODS APK: t.me/SB_MODS_APK
 🚩 FB PAGE: fb.com/mcs.help.bot
 👥 FB GROUP: fb.com/groups/mcs.help.bot

━━━━━━━━━━━━━━━━━━━━━━
🔥 "Coding is my passion, speed is my lifestyle." 🔥
💡 Bot এর সব ফিউচার দেখতে /fork লিখুন
👑 Developed By: MOHAMMAD BADOL`;

    try {
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

        const response = await axios({
            method: "GET",
            url: imgUrl,
            responseType: "stream",
            timeout: 20000,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        });

        const writer = fs.createWriteStream(imgPath);
        response.data.pipe(writer);

        writer.on("finish", () => {
            api.sendMessage({
                body: msgBody,
                attachment: fs.createReadStream(imgPath)
            }, threadID, () => {
                if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
            }, messageID);
        });

        writer.on("error", (err) => {
            console.log("[OWNER IMG ERROR]", err.message);
            api.sendMessage(msgBody, threadID, messageID);
        });

    } catch (e) {
        console.log("[OWNER CMD ERROR]", e.message);
        api.sendMessage(msgBody, threadID, messageID);
    }
};
