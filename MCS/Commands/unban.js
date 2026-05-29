const fs = require("fs");
const path = require("path");

function box(title, content) {
    return `┌─[ ${title} ]─┐\n│\n${content.split('\n').map(line => `│ ${line}`).join('\n')}\n│\n└───────────⭔`;
}

module.exports = {
    config: {
        name: "unban",
        aliases: ["userunban"],
        credit: "MOHAMMAD BADOL",
        prefix: true,
        role: 1,
        cooldown: 0,
        description: "Unban a user"
    },
    onStart: async (api, event, args) => {
        const configPath = path.join(__dirname, "../../config.json");
        let config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        let targetID = event.messageReply ? event.messageReply.senderID : (Object.keys(event.mentions)[0] || args[0]);

        if (!targetID) return api.sendMessage(box("❌ ERROR", "Please provide a user ID or reply."), event.threadID);
        
        const index = config.ACCESS_CONTROL.BANNED_USERS.indexOf(targetID);
        if (index === -1) return api.sendMessage(box("❌ ERROR", "User is not in the ban list."), event.threadID);
        
        config.ACCESS_CONTROL.BANNED_USERS.splice(index, 1);
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
        api.sendMessage(box("✅ SUCCESS", `User ${targetID} has been unbanned.`), event.threadID);
    }
};

