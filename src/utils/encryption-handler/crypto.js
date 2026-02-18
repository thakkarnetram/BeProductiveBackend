const crypto = require("crypto")

// defines the algo used for encryption
const algorithm = "aes-256-cbc";
const key = crypto
    .createHash("sha256")
    .update(process.env.ENCRYPTION_KEY)
    .digest()

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm,key,iv);
    let encrypted = cipher.update(text,"utf-8","hex")
    encrypted += cipher.final("hex")
    return iv.toString("hex") + ":" + encrypted;
}

function decrypt(text) {
    if (!text || typeof text !== "string") return text;
    if (!text.includes(":")) return text;
    const parts = text.split(":");
    if (parts.length !== 2) return text;
    const [ivHex, encryptedText] = parts;
    if (!/^[0-9a-fA-F]{32}$/.test(ivHex)) return text;
    try {
        const iv = Buffer.from(ivHex, "hex");
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedText, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    } catch (err) {
        return text;
    }
}

module.exports = {encrypt,decrypt}
