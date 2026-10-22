/**
 * 5. Hill Cipher - Matrix multiplication based polygraphic cipher
 * Uses 2x2 matrix for simplicity (can be extended)
 */

const { modInverse } = require('./extendedEuclidean');

function mod(n, m) {
  return ((n % m) + m) % m;
}

function matrixMultiply(vec, keyMatrix, modN = 26) {
  const n = keyMatrix.length;
  const result = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      result[i] += keyMatrix[i][j] * vec[j];
    }
    result[i] = mod(result[i], modN);
  }
  return result;
}

function determinant2x2(m) {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

function inverseMatrix2x2(m) {
  const det = mod(determinant2x2(m), 26);
  const detInv = modInverse(det, 26);
  if (detInv === null) throw new Error('Key matrix is not invertible mod 26');
  return [
    [mod(m[1][1] * detInv, 26), mod(-m[0][1] * detInv, 26)],
    [mod(-m[1][0] * detInv, 26), mod(m[0][0] * detInv, 26)]
  ];
}

function hillCipher(text, keyMatrix, mode = 'encrypt') {
  text = text.toUpperCase().replace(/[^A-Z]/g, '');
  const n = keyMatrix.length;
  while (text.length % n !== 0) text += 'X';

  let matrix = keyMatrix;
  if (mode === 'decrypt') {
    matrix = inverseMatrix2x2(keyMatrix);
  }

  let result = '';
  for (let i = 0; i < text.length; i += n) {
    const vec = [];
    for (let j = 0; j < n; j++) {
      vec.push(text.charCodeAt(i + j) - 65);
    }
    const encrypted = matrixMultiply(vec, matrix);
    for (const v of encrypted) {
      result += String.fromCharCode(v + 65);
    }
  }
  return result;
}

function handler(req, res) {
  try {
    const { text, key = [[3, 3], [2, 5]], mode = 'encrypt' } = req.body;
    if (!text) return res.status(400).json({ error: 'Provide text' });

    // Validate key is 2x2 for this educational version
    if (!Array.isArray(key) || key.length !== 2 || key[0].length !== 2) {
      return res.status(400).json({ error: 'Key must be a 2x2 matrix, e.g. [[3,3],[2,5]]' });
    }

    const result = hillCipher(text, key, mode);
    res.json({
      algorithm: 'Hill Cipher (2x2)',
      inputs: { text, key, mode },
      result,
      explanation: 'Encrypts blocks of letters as vectors multiplied by a key matrix modulo 26. Requires invertible matrix.'
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { hillCipher, handler };
