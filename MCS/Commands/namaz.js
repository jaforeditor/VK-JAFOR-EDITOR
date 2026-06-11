const moment = require("moment-timezone");

module.exports.config = {
  name: "namaz",
  version: "5.1.0",
  role: 0,
  credit: "MOHAMMAD BADOL",
  description: "namaz time",
  category: "islamic",
  prefix: true,
  cooldown: 5
};

// 🔥 এখানে টাইম চেঞ্জ করো - ২৪ ঘন্টা ফরম্যাট
// গাইড: ভোর ৪টা = "04:00", দুপুর ১২টা = "12:00", দুপুর ১টা = "13:00",
// বিকাল ৫টা = "17:00", সন্ধ্যা ৬টা = "18:00", রাত ৮টা = "20:00"

const PRAYER_TIMES = [
  { name: "ফজর", time: "04:15", emoji: "🌅", desc: "ভোরের নামাজ" }, // ভোর ৪:১৫
  { name: "যোহর", time: "13:00", emoji: "☀️", desc: "দুপুরের নামাজ" }, // দুপুর ১:০০
  { name: "আসর", time: "17:00", emoji: "🌤️", desc: "বিকালের নামাজ" }, // বিকাল ৫:০০
  { name: "মাগরিব", time: "19:10", emoji: "🌆", desc: "সন্ধ্যার নামাজ" }, // সন্ধ্যা ৭:১০
  { name: "এশা", time: "20:10", emoji: "🌙", desc: "রাতের নামাজ" } // রাত ৮:১০
];

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const BN_DAYS = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
const BN_MONTHS = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];

function toBanglaNum(n) {
  return String(n).replace(/[0-9]/g, d => BN_DIGITS[+d]);
}

function convertTo12Hour(time24) {
  const [hour, minute] = time24.split(":");
  let h = parseInt(hour);
  const ampm = h >= 12? "PM" : "AM";
  h = h % 12 || 12;
  return `${toBanglaNum(h)}:${toBanglaNum(minute)} ${ampm}`;
}

async function sendPrayerAlert(api, prayer) {
  const threads = global.data?.allThreadID || [];
  if (threads.length === 0) {
    console.log("[NAMAZ] No groups found");
    return;
  }

  const now = moment.tz("Asia/Dhaka");
  const banglaTime = convertTo12Hour(prayer.time);
  const date = toBanglaNum(now.format("DD")) + " " + BN_MONTHS[now.month()] + " " + toBanglaNum(now.format("YYYY"));
  const day = BN_DAYS[now.day()];

  const msg = `╔═══════════════════╗
║ 🕌 নামাজের সময় 🕌 ║
╚═══════════════════╝

${prayer.emoji} ${prayer.name} এর ওয়াক্ত শুরু হয়েছে
━━━━━━━━━━━━━━━━━━━
⏰ সময়: ${banglaTime}
📅 তারিখ: ${date}
📆 বার: ${day}
📖 ${prayer.desc}
━━━━━━━━━━━━━━━━━━━

🤲 নামাজ আদায় করুন
💚 আল্লাহ আপনার ইবাদত কবুল করুন
🕋 জামাতে নামাজ পড়ার চেষ্টা করুন

═══════════════════
    আল্লাহ হাফেজ
═══════════════════`;

  console.log(`[NAMAZ] Sending ${prayer.name} alert to ${threads.length} groups`);

  for (const tid of threads) {
    try {
      await api.sendMessage(msg, tid);
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
      console.log(`[NAMAZ] Failed ${tid}`);
    }
  }
}

