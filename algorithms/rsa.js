/**
 * 17. RSA Public-Key Cryptosystem
 * Educational implementation with small keys (for larger use Node crypto)
 */

const crypto = require('crypto');
const { extendedGcd, modInverse } = require('./extendedEuclidean');

function modPow(base, exp, mod) {
  base = BigInt(base); exp = BigInt(exp); mod = BigInt(mod);
  let result = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) result = (result * base) % mod;
    exp = exp >> 1n;
    base = (base * base) % mod;
  }
  return result;
}

function generateRSAKeys(bits = 512) {
  // Use Node crypto for proper key generation (educational pure JS with small primes is insecure)
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: bits,
    publicExponent: 0x10001,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });
  return { publicKey, privateKey, bits };
}

function rsaEncrypt(plaintext, publicKeyPem) {
  const encrypted = crypto.publicEncrypt(
    { key: publicKeyPem, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
    Buffer.from(plaintext, 'utf8')
  );
  return encrypted.toString('base64');
}

function rsaDecrypt(ciphertextBase64, privateKeyPem) {
  const decrypted = crypto.privateDecrypt(
    { key: privateKeyPem, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
    Buffer.from(ciphertextBase64, 'base64')
  );
  return decrypted.toString('utf8');
}

// Pure educational small RSA (toy example)
function toyRSAGenerate(p, q, e = 65537n) {
  p = BigInt(p); q = BigInt(q);
  const n = p * q;
  const phi = (p - 1n) * (q - 1n);
  // Ensure e is coprime to phi
  let ee = BigInt(e);
  while (extendedGcd(Number(ee % 1000000n), Number(phi % 1000000n)).gcd !== 1) {
    ee += 2n;
  }
  const d = BigInt(modInverse(Number(ee % phi), Number(phi)) || 0); // simplified for small
  // Better pure inverse for BigInt
  const dBig = modInverseBig(ee, phi);
  return { n: n.toString(), e: ee.toString(), d: dBig.toString(), p: p.toString(), q: q.toString() };
}

function modInverseBig(a, m) {
  // Extended Euclidean for BigInt
  let [old_r, r] = [a, m];
  let [old_s, s] = [1n, 0n];
  while (r !== 0n) {
    const q = old_r / r;
    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s];
  }
  if (old_r !== 1n) return null;
  return ((old_s % m) + m) % m;
}

function handler(req, res) {
  try {
    const { action = 'generate', text, publicKey, privateKey, bits = 512, p, q } = req.body;

    if (action === 'generate') {
      const keys = generateRSAKeys(Number(bits));
      return res.json({
        algorithm: 'RSA',
        action: 'generate',
        ...keys,
        explanation: 'RSA: choose primes p,q; n=pq; φ=(p-1)(q-1); choose e coprime to φ; d = e⁻¹ mod φ. Public (n,e), private (n,d).'
      });
    }

    if (action === 'encrypt') {
      if (!text || !publicKey) return res.status(400).json({ error: 'Provide text and publicKey (PEM)' });
      const ciphertext = rsaEncrypt(text, publicKey);
      return res.json({ algorithm: 'RSA', action: 'encrypt', ciphertext });
    }

    if (action === 'decrypt') {
      if (!text || !privateKey) return res.status(400).json({ error: 'Provide ciphertext (text) and privateKey (PEM)' });
      const plaintext = rsaDecrypt(text, privateKey);
      return res.json({ algorithm: 'RSA', action: 'decrypt', plaintext });
    }

    if (action === 'toy') {
      // Small educational example
      const keys = toyRSAGenerate(p || 61, q || 53, 17n);
      return res.json({
        algorithm: 'RSA (Toy / Educational)',
        keys,
        note: 'Extremely small primes for illustration only. Never use small keys in practice.'
      });
    }

    res.status(400).json({ error: 'action must be generate | encrypt | decrypt | toy' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { generateRSAKeys, rsaEncrypt, rsaDecrypt, handler };
