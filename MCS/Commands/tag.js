module.exports.config = {
    name: "tag",
    aliases: ["mention"],
    version: "1.0.1",
    credit: "MOHAMMAD BADOL",
    role: 0,
    prefix: false, // reply দিয়ে চালাবে তাই prefix ছাড়া
    description: "Reply করা ইউজারকে mention করে তার নাম দেখায়",
    category: "utility",
    usages: "[reply]",
    cooldown: 3
};

module.exports.onStart = async function (api, event, args) {
    if (!event ||!event.threadID) return;

    const { threadID, messageID, type, messageReply } = event;

    if (type!== "message_reply" ||!messageReply) {
        return api.sendMessage(
            "❌ যাকে tag করতে চাও তার মেসেজে reply দিয়ে 'tag' লিখো",
            threadID,
            messageID
        );
    }

    try {
        const userID = messageReply.senderID;
        const userInfo = await api.getUserInfo(userID);
        const userName = userInfo[userID]?.name || "User";

        return api.sendMessage({
            body: userName,
            mentions: [{
                tag: userName,
                id: userID
            }]
        }, threadID, messageID);

    } catch (e) {
        console.log(e);
        return api.sendMessage("❌ ইউজার tag করতে পারলাম না।", threadID, messageID);
    }
};
