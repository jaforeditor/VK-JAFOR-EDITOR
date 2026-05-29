const axios = require("axios");

module.exports = {
 config: {
 name: "noti",
 version: "1.0.0",
 credit: "MOHAMMAD BADOL",
 prefix: true,
 role: 2,
 cooldown: 10,
 description: "সব গ্রুপে নোটিফিকেশন পাঠাও",
 commandCategory: "admin",
 usages: "[message] | [reply to image/file]",
 aliases: ["note", "notify"]
 },

 onStart: async function (api, event, args) {
 const { threadID, messageID, type, messageReply } = event;

 if (!args[0] && type!== "message_reply") {
 return api.sendMessage(
 "╭─── 📢 NOTIFICATION ───╮\n\n" +
 "▸ noti [মেসেজ]\n" +
 "▸ noti [ইমেজ রিপ্লাই]\n\n" +
 "সব গ্রুপে মেসেজ পাঠায়।\n\n" +
 "╰────────────────────────╯",
 threadID, messageID
 );
 }

 const text = args.join(" ").trim();

 try {
 // সব গ্রুপ লিস্ট আনো
 const allThreads = await api.getThreadList(100, null, ["INBOX"]);
 const groups = allThreads.filter(t => t.isGroup && t.name);

 if (!groups.length) {
 return api.sendMessage("❌ কোনো গ্রুপ পাওয়া যায়নি।", threadID, messageID);
 }

 const infoMsg = await api.sendMessage(
 `╭─── 📢 NOTIFICATION ───╮\n\n` +
 `⏳ পাঠানো হচ্ছে...\n` +
 `📋 মোট: ${groups.length} টা গ্রুপ\n\n` +
 `╰────────────────────────╯`,
 threadID
 );

 let sent = 0, failed = 0;

 for (const t of groups) {
 const tid = t.threadID;
 try {
 if (type === "message_reply" && messageReply) {
 const attachments = messageReply.attachments || [];

 if (attachments.length > 0) {
 const streams = [];

 for (const att of attachments) {
 try {
 const url = att.url || att.playableUrl || att.previewUrl;
 if (!url) continue;
 const res = await axios.get(url, { responseType: "stream" });
 streams.push(res.data);
 } catch (_) {}
 }

 if (streams.length > 0) {
 const msgObj = {};
 if (text) msgObj.body = `📢 ${text}`;
 msgObj.attachment = streams.length === 1? streams[0] : streams;
 await api.sendMessage(msgObj, String(tid));
 } else {
 const body = `📢 ${text || messageReply.body || ""}`.trim();
 if (body && body!== "📢") await api.sendMessage(body, String(tid));
 }
 } else {
 const body = `📢 ${text || messageReply.body || ""}`.trim();
 if (body && body!== "📢") await api.sendMessage(body, String(tid));
 }
 } else {
 await api.sendMessage(`📢 ${text}`, String(tid));
 }
 sent++;
 } catch (_) {
 failed++;
 }

 await new Promise(r => setTimeout(r, 400)); // 400ms delay
 }

 const result =
 `╭─── 📢 NOTIFICATION ───╮\n\n` +
 `✅ পাঠানো হয়েছে: ${sent} টা গ্রুপ\n` +
 (failed > 0? `❌ ফেইল: ${failed} টা গ্রুপ\n` : "") +
 `📋 মোট: ${groups.length} টা গ্রুপ\n\n` +
 `╰────────────────────────╯`;

 try {
 if (infoMsg && infoMsg.messageID) {
 await api.unsendMessage(infoMsg.messageID);
 }
 } catch (_) {}

 return api.sendMessage(result, threadID, messageID);

 } catch (error) {
 console.log(" Error:", error.message);
 return api.sendMessage("❌ নোটিফিকেশন পাঠাতে এরর হইছে।", threadID, messageID);
 }
 }
};
