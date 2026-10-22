/**
 * 10. Row Transposition Cipher
 * Write plaintext in rows, rearrange rows according to a key order, read by columns or rows.
 * Educational simple version: rearrange rows based on key permutation.
 */

function rowTranspositionEncrypt(text, key) {
  text = text.toUpperCase().replace(/[^A-Z]/g, '');
  const cols = key.length;
  const rows = Math.ceil(text.length / cols);
  while (text.length < rows * cols) text += 'X';

  // Create row grid
  const grid = [];
  for (let r = 0; r < rows; r++) {
    grid.push(text.slice(r * cols, (r + 1) * cols));
  }

  // Sort rows by key order (using key as permutation of row indices if possible, else simple cyclic)
  // For simplicity we use key characters to decide row order
  const order = key.toUpperCase().split('').map((c, i) => ({ c, i }))
    .sort((a, b) => a.c.localeCompare(b.c) || a.i - b.i)
    .map(o => o.i % rows);

  // Unique-ify order for rows
  const seen = new Set();
  const rowOrder = [];
  for (const o of order) {
    if (!seen.has(o) && o < rows) {
      seen.add(o);
      rowOrder.push(o);
    }
  }
  for (let i = 0; i < rows; i++) {
    if (!seen.has(i)) rowOrder.push(i);
  }

  let result = '';
  for (const r of rowOrder) {
    result += grid[r];
  }
  return result;
}

function rowTranspositionDecrypt(cipher, key) {
  // Reverse of above - reconstruct original order
  const cols = key.length;
  const rows = Math.ceil(cipher.length / cols);
  const order = key.toUpperCase().split('').map((c, i) => ({ c, i }))
    .sort((a, b) => a.c.localeCompare(b.c) || a.i - b.i)
    .map(o => o.i % rows);

  const seen = new Set();
  const rowOrder = [];
  for (const o of order) {
    if (!seen.has(o) && o < rows) {
      seen.add(o);
      rowOrder.push(o);
    }
  }
  for (let i = 0; i < rows; i++) {
    if (!seen.has(i)) rowOrder.push(i);
  }

  // Inverse mapping
  const inv = new Array(rows);
  rowOrder.forEach((r, pos) => { inv[r] = pos; });

  const chunks = [];
  for (let i = 0; i < rows; i++) {
    chunks.push(cipher.slice(i * cols, (i + 1) * cols));
  }

  let result = '';
  for (let i = 0; i < rows; i++) {
    result += chunks[inv[i]];
  }
  return result.replace(/X+$/, '');
}

function handler(req, res) {
  try {
    const { text, key = 'HACK', mode = 'encrypt' } = req.body;
    if (!text || !key) return res.status(400).json({ error: 'Provide text and key' });

    const result = mode === 'decrypt'
      ? rowTranspositionDecrypt(text, key)
      : rowTranspositionEncrypt(text, key);

    res.json({
      algorithm: 'Row Transposition',
      inputs: { text, key, mode },
      result,
      explanation: 'Write text in a grid by rows. Rearrange the rows according to a key-derived order, then read out.'
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { rowTranspositionEncrypt, rowTranspositionDecrypt, handler };
