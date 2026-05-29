const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "admin2",
        aliases: ["addadmin", "adminadd"],
        credit: "MOHAMMAD BADOL",
        prefix: true,
        role: 1,
        cooldown: 3,
        description: "Manage bot admins"
    },
    onStart: async (api, event, args) => {
        const configPath = path.join(__dirname, "../../config.json");
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        const action = args[0];
        const target = Object.keys(event.mentions)[0] || args[1];

        const sendBox = (msg) => api.sendMessage(`┌─[ ADMIN SYSTEM ]─┐\n│\n│ ${msg.replace(/\n/g, '\n│ ')}\n│\n└───────────⭔`, event.threadID);

        // লিস্ট দেখার অপশন
        if (action === "list") {
            const adminList = config.ADMIN_SYSTEM.ADMINS;
            if (adminList.length === 0) return sendBox("No admins found.");

            let msg = "Current Admins:\n\n";
            for (let i = 0; i < adminList.length; i++) {
                const uid = adminList[i];
                try {
                    const info = await api.getUserInfo(uid);
                    const name = info[uid] ? info[uid].name : "Unknown User";
                    msg += `${i + 1}. ${name}\n   ID: ${uid}\n\n`;
                } catch (e) {
                    msg += `${i + 1}. Unknown User\n   ID: ${uid}\n\n`;
                }
            }
            return sendBox(msg.trim());
        }

        // অ্যাড বা রিমুভ করার অপশন
        if (!target) return sendBox("Please mention a user or provide a UID.");

        if (action === "add") {
            if (config.ADMIN_SYSTEM.ADMINS.includes(target)) return sendBox("User is already an admin.");
            config.ADMIN_SYSTEM.ADMINS.push(target);
            sendBox(`Success: User ${target} is now an admin.`);
        } else if (action === "remove") {
            config.ADMIN_SYSTEM.ADMINS = config.ADMIN_SYSTEM.ADMINS.filter(id => id !== target);
            sendBox(`Success: User ${target} removed from admins.`);
        } else {
            return sendBox("Usage:\n/admin2 list\n/admin2 add [mention/uid]\n/admin2 remove [mention/uid]");
        }

        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
    }
};
