const fs = require("fs");
const path = require("path");

const box = (title, content) => {
    return `╭─❏ ${title}\n${content}\n╰──────────────`;
};

module.exports = {
    config: {
        name: "ev",
        version: "2.0.0",
        credit: "MOHAMMAD BADOL",
        aliases: ["event"],
        role: 1,
        prefix: true,
        cooldown: 3,
        description: "Event file manager - add, delete, reload without restart",
        category: "admin"
    },

    onStart: async (api, event, args) => {
        const evtPath = path.join(__dirname, "../Events");
        const sub = args[0]?.toLowerCase();
        const fileName = args[1];
        const code = args.slice(2).join(" ");

        // ev list
        if (sub === "list") {
            const files = fs.readdirSync(evtPath).filter(f => f.endsWith(".js"));
            if (!files.length) return api.sendMessage(
                box("EVENT LIST", "❌ No event files found!"),
                event.threadID
            );

            let list = "";
            files.forEach((f, i) => {
                const evt = require(path.join(evtPath, f));
                const status = global.events.has(evt.config?.name || f.replace(".js", ""))? "🟢" : "🔴";
                list += `${i + 1}. ${status} ${f}\n`;
            });

            return api.sendMessage(
                box("EVENT LIST", `${list}\n🟢 Loaded | 🔴 Unloaded\nTotal: ${files.length} files`),
                event.threadID
            );
        }

        // ev add filename.js code
        if (sub === "add") {
            if (!fileName ||!code) return api.sendMessage(
                box("USAGE ERROR", "⚠️ Usage: ev add <filename.js> <code>"),
                event.threadID
            );
            if (!fileName.endsWith(".js")) return api.sendMessage(
                box("INVALID NAME", "❌ File name must end with.js"),
                event.threadID
            );

            const filePath = path.join(evtPath, fileName);
            if (fs.existsSync(filePath)) return api.sendMessage(
                box("FILE EXISTS", `❌ ${fileName} already exists!`),
                event.threadID
            );

            try {
                fs.writeFileSync(filePath, code, "utf-8");
                delete require.cache[require.resolve(filePath)];
                const evt = require(filePath);
                if (evt.onEvent || evt.onReaction || evt.onChat || evt.onReply) {
                    global.events.set(evt.config?.name || fileName.replace(".js", ""), evt);
                    return api.sendMessage(
                        box("SUCCESS", `✅ Event ${fileName} added & loaded successfully!`),
                        event.threadID
                    );
                } else {
                    fs.unlinkSync(filePath);
                    return api.sendMessage(
                        box("INVALID EVENT", "❌ Event file must have onEvent/onChat/onReaction/onReply!"),
                        event.threadID
                    );
                }
            } catch (e) {
                return api.sendMessage(
                    box("ERROR", `❌ ${e.message}`),
                    event.threadID
                );
            }
        }

        // ev del filename.js
        if (sub === "del") {
            if (!fileName) return api.sendMessage(
                box("USAGE ERROR", "⚠️ Usage: ev del <filename.js>"),
                event.threadID
            );
            const filePath = path.join(evtPath, fileName);
            if (!fs.existsSync(filePath)) return api.sendMessage(
                box("NOT FOUND", `❌ File ${fileName} not found!`),
                event.threadID
            );

            try {
                const evt = require(filePath);
                global.events.delete(evt.config?.name || fileName.replace(".js", ""));
                delete require.cache[require.resolve(filePath)];
                fs.unlinkSync(filePath);
                return api.sendMessage(
                    box("DELETED", `🗑️ Event ${fileName} deleted successfully!`),
                    event.threadID
                );
            } catch (e) {
                return api.sendMessage(
                    box("ERROR", `❌ ${e.message}`),
                    event.threadID
                );
            }
        }

        // ev load filename.js
        if (sub === "load") {
            if (!fileName) return api.sendMessage(
                box("USAGE ERROR", "⚠️ Usage: ev load <filename.js>"),
                event.threadID
            );
            const filePath = path.join(evtPath, fileName);
            if (!fs.existsSync(filePath)) return api.sendMessage(
                box("NOT FOUND", `❌ File ${fileName} not found!`),
                event.threadID
            );

            try {
                delete require.cache[require.resolve(filePath)];
                const evt = require(filePath);
                if (evt.onEvent || evt.onReaction || evt.onChat || evt.onReply) {
                    global.events.set(evt.config?.name || fileName.replace(".js", ""), evt);
                    return api.sendMessage(
                        box("RELOADED", `🔄 Event ${fileName} reloaded successfully!`),
                        event.threadID
                    );
                } else {
                    return api.sendMessage(
                        box("INVALID EVENT", "❌ Event file must have onEvent/onChat/onReaction/onReply!"),
                        event.threadID
                    );
                }
            } catch (e) {
                return api.sendMessage(
                    box("ERROR", `❌ ${e.message}`),
                    event.threadID
                );
            }
        }

        // ev loadall
        if (sub === "loadall") {
            global.events.clear();
            const files = fs.readdirSync(evtPath).filter(f => f.endsWith(".js"));
            let count = 0;
            let errors = [];

            files.forEach(file => {
                try {
                    const filePath = path.join(evtPath, file);
                    delete require.cache[require.resolve(filePath)];
                    const evt = require(filePath);
                    if (evt.onEvent || evt.onReaction || evt.onChat || evt.onReply) {
                        global.events.set(evt.config?.name || file.replace(".js", ""), evt);
                        count++;
                    }
                } catch (e) {
                    errors.push(`• ${file}`);
                }
            });

            let result = `✅ Loaded: ${count}/${files.length} events`;
            if (errors.length) result += `\n❌ Failed: ${errors.length}\n${errors.join("\n")}`;

            return api.sendMessage(
                box("LOAD ALL", result),
                event.threadID
            );
        }

        // help
        return api.sendMessage(
            box("EV COMMAND",
                `• ev list - Show all events\n` +
                `• ev add <name.js> <code> - Add new event\n` +
                `• ev del <name.js> - Delete event\n` +
                `• ev load <name.js> - Reload one event\n` +
                `• ev loadall - Reload all events`
            ),
            event.threadID
        );
    }
};
