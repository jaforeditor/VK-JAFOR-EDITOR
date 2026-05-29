module.exports = {
    config: {
        name: "setting",
        aliases: ["set"],
        prefix: true,
        role: 1, // Admin only
        cooldown: 3,
        credit: "MOHAMMAD BADOL"
    },

    onStart: async (api, event, args) => {
        const { threadID } = event;
        const db = require("../../Database");
        
        let threadData = await db.getData(threadID, 'threads');
        if (!threadData.data) threadData.data = { resend: true, anti: true, calllog: true };

        const option = args[0]; 
        const status = args[1];

        // 1. Help Menu (/set)
        if (!option) {
            return api.sendMessage(
                `╭─[⚙️GROUP HELP]─╮\n` +
                `│ Use /set [option] [on/off]\n` +
                `│ Options: resend, anti, calllog\n` +
                `│ Global: all on/off\n` +
                `│ View: /set list\n` +
                `╰───────────────╯`, 
                threadID
            );
        }

        // 2. View Status (/set list)
        if (option === 'list') {
            return api.sendMessage(
                `╭─[📊SYSTEM]─╮\n` +
                `│ Resend: ${threadData.data.resend ? "✅ ON" : "❌ OFF"}\n` +
                `│ Anti:   ${threadData.data.anti ? "✅ ON" : "❌ OFF"}\n` +
                `│ CallLog: ${threadData.data.calllog ? "✅ ON" : "❌ OFF"}\n` +
                `╰───────────────╯`, 
                threadID
            );
        }

        // 3. Global All Control (/set on /set off)
        if (option === 'on' || option === 'off') {
            const val = (option === 'on');
            threadData.data = { resend: val, anti: val, calllog: val };
            await db.saveData(threadID, threadData, 'threads');
            return api.sendMessage(`✅ All features have been turned ${option.toUpperCase()}.`, threadID);
        }

        // 4. Global All Control (/set all on/off)
        if (option === 'all') {
            if (!status) return api.sendMessage("❌ Usage: /set all [on/off]", threadID);
            const val = (status === 'on');
            threadData.data = { resend: val, anti: val, calllog: val };
            await db.saveData(threadID, threadData, 'threads');
            return api.sendMessage(`✅ All features have been turned ${status.toUpperCase()}.`, threadID);
        }

        // 5. Individual Control (/set resend on)
        if (['resend', 'anti', 'calllog'].includes(option)) {
            if (status === 'on' || status === 'off') {
                threadData.data[option] = (status === 'on');
                await db.saveData(threadID, threadData, 'threads');
                return api.sendMessage(`✅ Feature '${option}' has been set to ${status.toUpperCase()}.`, threadID);
            }
        }

        return api.sendMessage("❌ Invalid command. Use /set to see available options.", threadID);
    }
};
