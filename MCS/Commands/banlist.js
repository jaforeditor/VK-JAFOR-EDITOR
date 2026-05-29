const fs = require("fs");
const path = require("path");

function box(title, content) {
    return `┌─[ ${title} ]─┐\n│\n${content.split('\n').map(line => `│ ${line}`).join('\n')}\n│\n└───────────⭔`;
}

module.exports = {
    config: {
        name: "banlist",
        aliases: ["userbanlist"],
        credit: "MOHAMMAD BADOL",
        prefix: true,
        role: 1,
        cooldown: 0,
        description: "View the list of banned users"
    },
    onStart: async (api, event, args) => {
        const configPath = path.join(__dirname, "../../config.json");
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        const list = config.ACCESS_CONTROL.BANNED_USERS;
        
        if (list.length === 0) {
            return api.sendMessage(box("📋 BAN LIST", "No users are currently banned."), event.threadID);
        }

        let display = `Total Banned: ${list.length}\n\n`;

        for (let i = 0; i < list.length; i++) {
            const uid = list[i];
            try {
                const userInfo = await api.getUserInfo(uid);
                const userName = userInfo[uid] ? userInfo[uid].name : "Unknown User";
                display += `${i + 1}. ${userName}\n   ID: ${uid}\n\n`;
            } catch (e) {
                display += `${i + 1}. Unknown User\n   ID: ${uid}\n\n`;
            }
        }

        api.sendMessage(box("📋 BAN LIST", display.trim()), event.threadID);
    }
};
