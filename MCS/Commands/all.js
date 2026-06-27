module.exports = {
    config: {
        name: "all",
        version: "3.0",
        credit: "MOHAMMAD BADOL",
        role: 1,
        description: "Real tag everyone",
        category: "box chat",
        usages: "[message]",
        cooldown: 5,
        prefix: true
    },

    onStart: async function (api, event, args) {
        const { threadID, messageID } = event;
        const userMessage = args.join(" ");
        const tagText = "@everyone";
        const msg = userMessage ? `${tagText} ${userMessage}` : tagText;

        try {
            const threadInfo = await api.getThreadInfo(threadID);
            const participantIDs = threadInfo.participantIDs.filter(id => id !== api.getCurrentUserID());
            
            const mentions = participantIDs.map(id => ({
                tag: tagText,
                id: id,
                fromIndex: 0
            }));

            return api.sendMessage({ body: msg, mentions }, threadID, messageID);
        } catch (e) {
            return api.sendMessage(`❌ Error: ${e.message}`, threadID, messageID);
        }
    }
};

