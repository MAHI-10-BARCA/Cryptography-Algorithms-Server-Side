/**
 * 16. AES (Advanced Encryption Standard)
 * Uses Node.js built-in crypto module (real AES-256-GCM)
 */

const crypto = require('crypto');

function aesEncrypt(plaintext, password) {
  const key = crypto.createHash('sha256').update(password).digest();
  const iv = crypto.randomBytes(12); // GCM recommended 12 bytes
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return {
    ciphertext: encrypted,
    iv: iv.toString('hex'),
    authTag
  };
}

function aesDecrypt(ciphertext, password, ivHex, authTagHex) {
  const key = crypto.createHash('sha256').update(password).digest();
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function handler(req, res) {
  try {
    const { text, password = 'secretpassword', mode = 'encrypt', iv, authTag } = req.body;
    if (!text) return res.status(400).json({ error: 'Provide text' });

    if (mode === 'encrypt') {
      const result = aesEncrypt(text, password);
      return res.json({
        algorithm: 'AES-256-GCM',
        inputs: { mode, passwordProvided: true },
        ...result,
        explanation: 'AES is the current standard symmetric block cipher (128-bit block, 128/192/256-bit keys). GCM mode provides confidentiality + authenticity.'
      });
    } else {
      if (!iv || !authTag) {
        return res.status(400).json({ error: 'For decrypt provide iv and authTag from previous encrypt' });
      }
      const plaintext = aesDecrypt(text, password, iv, authTag);
      return res.json({
        algorithm: 'AES-256-GCM',
        plaintext,
        mode: 'decrypt'
      });
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { aesEncrypt, aesDecrypt, handler };
