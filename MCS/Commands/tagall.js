module.exports.config = {
    name: "tagall",
    aliases: ["all", "everyone"],
    version: "1.0.9",
    credit: "MOHAMMAD BADOL",
    role: 1, // Admin only - spam যেন না হয়
    prefix: true, // /tagall দিয়ে চালাবে
    description: "গ্রুপের সবাইকে একে একে mention করে",
    category: "group",
    usages: "[custom text]",
    cooldown: 10 // 10 সেকেন্ড দিলাম, spam কম হবে
};

module.exports.onStart = async function (api, event, args) {
    if (!event ||!event.threadID) return;

    const { threadID, messageID, senderID } = event;

    // গ্রুপ চেক
    if (!event.isGroup) {
        return api.sendMessage("❌ এই কমান্ড শুধু গ্রুপে কাজ করবে।", threadID, messageID);
    }

    try {
        const threadInfo = await api.getThreadInfo(threadID);
        const allUsers = threadInfo.participantIDs.filter(id => id!= api.getCurrentUserID() && id!= senderID);
        const customMessage = args.join(" ");

        if (allUsers.length === 0) {
            return api.sendMessage("❌ গ্রুপে mention করার মতো কেউ নাই।", threadID, messageID);
        }

        api.sendMessage(`✅ ${allUsers.length} জনকে mention করা শুরু করতেছি...`, threadID, messageID);

        for (let i = 0; i < allUsers.length; i++) {
            const id = allUsers[i];
            try {
                const userInfo = await api.getUserInfo(id);
                const userName = userInfo[id]?.name || "User";
                const body = customMessage? `@${userName} ${customMessage}` : `@${userName}`;
                
                await api.sendMessage(
                    { body, mentions: [{ tag: `@${userName}`, id }] },
                    threadID
                );
                
                // 1 সেকেন্ড delay দিলাম যেন Facebook block না করে
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (e) {
                console.log(`Failed to tag ${id}:`, e.message);
            }
        }

        return api.sendMessage("✅ সবাইকে mention করা শেষ।", threadID);

    } catch (e) {
        console.log(e);
        return api.sendMessage(`❌ Error: ${e.message}`, threadID, messageID);
    }
};
