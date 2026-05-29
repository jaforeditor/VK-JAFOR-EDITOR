const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "config",
        version: "1.1.0",
        credit: "MOHAMMAD BADOL",
        role: 1,
        description: "Configure bot settings and view status",
        prefix: true,
        aliases: ["cfg", "settings"],
        cooldown: 5
    },

    onStart: async (api, event, args) => {
        const configPath = path.join(__dirname, "../../config.json");
        let config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

        // স্ট্যাটাস অনুযায়ী ইমোজি ফাংশন
        const status = (val) => val ? "✅ (ON)" : "❌ (OFF)";

        // ১. কোনো আর্গুমেন্ট না থাকলে স্ট্যাটাস দেখাবে
        if (args.length === 0) {
            return api.sendMessage(
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "   ⚙️ 𝐁𝐎𝐓 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒 𝐒𝐓𝐀𝐓𝐔𝐒 ⚙️\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                `• anti_unsend: ${status(config.BEHAVIOR.ANTI_UNSEND)}\n` +
                `• anti_out: ${status(config.BEHAVIOR.ANTI_OUT)}\n` +
                `• admin_only: ${status(config.ADMIN_SYSTEM.ADMIN_ONLY_MODE)}\n\n` +
                "Usage: /config [key] [true/false]\n" +
                "Example: /config anti_unsend true\n" +
                "━━━━━━━━━━━━━━━━━━━━━━", 
                event.threadID
            );
        }

        // ২. সেটিংস আপডেট লজিক
        try {
            const [key, value] = args;
            if (!value) return api.sendMessage("❌ Error: Missing value! Use 'true' or 'false'.", event.threadID);
            
            const boolValue = (value === "true");

            if (key === "anti_unsend") {
                config.BEHAVIOR.ANTI_UNSEND = boolValue;
            } else if (key === "anti_out") {
                config.BEHAVIOR.ANTI_OUT = boolValue;
            } else if (key === "admin_only") {
                config.ADMIN_SYSTEM.ADMIN_ONLY_MODE = boolValue;
            } else {
                return api.sendMessage("❌ Error: Invalid key! Available keys: anti_unsend, anti_out, admin_only", event.threadID);
            }

            // ৩. ফাইল সেভ করা
            fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
            
            return api.sendMessage(
                `✅ Configuration Updated Successfully!\n\n` +
                `Setting: ${key}\n` +
                `Status: ${boolValue ? "✅ (ON)" : "❌ (OFF)"}`, 
                event.threadID
            );
            
        } catch (e) {
            return api.sendMessage("❌ Error updating config: " + e.message, event.threadID);
        }
    }
};
