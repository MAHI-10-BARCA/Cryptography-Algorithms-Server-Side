/**
 * 6. Affine Cipher
 * Encryption: C = (a*P + b) mod 26
 * Decryption: P = a_inv * (C - b) mod 26
 * a must be coprime with 26
 */

const { modInverse } = require('./extendedEuclidean');
const { isCoprime } = require('./coprime');

function affineEncrypt(text, a, b) {
  a = Number(a); b = Number(b);
  if (!isCoprime(a, 26)) throw new Error('a must be coprime with 26');
  return text.split('').map(char => {
    if (/[a-zA-Z]/.test(char)) {
      const base = char === char.toUpperCase() ? 65 : 97;
      const p = char.charCodeAt(0) - base;
      const c = (a * p + b) % 26;
      return String.fromCharCode(c + base);
    }
    return char;
  }).join('');
}

function affineDecrypt(text, a, b) {
  a = Number(a); b = Number(b);
  const aInv = modInverse(a, 26);
  if (aInv === null) throw new Error('Modular inverse of a does not exist');
  return text.split('').map(char => {
    if (/[a-zA-Z]/.test(char)) {
      const base = char === char.toUpperCase() ? 65 : 97;
      const c = char.charCodeAt(0) - base;
      let p = (aInv * (c - b)) % 26;
      if (p < 0) p += 26;
      return String.fromCharCode(p + base);
    }
    return char;
  }).join('');
}

function handler(req, res) {
  try {
    const { text, a = 5, b = 8, mode = 'encrypt' } = req.body;
    if (!text) return res.status(400).json({ error: 'Provide text' });

    const result = mode === 'decrypt'
      ? affineDecrypt(text, a, b)
      : affineEncrypt(text, a, b);

    res.json({
      algorithm: 'Affine Cipher',
      inputs: { text, a: Number(a), b: Number(b), mode },
      result,
      explanation: 'C = (a*P + b) mod 26. a must be coprime to 26 so that inverse exists for decryption.'
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { affineEncrypt, affineDecrypt, handler };
