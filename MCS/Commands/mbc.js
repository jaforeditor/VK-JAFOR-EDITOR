const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const dataFile = path.join(__dirname, "B4D9L", "mbc_targets.json");
// 👇 process.cwd() ইউজ করো - এটা অলওয়েজ বটের রুট ফোল্ডার দেয়
const configPath = path.join(process.cwd(), "config.json");

if (!fs.existsSync(path.dirname(dataFile))) fs.mkdirSync(path.dirname(dataFile), { recursive: true });
if (!fs.existsSync(dataFile)) fs.writeJsonSync(dataFile, { targets: [] });

let targets = fs.readJsonSync(dataFile).targets || [];

function saveTargets() {
    fs.writeJsonSync(dataFile, { targets }, { spaces: 2 });
}

async function getRandomMsg() {
    try {
        const res = await axios.get('https://raw.githubusercontent.com/mohammadbadol/mohammadbadol/refs/heads/main/Badol-mbc.json');
        const msgs = res.data.messages || ["কিরে ভাই", "আবার আইছস", "তোরে দিয়া হইবো না"];
        return msgs[Math.floor(Math.random() * msgs.length)];
    } catch {
        return "কিরে পুত";
    }
}

module.exports = {
    config: {
        name: "mbc",
        version: "3.5.0",
        credit: "MOHAMMAD BADOL",
        role: 1,
        prefix: true,
        cooldown: 2,
        description: "Auto reply to target users",
        category: "fun",
        aliases: ["target"]
    },

    onChat: async function (api, event) {
        if (!event ||!event.body || event.senderID == api.getCurrentUserID()) return;

        const threadID = event.threadID;
        const senderID = event.senderID;
        const messageID = event.messageID;

        if (targets.includes(senderID)) {
            try {
                const userInfo = await api.getUserInfo(senderID);
                const name = userInfo[senderID]?.name || "User";
                const randMsg = await getRandomMsg();
                api.sendMessage(`${name}, ${randMsg}`, threadID, messageID);
            } catch (e) {}
        }
    },

    onStart: async function (api, event, args) {
        if (!event) return;

        const threadID = event.threadID;
        const messageID = event.messageID;
        const senderID = event.senderID;
        const messageReply = event.messageReply;
        const mentions = event.mentions || {};

        // 👇 ফিক্স: process.cwd() দিয়ে রুট থেকে নিলাম
        let config;
        try {
            config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        } catch (e) {
            return api.sendMessage("❌ config.json পড়তে সমস্যা!", threadID, messageID);
        }

        if (senderID!= config.OWNER_LOCK.ID &&!config.ADMIN_SYSTEM.ADMINS.includes(senderID)) {
            return api.sendMessage("❌ শুধু এডমিন ইউজ করতে পারবে", threadID, messageID);
        }

        const action = args[0]?.toLowerCase();
        const targetID = messageReply?.senderID || Object.keys(mentions)[0];

        if (!action) {
            return api.sendMessage(
                `╭─❏ MBC কমান্ড\n` +
                `│ /mbc add @mention - টার্গেট এড\n` +
                `│ /mbc remove @mention - টার্গেট রিমুভ\n` +
                `│ /mbc list - লিস্ট দেখো\n` +
                `╰──────────────`, threadID, messageID
            );
        }

        switch (action) {
            case 'add':
                if (!targetID) return api.sendMessage("❗ কাউকে মেনশন করো বা রিপ্লাই দাও", threadID, messageID);
                if (targets.includes(targetID)) return api.sendMessage("⚠️ অলরেডি টার্গেটে আছে", threadID, messageID);

                targets.push(targetID);
                saveTargets();
                const addInfo = await api.getUserInfo(targetID);
                const addName = addInfo[targetID]?.name || targetID;
                api.sendMessage(`✅ ${addName} কে টার্গেট করা হলো`, threadID, messageID);
                break;

            case 'remove':
                if (!targetID) return api.sendMessage("❗ কাউকে মেনশন করো বা রিপ্লাই দাও", threadID, messageID);
                if (!targets.includes(targetID)) return api.sendMessage("⚠️ এই ইউজার টার্গেটে নাই", threadID, messageID);

                targets = targets.filter(id => id!= targetID);
                saveTargets();
                const rmInfo = await api.getUserInfo(targetID);
                const rmName = rmInfo[targetID]?.name || targetID;
                api.sendMessage(`✅ ${rmName} কে টার্গেট থেকে সরানো হলো`, threadID, messageID);
                break;

            case 'list':
                if (targets.length == 0) return api.sendMessage("📋 টার্গেট লিস্ট খালি", threadID, messageID);

                let msg = `╭─❏ MBC টার্গেট লিস্ট [${targets.length}]\n`;
                for (const id of targets.slice(0, 15)) {
                    try {
                        const userInfo = await api.getUserInfo(id);
                        const name = userInfo[id]?.name || id;
                        msg += `│ • ${name}\n`;
                    } catch {
                        msg += `│ • ${id}\n`;
                    }
                }
                if (targets.length > 15) msg += `│...আরো ${targets.length - 15} জন\n`;
                msg += `╰──────────────`;
                api.sendMessage(msg, threadID, messageID);
                break;

            default:
                api.sendMessage("❌ ভুল কমান্ড! /mbc লিখে হেল্প দেখো", threadID, messageID);
        }
    }
};
