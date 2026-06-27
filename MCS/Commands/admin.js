const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "admin",
    aliases: ["addadmin", "adminadd", "botadmin"],
    version: "5.1",
    credit: "MOHAMMAD BADOL",
    prefix: true,
    role: 0,
    cooldown: 3,
    category: "System",
    description: "Full admin management for all bot admins"
};

const configPath = path.join(__dirname, "../../config.json");

const loadConfig = () => {
    return JSON.parse(fs.readFileSync(configPath, "utf-8"));
};

const saveConfig = (config) => {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
};

const getUserName = async (api, uid, config) => {
    try {
        const info = await api.getUserInfo(uid);
        let name = info[uid]?.name || "Unknown User";

        // Owner এর নাম config থেকে নিবে
        if (uid === config.OWNER_LOCK?.ID) {
            if (name === "Facebook user" || name === "Unknown User") {
                name = config.OWNER_LOCK?.NAME || "Bot Owner";
            }
        }

        return name;
    } catch (e) {
        // Error হলে Owner এর নাম config থেকে
        if (uid === config.OWNER_LOCK?.ID) {
            return config.OWNER_LOCK?.NAME || "Bot Owner";
        }
        return "Unknown User";
    }
};

const smartNotify = async (api, targetID, threadID, message, targetName) => {
    try {
        await api.sendMessage(message, targetID);
        return true;
    } catch (e) {
        try {
            await api.sendMessage(
                `╭━❮NOTIFICATION❯━╮\n` +
                `├‣ ⚠️ Could not DM ${targetName}\n` +
                `├‣ 💡 Ask them to message bot first\n` +
                `╰━──━─━─━━─━─━❍`,
                threadID
            );
        } catch (err) {}
        return false;
    }
};

