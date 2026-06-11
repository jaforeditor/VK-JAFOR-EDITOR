const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

module.exports.config = {
    name: "fuck2",
    version: "4.4",
    credit: "MOHAMMAD BADOL",
    cooldown: 15,
    role: 0,
    prefix: true,
    description: "Fuck banner with mention & reply support",
    category: "fun",
    usages: "[reply/mention to message]",
    aliases: []
};

module.exports.onStart = async function (api, event, args) {
    const { threadID, messageID, senderID } = event;

    const restrictedId = 1086955587; // এই ইউজারকে কেউ ফ্রেমে বসাতে পারবে না

    let targetId;
    let targetName = "Target";
    let senderName = "User";

    // 🟢 ১. মেনশন চেক - প্রথমে
    if (Object.keys(event.mentions).length > 0) {
        targetId = Object.keys(event.mentions)[0];
    }
    // 🟢 ২. রিপ্লাই চেক - পরে
    else if (event.messageReply) {
        targetId = event.messageReply.senderID;
    }

    if (!targetId) {
        return api.sendMessage("⚠️ যাকে চু*তে চান তার মেসেজে **Reply** দিন অথবা **@mention** করুন।\n\n💡 উদাহরণ:\n/fuck2 @Rahim\nঅথবা রিপ্লাই দিয়ে /fuck2", threadID, messageID);
    }

    // নাম বের করা
    try {
        const senderInfo = await api.getUserInfo(senderID);
        const targetInfo = await api.getUserInfo(targetId);
        senderName = senderInfo[senderID]?.name || "User";
        targetName = targetInfo[targetId]?.name || "Target";
    } catch (e) {
        senderName = "User";
        targetName = "Target";
    }

    // 🛡️ আইডি সুরক্ষা চেক
    if (targetId == restrictedId && senderID!= restrictedId) {
        return api.sendMessage("❌ এই ইউজারকে ফ্রেমে বসানোর ক্ষমতা আপনার নেই! অন্য কাউকে ট্রাই করুন।", threadID, messageID);
    }

    const waitMsg = await api.sendMessage("⏳ Fuck প্রসেসিং হচ্ছে...", threadID, messageID);

    try {
        const badolDir = path.join(__dirname, "B4D9L");
        const bgPath = path.join(badolDir, "fuck2.png");

        if (!fs.existsSync(bgPath)) {
            await api.unsendMessage(waitMsg.messageID).catch(() => {});
            return api.sendMessage("❌ `B4D9L` ফোল্ডারে `fuck2.png` পাওয়া যায়নি!", threadID, messageID);
        }

        // প্রোফাইল পিক URL বের করা - HD
        const getProfilePic = async (userId) => {
            try {
                const hdUrl = `https://graph.facebook.com/${userId}/picture?width=720&height=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
                const response = await axios.get(hdUrl, { responseType: 'arraybuffer', timeout: 8000 });
                if (response.data.byteLength > 1000) return hdUrl;
            } catch (e) {}

            try {
                const userInfo = await api.getUserInfo(userId);
                if (userInfo[userId]?.profileUrl) {
                    return userInfo[userId].profileUrl + '&width=720&height=720';
                }
                if (userInfo[userId]?.thumbSrc) {
                    return userInfo[userId].thumbSrc;
                }
            } catch (e) {}

            throw new Error("Profile photo missing");
        };

        const senderLink = await getProfilePic(senderID);
        const targetLink = await getProfilePic(targetId);

        const bgImg = await loadImage(bgPath);
        const canvas = createCanvas(360, 360);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bgImg, 0, 0, 360, 360);

        // পজিশন ও সাইজ কন্ট্রোল
        const target_X = 94;
        const target_Y = 108;
        const target_Size = 42;

        const sender_X = 248;
        const sender_Y = 84;
        const sender_Size = 38;

        const drawProfile = async (url, x, y, r, borderColor) => {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            const img = await loadImage(Buffer.from(response.data));
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
            ctx.restore();

            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2, true);
            ctx.stroke();
        };

        await drawProfile(targetLink, target_X, target_Y, target_Size, "#FF0000");
        await drawProfile(senderLink, sender_X, sender_Y, sender_Size, "#FFFF00");

        const outPath = path.join(__dirname, `fuck_${senderID}.png`);
        fs.writeFileSync(outPath, canvas.toBuffer('image/png'));

        const fuckMessages = [
            "🔥 Fuck You! তোরে আজকে শেষ করে দিমু! 😈",
            "🖕 তোর গুষ্টি কিলাই, আয় এবার ফ্রেমে বস! 💀",
            "💥 তোরে তো ভালো কইরা চু*লাম, কেমন লাগলো? 🖕",
            "🥵 Fuck Done! তোর সাথে এটাই হওয়া উচিত ছিল! 🔥",
            "👺 বেশি বাড়াবাড়ি করিস না, নাহলে আবারও চু*মু! 🖕"
        ];
        const randomMsg = fuckMessages[Math.floor(Math.random() * fuckMessages.length)];

        await api.unsendMessage(waitMsg.messageID).catch(() => {});
        await api.sendMessage({
            body: `🔥 **「 FUCK SYSTEM ACTIVE 」** 🔥\n━━━━━━━━━━━━━━━━━━━━\n👤 **Fucker:** \`${senderName}\`\n👤 **Victim:** \`${targetName}\`\n━━━━━━━━━━━━━━━━━━━━\n${randomMsg}\n\n👤 **Credit:** ${this.config.credit}`,
            attachment: fs.createReadStream(outPath)
        }, threadID, messageID);

        fs.unlinkSync(outPath);

    } catch (e) {
        console.log("Error:", e.message);
        await api.unsendMessage(waitMsg.messageID).catch(() => {});
        return api.sendMessage("❌ প্রোফাইল পিকচার লোড করা সম্ভব হয়নি।", threadID, messageID);
    }
};
