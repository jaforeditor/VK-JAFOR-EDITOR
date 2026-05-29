const fs = require("fs-extra");
const path = require("path");
const vm = require("vm");

function box(title, content) {
    return `╭─[ ${title} ]─╮\n${content}\n╰───────────────╯`;
}

module.exports = {
    config: {
        name: "cmd",
        aliases: ["command"],
        credit: "MOHAMMAD BADOL",
        prefix: true,
        role: 1,
        cooldown: 0,
        description: "Command Management System"
    },

    onReaction: async function (api, event) {
        if (event.reaction !== "💚") return;
        const confirmKey = `cmd_confirm_${event.messageID}`;
        const data = global.msgCache.get(confirmKey);
        if (!data || event.userID !== data.senderID) return;

        try {
            await api.unsendMessage(event.messageID); // WARNING মুছে ফেলছে
            await fs.writeFileSync(data.filePath, data.code);
            delete require.cache[require.resolve(data.filePath)];
            const cmd = require(data.filePath);
            global.commands.set(cmd.config.name, cmd);
            api.sendMessage(box("✅ OVERWRITE DONE", `│ File: ${data.fileName}\n│ Status: Updated & Loaded`), event.threadID);
            global.msgCache.delete(confirmKey);
        } catch (e) {
            api.sendMessage(box("❌ ERROR", `│ ${e.message}`), event.threadID);
        }
    },

    onStart: async function (api, event, args) {
        const { threadID, senderID, messageID } = event;
        const cmdPath = __dirname;
        const action = args[0]?.toLowerCase();

        if (!action) return api.sendMessage(box("⚙️ CMD MANAGER", "│ /cmd load <name>\n│ /cmd unload <name>\n│ /cmd loadall\n│ /cmd del <name>\n│ /cmd add <name.js> <code>"), threadID);

        try {
            switch (action) {
                case "load":
                    const p = path.join(cmdPath, args[1] + ".js");
                    if (!fs.existsSync(p)) return api.sendMessage(box("❌ ERROR", "│ File not found"), threadID);
                    delete require.cache[require.resolve(p)];
                    global.commands.set(require(p).config.name, require(p));
                    return api.sendMessage(box("✅ LOAD SUCCESS", `│ Loaded: ${args[1]}`), threadID);

                case "unload":
                    global.commands.delete(args[1]);
                    return api.sendMessage(box("⚠️ UNLOAD SUCCESS", `│ Inactive: ${args[1]}`), threadID);

                case "loadall":
                    global.loadCommands();
                    return api.sendMessage(box("🚀 LOAD ALL", `│ Total: ${global.commands.size}`), threadID);

                case "add":
                    const [fn, ...codeArr] = args.slice(1);
                    const code = codeArr.join(" ");
                    if (!fn || !code) return api.sendMessage(box("❌ ERROR", "│ Syntax: /cmd add name.js <code>"), threadID);
                    const fp = path.join(cmdPath, fn);
                    if (fs.existsSync(fp)) {
                        return api.sendMessage(box("⚠️ WARNING", "│ File exists! React 💚 to overwrite."), threadID, (err, info) => {
                            global.msgCache.set(`cmd_confirm_${info.messageID}`, { fileName: fn, code, filePath: fp, senderID });
                        }, messageID);
                    }
                    await fs.writeFileSync(fp, code);
                    global.loadCommands();
                    return api.sendMessage(box("✅ INSTALLED", `│ ${fn} active`), threadID);
            }
        } catch (e) { api.sendMessage(box("❌ ERROR", `│ ${e.message}`), threadID); }
    }
};

