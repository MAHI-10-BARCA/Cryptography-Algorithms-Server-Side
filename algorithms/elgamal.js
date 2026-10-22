/**
 * 19. ElGamal Public-Key Encryption
 * Educational implementation with BigInt
 */

function modPow(base, exp, mod) {
  base = BigInt(base); exp = BigInt(exp); mod = BigInt(mod);
  let result = 1n;
  base %= mod;
  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % mod;
    base = (base * base) % mod;
    exp >>= 1n;
  }
  return result;
}

function modInverse(a, m) {
  // Extended Euclidean BigInt
  a = ((a % m) + m) % m;
  let [old_r, r] = [a, m];
  let [old_s, s] = [1n, 0n];
  while (r !== 0n) {
    const q = old_r / r;
    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s];
  }
  if (old_r !== 1n) throw new Error('No inverse');
  return ((old_s % m) + m) % m;
}

function elgamalGenerate(p = 23n, g = 5n, x = 6n) {
  // Private key x, public y = g^x mod p
  const y = modPow(g, x, p);
  return {
    p: p.toString(),
    g: g.toString(),
    privateKey: x.toString(),
    publicKey: y.toString()
  };
}

function elgamalEncrypt(m, p, g, y, k = null) {
  p = BigInt(p); g = BigInt(g); y = BigInt(y); m = BigInt(m);
  // Ephemeral k (must be random and kept secret)
  if (!k) k = BigInt(Math.floor(Math.random() * (Number(p) - 2)) + 1);
  else k = BigInt(k);
  const c1 = modPow(g, k, p);
  const c2 = (m * modPow(y, k, p)) % p;
  return { c1: c1.toString(), c2: c2.toString(), kUsed: k.toString() };
}

function elgamalDecrypt(c1, c2, p, x) {
  p = BigInt(p); c1 = BigInt(c1); c2 = BigInt(c2); x = BigInt(x);
  // s = c1^x mod p
  const s = modPow(c1, x, p);
  const sInv = modInverse(s, p);
  const m = (c2 * sInv) % p;
  return m.toString();
}

function handler(req, res) {
  try {
    const { action = 'demo', message = 7, p = 23, g = 5, privateKey = 6, publicKey, c1, c2, k } = req.body;

    if (action === 'generate') {
      const keys = elgamalGenerate(BigInt(p), BigInt(g), BigInt(privateKey));
      return res.json({
        algorithm: 'ElGamal',
        ...keys,
        explanation: 'Choose prime p, generator g, private x. Public y = g^x mod p. Encrypt: choose random k, c1=g^k, c2=m*y^k. Decrypt: m = c2 * (c1^x)^-1 mod p.'
      });
    }

    if (action === 'encrypt') {
      if (publicKey === undefined) return res.status(400).json({ error: 'Provide publicKey (y)' });
      const result = elgamalEncrypt(message, p, g, publicKey, k);
      return res.json({ algorithm: 'ElGamal Encrypt', plaintext: message, ...result });
    }

    if (action === 'decrypt') {
      if (c1 === undefined || c2 === undefined) return res.status(400).json({ error: 'Provide c1 and c2' });
      const plaintext = elgamalDecrypt(c1, c2, p, privateKey);
      return res.json({ algorithm: 'ElGamal Decrypt', plaintext });
    }

    // Full demo
    const keys = elgamalGenerate();
    const enc = elgamalEncrypt(message, keys.p, keys.g, keys.publicKey);
    const dec = elgamalDecrypt(enc.c1, enc.c2, keys.p, keys.privateKey);
    res.json({
      algorithm: 'ElGamal (Full Demo)',
      keys,
      message,
      ciphertext: { c1: enc.c1, c2: enc.c2 },
      decrypted: dec,
      success: dec === String(message)
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { elgamalGenerate, elgamalEncrypt, elgamalDecrypt, handler };
