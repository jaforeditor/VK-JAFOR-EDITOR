module.exports = {
    config: {
        name: "pending",
        aliases: ["pen", "appr"],
        prefix: true,
        role: 1,
        cooldown: 5,
        credit: "MOHAMMAD BADOL"
    },

    onStart: async (api, event, args) => {
        const { threadID, messageID } = event;

        const threadInfo = await api.getThreadInfo(threadID);
        const botID = api.getCurrentUserID();

        if (!threadInfo.adminIDs.some(admin => admin.id == botID)) {
            return api.sendMessage(`╭─❌ ERROR ─╮\n│ আমাকে অ্যাডমিন দাও\n╰──────────╯`, threadID, messageID);
        }

        if (!threadInfo.approvalQueue || threadInfo.approvalQueue.length === 0) {
            return api.sendMessage(`╭─📋 PENDING ─╮\n│ No Pending Members\n╰─────────────╯`, threadID, messageID);
        }

        if (!args[0]) {
            const pendingList = [];
            for (let i = 0; i < threadInfo.approvalQueue.length; i++) {
                try {
                    const userInfo = await api.getUserInfo(threadInfo.approvalQueue[i].requesterID);
                    const name = userInfo[threadInfo.approvalQueue[i].requesterID]?.name || "Unknown";
                    pendingList.push(`${i + 1}. ${name}`);
                } catch (e) {
                    pendingList.push(`${i + 1}. Unknown`);
                }
            }

            return api.sendMessage(
                `╭─📋 PENDING MEMBERS ─╮\n` +
                `│ Total: ${threadInfo.approvalQueue.length} জন\n│\n` +
                `${pendingList.map(p => `│ ${p}`).join('\n')}\n│\n` +
                `│ /pending all - সব Approve\n` +
                `│ /pending 1 2 3 - নির্দিষ্ট\n` +
                `╰──────────────────╯`,
                threadID, messageID
            );
        }

        if (args[0].toLowerCase() === 'all') {
            try {
                const requesterIDs = threadInfo.approvalQueue.map(u => u.requesterID);
                let count = 0;

                // ✅ ট্রিক: Pending মেম্বারকে আবার Add কর
                for (let userID of requesterIDs) {
                    try {
                        await api.addUserToGroup(userID, threadID);
                        count++;
                        await new Promise(r => setTimeout(r, 1000)); // 1s delay
                    } catch (e) {
                        console.log(`Failed: ${userID}`, e.message);
                    }
                }

                return api.sendMessage(
                    `╭─✅ APPROVED ─╮\n` +
                    `│ Success: ${count}/${requesterIDs.length} জন\n` +
                    `│ ${count > 0? 'Approved ✅' : 'Failed ❌'}\n` +
                    `╰──────────────╯`,
                    threadID, messageID
                );
            } catch (e) {
                return api.sendMessage(`╭─❌ ERROR ─╮\n│ ${e.message}\n╰──────────╯`, threadID, messageID);
            }
        }

        try {
            const indexes = args.map(arg => parseInt(arg) - 1).filter(i => i >= 0 && i < threadInfo.approvalQueue.length);
            if (indexes.length === 0) return api.sendMessage(`╭─❌ ERROR ─╮\n│ Invalid Number\n╰──────────╯`, threadID, messageID);

            const toApprove = indexes.map(i => threadInfo.approvalQueue[i].requesterID);
            let count = 0;

            // ✅ ট্রিক: Pending মেম্বারকে আবার Add কর
            for (let userID of toApprove) {
                try {
                    await api.addUserToGroup(userID, threadID);
                    count++;
                    await new Promise(r => setTimeout(r, 1000));
                } catch (e) {
                    console.log(`Failed: ${userID}`, e.message);
                }
            }

            return api.sendMessage(
                `╭─✅ APPROVED ─╮\n` +
                `│ Success: ${count}/${toApprove.length} জন\n` +
                `│ ${count > 0? 'Approved ✅' : 'Failed ❌'}\n` +
                `╰──────────────╯`,
                threadID, messageID
            );
        } catch (e) {
            return api.sendMessage(`╭─❌ ERROR ─╮\n│ ${e.message}\n╰──────────╯`, threadID, messageID);
        }
    }
};
