const fs = require("fs");
const path = require("path");

function box(title, content) {
    return `┌─[ ${title} ]─┐\n│\n${content.split('\n').map(line => `│ ${line}`).join('\n')}\n│\n└───────────⭔`;
}

module.exports = {
    config: {
        name: "ban",
        aliases: ["userban"],
        credit: "MOHAMMAD BADOL",
        prefix: true,
        role: 1,
        cooldown: 0,
        description: "Ban a user"
    },
    onStart: async (api, event, args) => {
        const configPath = path.join(__dirname, "../../config.json");
        let config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        let targetID = event.messageReply ? event.messageReply.senderID : (Object.keys(event.mentions)[0] || args[0]);

        if (!targetID) return api.sendMessage(box("❌ ERROR", "Please provide a user ID or reply to a message."), event.threadID);
        if (config.ACCESS_CONTROL.BANNED_USERS.includes(targetID)) return api.sendMessage(box("⚠️ WARNING", "User is already banned."), event.threadID);
        
        config.ACCESS_CONTROL.BANNED_USERS.push(targetID);
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
        api.sendMessage(box("✅ SUCCESS", `User ${targetID} has been banned.`), event.threadID);
    }
};
