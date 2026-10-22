/**
 * 9. Columnar Transposition Cipher
 */

function columnarEncrypt(text, key) {
  text = text.toUpperCase().replace(/[^A-Z]/g, '');
  key = key.toUpperCase();
  const cols = key.length;
  const rows = Math.ceil(text.length / cols);
  // Pad with X
  while (text.length < rows * cols) text += 'X';

  // Create grid row-wise
  const grid = [];
  for (let r = 0; r < rows; r++) {
    grid.push(text.slice(r * cols, (r + 1) * cols).split(''));
  }

  // Order of columns by sorted key
  const order = key.split('').map((c, i) => ({ c, i }))
    .sort((a, b) => a.c.localeCompare(b.c) || a.i - b.i)
    .map(o => o.i);

  let result = '';
  for (const col of order) {
    for (let r = 0; r < rows; r++) {
      result += grid[r][col];
    }
  }
  return result;
}

function columnarDecrypt(cipher, key) {
  key = key.toUpperCase();
  const cols = key.length;
  const rows = Math.ceil(cipher.length / cols);
  const order = key.split('').map((c, i) => ({ c, i }))
    .sort((a, b) => a.c.localeCompare(b.c) || a.i - b.i)
    .map(o => o.i);

  // Place cipher into columns in order
  const grid = Array.from({ length: rows }, () => Array(cols).fill(''));
  let idx = 0;
  for (const col of order) {
    for (let r = 0; r < rows; r++) {
      grid[r][col] = cipher[idx++];
    }
  }

  let result = '';
  for (let r = 0; r < rows; r++) {
    result += grid[r].join('');
  }
  return result.replace(/X+$/, ''); // remove padding (simple)
}

function handler(req, res) {
  try {
    const { text, key = 'HACK', mode = 'encrypt' } = req.body;
    if (!text || !key) return res.status(400).json({ error: 'Provide text and key' });

    const result = mode === 'decrypt'
      ? columnarDecrypt(text, key)
      : columnarEncrypt(text, key);

    res.json({
      algorithm: 'Columnar Transposition',
      inputs: { text, key, mode },
      result,
      explanation: 'Write plaintext in rows under the key. Read columns in alphabetical order of the key letters.'
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { columnarEncrypt, columnarDecrypt, handler };
