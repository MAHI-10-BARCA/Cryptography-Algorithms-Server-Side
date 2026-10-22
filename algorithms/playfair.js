/**
 * 4. Playfair Cipher - Digraph substitution using 5x5 key square
 */

function prepareKey(key) {
  key = key.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  const seen = new Set();
  let square = '';
  for (const c of key + 'ABCDEFGHIKLMNOPQRSTUVWXYZ') {
    if (!seen.has(c)) {
      seen.add(c);
      square += c;
    }
  }
  return square; // 25 chars
}

function prepareText(text, forEncrypt = true) {
  text = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  let prepared = '';
  for (let i = 0; i < text.length; i++) {
    prepared += text[i];
    if (forEncrypt && i + 1 < text.length && text[i] === text[i + 1]) {
      prepared += 'X';
    } else if (i + 1 < text.length) {
      prepared += text[++i];
    }
  }
  if (prepared.length % 2 !== 0) prepared += 'X';
  return prepared;
}

function playfair(text, key, mode = 'encrypt') {
  const square = prepareKey(key);
  const getPos = (c) => {
    const idx = square.indexOf(c);
    return [Math.floor(idx / 5), idx % 5];
  };
  const getChar = (r, c) => square[r * 5 + c];

  const prepared = prepareText(text, mode === 'encrypt');
  let result = '';

  for (let i = 0; i < prepared.length; i += 2) {
    const a = prepared[i], b = prepared[i + 1];
    const [r1, c1] = getPos(a);
    const [r2, c2] = getPos(b);

    if (r1 === r2) { // same row
      if (mode === 'encrypt') {
        result += getChar(r1, (c1 + 1) % 5) + getChar(r2, (c2 + 1) % 5);
      } else {
        result += getChar(r1, (c1 + 4) % 5) + getChar(r2, (c2 + 4) % 5);
      }
    } else if (c1 === c2) { // same column
      if (mode === 'encrypt') {
        result += getChar((r1 + 1) % 5, c1) + getChar((r2 + 1) % 5, c2);
      } else {
        result += getChar((r1 + 4) % 5, c1) + getChar((r2 + 4) % 5, c2);
      }
    } else { // rectangle
      result += getChar(r1, c2) + getChar(r2, c1);
    }
  }
  return result;
}

function handler(req, res) {
  try {
    const { text, key = 'MONARCHY', mode = 'encrypt' } = req.body;
    if (!text) return res.status(400).json({ error: 'Provide text' });

    const result = playfair(text, key, mode);
    res.json({
      algorithm: 'Playfair Cipher',
      inputs: { text, key, mode },
      result,
      keySquare: prepareKey(key).match(/.{1,5}/g),
      explanation: 'Encrypts digraphs (pairs of letters) using a 5x5 key square. Rules: same row/column shift, otherwise form rectangle.'
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { playfair, handler };
