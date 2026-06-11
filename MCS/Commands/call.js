module.exports.config = {
  name: "call",
  version: "1.0.0",
  role: 0,
  credit: "MOHAMMAD BADOL",
  description: "Admin কে রিপোর্ট করো",
  category: "system",
  prefix: true,
  cooldown: 10
};

// 🔥 Admin ID বসাও
const ADMIN_ID = "61590785637035"; // তোমার ID

module.exports.onStart = async function (api, event, args) {
  const { threadID, messageID, senderID } = event;
  const reason = args.join(" ");

  if (!reason) {
    return api.sendMessage(`┌───────────────┐
│ ⚠️ ERROR ⚠️ │
└───────────────┘
রিপোর্টের কারণ লিখো
/call বট কাজ করছে না`, threadID, messageID);
  }

  const senderInfo = await api.getUserInfo(senderID);
  const senderName = senderInfo[senderID].name;
  const threadInfo = await api.getThreadInfo(threadID);
  const threadName = threadInfo.threadName || "Unknown Group";

  // Admin কে পাঠাও
  const reportMsg = `┌───────────────┐
│ 🚨 REPORT 🚨 │
└───────────────┘
From: ${senderName}
Group: ${threadName}
TID: ${threadID}
Reason: ${reason}`;

  try {
    await api.sendMessage(reportMsg, ADMIN_ID);

    return api.sendMessage(`┌───────────────┐
│ ✅ SENT ✅ │
└───────────────┘
Admin কে রিপোর্ট পাঠানো হয়েছে
তাড়াতাড়ি রিপ্লাই পাবা`, threadID, messageID);

  } catch (e) {
    return api.sendMessage(`┌───────────────┐
│ ❌ FAILED ❌ │
└───────────────┘
Admin কে পাঠাতে পারলাম না`, threadID, messageID);
  }
};
