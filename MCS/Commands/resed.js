module.exports = {
 config: {
 name: "resed",
 aliases: ["re", "restart", "reboot"], // এখানে আপনার পছন্দমতো নামগুলো দিন
 credit: "MOHAMMAD BADOL",
 role: 1,
 cooldown: 5,
 prefix: true
 },

 onStart: async (api, event, args) => {
 const { threadID } = event;
 api.sendMessage("⚙️ RESTARTING...", threadID, (err, info) => {
 if (err) return;
 process.env.RESTART_THREAD_ID = threadID;
 process.env.RESTART_MSG_ID = info.messageID;
 process.env.RESTART_TIME = Date.now();
 process.exit(0);
 });
 }
};