function schedulePrayers(api) {
  const now = moment.tz("Asia/Dhaka");

  if (global.namazTimers) {
    global.namazTimers.forEach(t => clearTimeout(t));
  }
  global.namazTimers = [];

  for (const prayer of PRAYER_TIMES) {
    const [hour, minute] = prayer.time.split(":");
    let prayerTime = moment.tz("Asia/Dhaka").hour(parseInt(hour)).minute(parseInt(minute)).second(0);

    if (prayerTime.isBefore(now)) {
      prayerTime = prayerTime.add(1, "day");
    }

    const msUntil = prayerTime.diff(now);
    const banglaTime = convertTo12Hour(prayer.time);

    console.log(`[NAMAZ] ${prayer.name} scheduled at ${banglaTime}`);

    const timer = setTimeout(() => {
      sendPrayerAlert(api, prayer);
      const dailyTimer = setInterval(() => sendPrayerAlert(api, prayer), 86400000);
      global.namazTimers.push(dailyTimer);
    }, msUntil);

    global.namazTimers.push(timer);
  }
}

module.exports.onLoad = async function ({ api }) {
  schedulePrayers(api);
  const now = moment.tz("Asia/Dhaka");
  let nextMidnight = moment.tz("Asia/Dhaka").add(1, "day").startOf("day").add(1, "minute");
  const msUntilMidnight = nextMidnight.diff(now);

  setTimeout(() => {
    schedulePrayers(api);
    setInterval(() => schedulePrayers(api), 86400000);
  }, msUntilMidnight);

  console.log("[NAMAZ] All prayer times scheduled - Stylish Mode");
};

module.exports.onStart = async function (api, event, args) {
  const { threadID, messageID, senderID } = event;
  const config = require("../../config.json");
  const prefix = config.BOT_INFO.PREFIX;
  const isAdmin = config.ADMIN_SYSTEM.ADMINS.includes(senderID);

  if (args[0] === "stop") {
    if (!isAdmin) return api.sendMessage("❌ শুধু Admin এই কমান্ড ইউজ করতে পারবে", threadID, messageID);
    if (global.namazTimers) {
      global.namazTimers.forEach(t => clearTimeout(t));
      global.namazTimers = [];
    }
    return api.sendMessage(`╔═══════════════════╗
║ ⚠️ সিস্টেম বন্ধ ║
╚═══════════════════╝

নামাজের রিমাইন্ডার বন্ধ করা হয়েছে।
চালু করতে টাইপ করুন: ${prefix}namaz start`, threadID, messageID);
  }

  if (args[0] === "start") {
    if (!isAdmin) return api.sendMessage("❌ শুধু Admin এই কমান্ড ইউজ করতে পারবে", threadID, messageID);
    schedulePrayers(api);
    return api.sendMessage(`╔═══════════════════╗
║ ✅ সিস্টেম চালু ║
╚═══════════════════╝

নামাজের রিমাইন্ডার চালু করা হয়েছে।
প্রতি ওয়াক্তে অটো মেসেজ পাবেন।`, threadID, messageID);
  }

  const now = moment.tz("Asia/Dhaka");
  const date = toBanglaNum(now.format("DD")) + " " + BN_MONTHS[now.month()] + " " + toBanglaNum(now.format("YYYY"));
  const day = BN_DAYS[now.day()];

  let list = `╔═══════════════════╗
║ 🕌 নামাজের সময়সূচী 🕌 ║
╚═══════════════════╝

📍 স্থান: বাংলাদেশ
📅 তারিখ: ${date}
📆 বার: ${day}
━━━━━━━━━━━━━━━━━━━

`;

  for (const prayer of PRAYER_TIMES) {
    list += `${prayer.emoji} ${prayer.name.padEnd(8, ' ')}: ${convertTo12Hour(prayer.time)}\n └─ ${prayer.desc}\n\n`;
  }

  list += `━━━━━━━━━━━━━━━━━━━
✅ বট প্রতি ওয়াক্তে অটো রিমাইন্ডার পাঠাবে
💡 বন্ধ করতে: ${prefix}namaz stop

═══════════════════
   🤲 আল্লাহ হাফেজ 🤲
═══════════════════`;

  return api.sendMessage(list, threadID, messageID);
};
