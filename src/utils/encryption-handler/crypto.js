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
    const [ivHex,encryptedText] = text.split(":");
    const iv =Buffer.from(ivHex,"hex")
    const decipher = crypto.createDecipheriv(algorithm,key,iv);
    let decrypted = decipher.update(encryptedText,"hex","utf-8");
    decrypted += decipher.final("utf-8")
    return decrypted;
}

module.exports = {encrypt,decrypt}
