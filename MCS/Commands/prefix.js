const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
 config: {
 name: "prefix",
 aliases: ["prefixinfo"],
 credit: "MOHAMMAD BADOL",
 prefix: false,
 role: 0,
 cooldown: 3,
 description: "Show bot prefix with image"
 },

 onStart: async (api, event, args) => {
 const config = JSON.parse(fs.readFileSync(path.join(__dirname, "../../config.json"), "utf-8"));
 const prefix = config.BOT_INFO.PREFIX;
 const botName = config.BOT_INFO.BOT_NAME || "BADOL-BOT-V5";
 const ownerName = "MOHAMMAD BADOL";
 const imgURL = "https://drive.google.com/uc?export=download&id=1_NMOEKFXUZsvh2b7EnDwJWYp-DvLoJFJ";

 const getStream = async (url) => {
 const res = await axios.get(url, { responseType: "stream" });
 return res.data;
 };

 const msg = `╭───❍ 𝐏𝐫𝐞𝐟𝐢𝐱-𝐈𝐧𝐟𝐨 ❍───╮\n┏━━━━━━━━━━━━━━━━━━━❥\n` +
 `├‣ ✿ 𝐁𝐨𝐭 𝐍𝐚𝐦𝐞: ${botName}\n` +
 `├‣ ✿ 𝐏𝐫𝐞𝐟𝐢𝐱: ${prefix}\n` +
 `├‣ ✿ 𝐓𝐲𝐩𝐞: ${prefix}help\n` +
 `├‣ ✿ 𝐃𝐞𝐯: ${ownerName}\n` +
 `┗━━━━━━━━━━━━━━━━━━━❥\n\n` +
 `𝄞⋆⃝🧚‍${botName}🧚‍⋆⃝𝄞\n` +
 `╰────────────────────⟡`;

 return api.sendMessage({
 body: msg,
 attachment: await getStream(imgURL)
 }, event.threadID, event.messageID);
 }
};


