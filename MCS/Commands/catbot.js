const axios = require('axios');

const baseApiUrl = async () => {
    try {
        const base = await axios.get(`https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`);
        return base.data.api;
    } catch (e) {
        return "https://api.dipto.fun";
    }
};

module.exports = {
    config: {
        name: "catbot",
        version: "6.9.9",
        credit: "MOHAMMAD BADOL",
        role: 0,
        description: "Better than all sim simi",
        prefix: true,
        aliases: ["baby", "sim"],
        cooldown: 0
    },

    onStart: async (api, event, args) => {
        const link = `${await baseApiUrl()}/baby`;
        const dipto = args.join(" ").toLowerCase();
        if (!args[0]) return api.sendMessage("Bolo baby, type 'baby help' for info.", event.threadID);
        try {
            const res = await axios.get(`${link}?text=${encodeURIComponent(dipto)}&senderID=${event.senderID}&font=1`);
            return api.sendMessage(res.data.reply, event.threadID, event.messageID);
        } catch (e) {
            api.sendMessage("Error: " + e.message, event.threadID);
        }
    },

    onChat: async (api, event) => {
        if (!event.body) return;
        const body = event.body.toLowerCase();
        const keywords = ["baby", "bby", "bot", "বট"];
        if (keywords.some(k => body.startsWith(k))) {
            const arr = body.replace(/^\S+\s*/, "");
            const link = await baseApiUrl();
            if (!arr) {
                const msgs = ["বেশি Bot Bot করলে leave নিবো কিন্তু! 😒😒", "শুনছি তো! কিন্তু এতো ডিস্টার্ব করছেন কেন? 😼", "Bolo Babu, কি দরকার বলুন? 🙈💋", "I love you janu! 🥰", "আরে বলদ, এতো ডাকিস কেন? 🤬", "আসসালামু আলাইকুম, বলুন আপনার জন্য কি করতে পারি? 🥰"];
                return api.sendMessage(msgs[Math.floor(Math.random() * msgs.length)], event.threadID, event.messageID);
            }
            try {
                const res = await axios.get(`${link}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`);
                return api.sendMessage(res.data.reply, event.threadID, event.messageID);
            } catch (e) { console.error("Catbot Error: " + e.message); }
        }
    },

    onReply: async (api, event, replyData) => {
        // গুরুত্বপুর্ণ চেক: রিপ্লাইটি বটের নিজের মেসেজের কিনা
        if (event.messageReply.senderID !== api.getCurrentUserID()) return;

        try {
            const reply = event.body.toLowerCase();
            const link = await baseApiUrl();
            const res = await axios.get(`${link}/baby?text=${encodeURIComponent(reply)}&senderID=${event.senderID}&font=1`);
            return api.sendMessage(res.data.reply, event.threadID, event.messageID);
        } catch (err) {
            api.sendMessage("Error: " + err.message, event.threadID);
        }
    }
};
