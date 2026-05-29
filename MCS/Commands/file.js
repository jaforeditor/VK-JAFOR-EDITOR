const fs = require("fs");
const path = require("path");

function box(title, content) {
    return `┌─[ ${title} ]─┐\n│\n${content.split('\n').map(line => `│ ${line}`).join('\n')}\n│\n└───────────⭔`;
}

module.exports = {
    config: {
        name: "file",
        aliases: ["files"],
        credit: "MOHAMMAD BADOL",
        prefix: true,
        role: 1, 
        cooldown: 0,
        description: "Browse or download files as text"
    },

    onStart: async (api, event, args) => {
        const rootPath = path.resolve(__dirname, "../../"); 
        
        if (args[0] === "get") {
            const fileName = args.slice(1).join(" ").trim();
            const filePath = path.resolve(rootPath, fileName);
            
            if (!fs.existsSync(filePath)) {
                return api.sendMessage(box("❌ ERROR", `File not found:\n${fileName}`), event.threadID);
            }
            
            if (fs.lstatSync(filePath).isDirectory()) {
                return api.sendMessage(box("❌ ERROR", "Cannot download a folder!"), event.threadID);
            }

            // ফাইলটিকে .txt ফরম্যাটে পাঠানোর ব্যবস্থা
            const tempPath = filePath + ".txt";
            fs.copyFileSync(filePath, tempPath); // ফাইলটির একটি কপি .txt হিসেবে তৈরি করা হলো

            return api.sendMessage({
                body: `✅ Downloading: ${path.basename(filePath)} (Format: .txt)`,
                attachment: fs.createReadStream(tempPath)
            }, event.threadID, () => {
                // পাঠানো হয়ে গেলে টেম্পোরারি ফাইলটি মুছে ফেলা হবে
                fs.unlinkSync(tempPath);
            });
        }

        const targetPath = args.length > 0 ? path.resolve(rootPath, args.join(" ").trim()) : rootPath;

        if (!fs.existsSync(targetPath)) {
            return api.sendMessage(box("❌ ERROR", `Path not found: ${targetPath}`), event.threadID);
        }

        const files = fs.readdirSync(targetPath);
        let list = "";
        files.forEach((f, i) => {
            const isDir = fs.lstatSync(path.join(targetPath, f)).isDirectory();
            list += `${i + 1}. ${isDir ? "📁" : "📄"} ${f}\n`;
        });
        
        const content = `Path: ${targetPath.replace(rootPath, "") || "/"}\n\n${list}\n📌 Usage:\n/file [folder]\n/file get [file]`;
        api.sendMessage(box("📂 FILE EXPLORER", content), event.threadID);
    }
};

