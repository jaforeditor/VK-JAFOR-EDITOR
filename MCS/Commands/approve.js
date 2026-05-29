const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "approve",
        version: "1.0.0",
        credit: "MOHAMMAD BADOL",
        role: 1,
        description: "Approve a pending thread",
        prefix: true,
        aliases: ["apv"],
        cooldown: 5
    },

    onStart: async (api, event, args) => {
        const configPath = path.join(__dirname, "../../config.json");
        let config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

        if (!config.APPROVAL_SYSTEM.PENDING_THREADS || config.APPROVAL_SYSTEM.PENDING_THREADS.length === 0) {
            return api.sendMessage("━━━━━━━━━━━━━━━━━━━━━━\n   ✅ NO PENDING REQUESTS \n━━━━━━━━━━━━━━━━━━━━━━\n\nThere are no groups currently waiting for approval.\n━━━━━━━━━━━━━━━━━━━━━━", event.threadID);
        }

        let msg = "━━━━━━━━━━━━━━━━━━━━━━\n   📋 PENDING GROUPS \n━━━━━━━━━━━━━━━━━━━━━━\n\n";
        config.APPROVAL_SYSTEM.PENDING_THREADS.forEach((group, index) => {
            msg += `✨ ${index + 1}. ${group.name}\n`;
        });
        msg += "\n━━━━━━━━━━━━━━━━━━━━━━\n👉 Reply with the number to approve this group.\n━━━━━━━━━━━━━━━━━━━━━━";

        const info = await api.sendMessage(msg, event.threadID);
        global.msgCache.set(info.messageID, { commandName: "approve" });
    },

    onReply: async (api, event, cache) => {
        const configPath = path.join(__dirname, "../../config.json");
        let config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        const index = parseInt(event.body) - 1;

        if (isNaN(index) || index < 0 || index >= config.APPROVAL_SYSTEM.PENDING_THREADS.length) {
            return api.sendMessage("❌ Invalid number! Please provide a valid index.", event.threadID);
        }

        const targetGroup = config.APPROVAL_SYSTEM.PENDING_THREADS[index];
        config.APPROVAL_SYSTEM.APPROVED_THREADS.push(targetGroup.id);
        config.APPROVAL_SYSTEM.PENDING_THREADS.splice(index, 1);

        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
        api.sendMessage(`━━━━━━━━━━━━━━━━━━━━━━\n   ✅ GROUP APPROVED \n━━━━━━━━━━━━━━━━━━━━━━\n\nSuccessfully approved: ${targetGroup.name}\n━━━━━━━━━━━━━━━━━━━━━━`, event.threadID);
        api.sendMessage("🎉 Congratulations! Your group has been approved by the admin. You can now use the bot.", targetGroup.id);
    }
};
