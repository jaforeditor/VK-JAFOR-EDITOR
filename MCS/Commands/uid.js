const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
    name: "uid",
    aliases: ["id"],
    version: "1.4",
    credit: "MOHAMMAD BADOL",
    prefix: false,
    role: 0,
    cooldown: 2,
    category: "utility",
    description: "Only shows profile picture and UID"
};

module.exports.onStart = async function(api, event, args) {
    const { threadID, messageID, senderID, mentions, messageReply } = event;
    const cachePath = __dirname + "/cache/";

    try {
        if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

        let targetID;

        if (messageReply) {
            targetID = messageReply.senderID;
        }
        else if (Object.keys(mentions).length > 0) {
            targetID = Object.keys(mentions)[0];
        }
        else if (args[0] &&!isNaN(args[0])) {
            targetID = args[0];
        }
        else {
            targetID = senderID;
        }

        const callback = () => {
            api.sendMessage(
                {
                    body: targetID,
                    attachment: fs.createReadStream(cachePath + `${targetID}.jpg`)
                },
                threadID,
                () => fs.unlinkSync(cachePath + `${targetID}.jpg`),
                messageID
            );
        };

        const picUrl = `https://graph.facebook.com/${targetID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

        request(encodeURI(picUrl))
         .pipe(fs.createWriteStream(cachePath + `${targetID}.jpg`))
         .on("close", () => callback())
         .on("error", () => api.sendMessage(targetID, threadID, messageID));

    } catch (e) {
        return api.sendMessage("Error", threadID, messageID);
    }
};