module.exports.onStart = async function (api, event, args) {
    const { senderID, threadID, messageID, mentions, messageReply } = event;
    const config = loadConfig();
    const action = args[0]?.toLowerCase();
    const target = messageReply?.senderID || Object.keys(mentions)[0] || args[1];

    const isAdmin = config.ADMIN_SYSTEM.ADMINS.includes(senderID);
    const isOwner = senderID === config.OWNER_LOCK?.ID;

    // ═══ LIST - সবাই দেখতে পারবে ═══
    if (action === "list" || action === "all") {
        const adminList = config.ADMIN_SYSTEM.ADMINS;
        if (adminList.length === 0) {
            return api.sendMessage(
                `╭━❮BADOL-BOT-V5❯━╮\n` +
                `├‣ No admins found.\n` +
                `╰━──━─━─━━─━─━❍`,
                threadID
            );
        }

        const ownerID = config.OWNER_LOCK?.ID;
        const moderators = adminList.filter(id => id!== ownerID);

        // Owner নাম config থেকে নিবে
        const ownerName = await getUserName(api, ownerID, config);

        let msg = `╭━❮BADOL-BOT-V5❯━╮\n`;
        msg += `├‣ BOT OWNER: 👑\n`;
        msg += `├━─━─━━──━─━─━\n`;
        msg += `├‣ ${ownerName}\n`;
        msg += `├‣ ${ownerID}\n`;
        msg += `├━─━─━━──━─━─━\n`;

        if (moderators.length > 0) {
            msg += `├‣ BOT MODERATOR: ⭐\n`;
            msg += `├━─━─━━──━─━─━\n`;

            for (let i = 0; i < moderators.length; i++) {
                const uid = moderators[i];
                const name = await getUserName(api, uid, config);
                msg += `├‣ ${name}\n`;
                msg += `├‣ ${uid}\n`;
                if (i < moderators.length - 1) msg += `├━─━─━━──━─━─━\n`;
            }
        } else {
            msg += `├‣ BOT MODERATOR: ⭐\n`;
            msg += `├━─━─━━──━─━─━\n`;
            msg += `├‣ No moderators yet\n`;
        }

        msg += `╰━──━─━─━━─━─━❍`;
        return api.sendMessage(msg, threadID);
    }

    // ═══ ADD/REMOVE - শুধু এডমিনরা ═══
    if (!isAdmin) {
        return api.sendMessage(
            `╭━❮BADOL-BOT-V5❯━╮\n` +
            `├‣ ❌ Only Bot Admins can use!\n` +
            `├‣ 💡 You can use: /admin list\n` +
            `╰━──━─━─━━─━─━❍`,
            threadID
        );
    }

    if (!target) {
        return api.sendMessage(
            `╭━❮BADOL-BOT-V5❯━╮\n` +
            `├‣ ⚠️ COMMAND LIST\n` +
            `├━─━─━━──━─━─━\n` +
            `├‣ /admin list - Show all admins\n` +
            `├‣ /admin add @user - Add admin\n` +
            `├‣ /admin remove @user - Remove\n` +
            `├‣ Reply + /admin add - Add by reply\n` +
            `╰━──━─━─━━─━─━❍`,
            threadID
        );
    }

    if (action === "remove" && target === config.OWNER_LOCK?.ID) {
        return api.sendMessage(
            `╭━❮BADOL-BOT-V5❯━╮\n` +
            `├‣ ❌ Cannot remove Bot Owner!\n` +
            `├‣ 🛡️ Owner is protected\n` +
            `╰━──━─━─━━─━─━❍`,
            threadID
        );
    }

    const targetName = await getUserName(api, target, config);
    const senderName = await getUserName(api, senderID, config);

    // ═══ ADD ADMIN ═══
    if (action === "add") {
        if (config.ADMIN_SYSTEM.ADMINS.includes(target)) {
            return api.sendMessage(
                `╭━❮BADOL-BOT-V5❯━╮\n` +
                `├‣ ❌ ${targetName} already admin!\n` +
                `╰━──━─━─━━─━─━❍`,
                threadID
            );
        }

        config.ADMIN_SYSTEM.ADMINS.push(target);
        saveConfig(config);

        let nickStatus = "✅ Set";
        try {
            await api.changeNickname(`[MOD] ${targetName}`, threadID, target);
        } catch (e) {
            nickStatus = "❌ Failed";
        }

        const notifyMsg = `╭━❮BADOL-BOT-V5❯━╮\n` +
                         `├‣ 🎉 CONGRATULATIONS!\n` +
                         `├━─━─━━──━─━─━\n` +
                         `├‣ You are now Bot Moderator!\n` +
                         `├‣ Added by: ${senderName}\n` +
                         `├‣ Nickname: [MOD] ${targetName}\n` +
                         `╰━──━─━─━━─━─━❍`;

        const notifyResult = await smartNotify(api, target, threadID, notifyMsg, targetName);

        let statusMsg = `✅ Success!\n👤 ${targetName}\n🆔 ${target}\n⭐ Now Bot Moderator\n🏷️ Nickname: ${nickStatus}\n👮 Added by: ${senderName}`;
        if (!notifyResult) {
            statusMsg += `\n\n⚠️ Note: Could not DM user`;
        }

        return api.sendMessage(
            `╭━❮BADOL-BOT-V5❯━╮\n` +
            `├‣ ${statusMsg.replace(/\n/g, '\n├‣ ')}\n` +
            `╰━──━─━─━━─━─━❍`,
            threadID
        );

    // ═══ REMOVE ADMIN ═══
    } else if (action === "remove") {
        if (!config.ADMIN_SYSTEM.ADMINS.includes(target)) {
            return api.sendMessage(
                `╭━❮BADOL-BOT-V5❯━╮\n` +
                `├‣ ❌ ${targetName} is not admin!\n` +
                `╰━──━─━─━━─━─━❍`,
                threadID
            );
        }

        config.ADMIN_SYSTEM.ADMINS = config.ADMIN_SYSTEM.ADMINS.filter(id => id!== target);
        saveConfig(config);

        let nickStatus = "✅ Removed";
        try {
            await api.changeNickname("", threadID, target);
        } catch (e) {
            nickStatus = "❌ Failed";
        }

        const removeMsg = `╭━❮BADOL-BOT-V5❯━╮\n` +
                         `├‣ ⚠️ ADMIN REMOVED\n` +
                         `├━─━─━━──━─━─━\n` +
                         `├‣ Your access revoked\n` +
                         `├‣ By: ${senderName}\n` +
                         `╰━──━─━─━━─━─━❍`;

        await smartNotify(api, target, threadID, removeMsg, targetName);

        return api.sendMessage(
            `╭━❮BADOL-BOT-V5❯━╮\n` +
            `├‣ ✅ REMOVED!\n` +
            `├━─━─━━──━─━─━\n` +
            `├‣ Name: ${targetName}\n` +
            `├‣ ID: ${target}\n` +
            `├‣ Status: No longer admin\n` +
            `├‣ Nickname: ${nickStatus}\n` +
            `├‣ Removed by: ${senderName}\n` +
            `╰━──━─━─━━─━─━❍`,
            threadID
        );

    } else {
        return api.sendMessage(
            `╭━❮BADOL-BOT-V5❯━╮\n` +
            `├‣ ❌ Invalid! Use: add/remove/list\n` +
            `╰━──━─━─━━─━─━❍`,
            threadID
        );
    }
};