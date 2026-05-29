const fs = require("fs");
const path = require("path");
const axios = require("axios"); // এটা নতুন এড করলাম

module.exports.config = {
    name: "up",
    credit: "MOHAMMAD BADOL",
    aliases: ["uptime", "runtime"],
    prefix: false,
    role: 0,
    cooldown: 5,
    description: "Bot Up Time with Image"
};

function getUptime() {
    const ms = Date.now() - global.botStartTime;
    const sec = Math.floor(ms / 1000);
    const d = Math.floor(sec / 86400);
    const h = Math.floor((sec % 86400) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${d}D : ${h}H : ${m}M : ${s}S`;
}

module.exports.onStart = async (api, event, args) => {
    try {
        const configPath = path.join(__dirname, "../../config.json");
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        const cmdCount = global.commands ? global.commands.size : 0;
        
        // ছবির লিংক - Google Drive এর ID বের করে ডাইরেক্ট লিংক বানালাম
        const imgURL = "https://drive.google.com/uc?export=download&id=1W-5M6CGpIsektTKOM_E3vbUawpEUJIOC";
        
        const getStream = async (url) => {
            try {
                const res = await axios.get(url, { responseType: "stream" });
                return res.data;
            } catch (e) {
                console.log("Image load failed:", e.message);
                return null;
            }
        };
        
        const msg = `
╔═════════════════════╗
║⚡BADOL-BOT V5 STATUS⚡║
╚═════════════════════╝

┏━━━[ ⏱️ UPTIME ]━━━┓
┃  ${getUptime()}
┗━━━━━━━━━━━━━━━━━━┛

┏━━━[ 🤖 BOT INFO ]━━━┓
┃ Name: ${config.BOT_INFO.NAME}
┃ Owner: ${config.OWNER_LOCK.NAME}
┃ Prefix: ${config.BOT_INFO.PREFIX}
┃ Status: ONLINE ✅
┗━━━━━━━━━━━━━━━━━━━━━┛

┏━━━[ 📊 SYSTEM ]━━━┓
┃ Commands: ${cmdCount}
┃ Version: ${config.BOT_INFO.VERSION}
┃ Node: ${process.version}
┃ Platform: ${process.platform}
┗━━━━━━━━━━━━━━━━━━━━┛

© Developer ${config.OWNER_LOCK.NAME}
`;

        const attachment = await getStream(imgURL);

        return api.sendMessage({
            body: msg,
            attachment: attachment || undefined // ছবি লোড না হলেও টেক্সট যাবে
        }, event.threadID, event.messageID);

    } catch (e) {
        console.log(e);
        api.sendMessage("❌ কমান্ডটি রান করতে সমস্যা হচ্ছে!", event.threadID);
    }
};
