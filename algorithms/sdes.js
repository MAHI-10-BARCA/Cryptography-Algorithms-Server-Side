/**
 * 13. S-DES (Simplified DES) - Educational 8-bit block cipher
 * Based on classic S-DES teaching version (key 10 bits, block 8 bits)
 */

// Permutation tables
const P10 = [3, 5, 2, 7, 4, 10, 1, 9, 8, 6];
const P8 = [6, 3, 7, 4, 8, 5, 10, 9];
const IP = [2, 6, 3, 1, 4, 8, 5, 7];
const IP_INV = [4, 1, 3, 5, 7, 2, 8, 6];
const EP = [4, 1, 2, 3, 2, 3, 4, 1];
const P4 = [2, 4, 3, 1];

const S0 = [
  [1, 0, 3, 2],
  [3, 2, 1, 0],
  [0, 2, 1, 3],
  [3, 1, 3, 2]
];
const S1 = [
  [0, 1, 2, 3],
  [2, 0, 1, 3],
  [3, 0, 1, 0],
  [2, 1, 0, 3]
];

function permute(bits, table) {
  return table.map(i => bits[i - 1]).join('');
}

function leftShift(bits, n) {
  return bits.slice(n) + bits.slice(0, n);
}

function xor(a, b) {
  let r = '';
  for (let i = 0; i < a.length; i++) r += a[i] === b[i] ? '0' : '1';
  return r;
}

function sbox(bits, box) {
  const row = parseInt(bits[0] + bits[3], 2);
  const col = parseInt(bits[1] + bits[2], 2);
  return box[row][col].toString(2).padStart(2, '0');
}

function generateKeys(key10) {
  // key10 is 10-bit string
  let p10 = permute(key10, P10);
  let ls1 = leftShift(p10.slice(0, 5), 1) + leftShift(p10.slice(5), 1);
  const k1 = permute(ls1, P8);
  let ls2 = leftShift(ls1.slice(0, 5), 2) + leftShift(ls1.slice(5), 2);
  const k2 = permute(ls2, P8);
  return { k1, k2 };
}

function f(right, key) {
  const expanded = permute(right, EP);
  const xored = xor(expanded, key);
  const s0 = sbox(xored.slice(0, 4), S0);
  const s1 = sbox(xored.slice(4), S1);
  return permute(s0 + s1, P4);
}

function sdesEncrypt(plain8, key10) {
  const { k1, k2 } = generateKeys(key10);
  let ip = permute(plain8, IP);
  let left = ip.slice(0, 4), right = ip.slice(4);

  // Round 1
  let f1 = f(right, k1);
  let newRight = xor(left, f1);
  left = right;
  right = newRight;

  // Round 2
  let f2 = f(right, k2);
  newRight = xor(left, f2);
  left = right;
  right = newRight;

  // Switch and final IP inverse
  const preoutput = right + left;
  return permute(preoutput, IP_INV);
}

function sdesDecrypt(cipher8, key10) {
  const { k1, k2 } = generateKeys(key10);
  let ip = permute(cipher8, IP);
  let left = ip.slice(0, 4), right = ip.slice(4);

  // Round 1 with k2
  let f1 = f(right, k2);
  let newRight = xor(left, f1);
  left = right;
  right = newRight;

  // Round 2 with k1
  let f2 = f(right, k1);
  newRight = xor(left, f2);
  left = right;
  right = newRight;

  const preoutput = right + left;
  return permute(preoutput, IP_INV);
}

function handler(req, res) {
  try {
    const { plaintext, ciphertext, key, mode = 'encrypt' } = req.body;
    // key should be 10-bit binary string, plaintext/ciphertext 8-bit
    if (!key || key.length !== 10 || !/^[01]+$/.test(key)) {
      return res.status(400).json({ error: 'key must be 10-bit binary string e.g. "1010000010"' });
    }

    if (mode === 'encrypt') {
      if (!plaintext || plaintext.length !== 8 || !/^[01]+$/.test(plaintext)) {
        return res.status(400).json({ error: 'plaintext must be 8-bit binary string' });
      }
      const result = sdesEncrypt(plaintext, key);
      return res.json({
        algorithm: 'S-DES (Simplified DES)',
        inputs: { plaintext, key, mode },
        ciphertext: result,
        explanation: 'Educational 8-bit block cipher with 10-bit key, 2 rounds. Used for teaching Feistel structure of DES.'
      });
    } else {
      if (!ciphertext || ciphertext.length !== 8 || !/^[01]+$/.test(ciphertext)) {
        return res.status(400).json({ error: 'ciphertext must be 8-bit binary string' });
      }
      const result = sdesDecrypt(ciphertext, key);
      return res.json({
        algorithm: 'S-DES (Simplified DES)',
        inputs: { ciphertext, key, mode },
        plaintext: result
      });
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { sdesEncrypt, sdesDecrypt, generateKeys, handler };
