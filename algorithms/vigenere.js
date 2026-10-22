/**
 * 7. Vigenère Cipher - Polyalphabetic substitution using a keyword
 */

function vigenere(text, key, mode = 'encrypt') {
  key = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!key) throw new Error('Key must contain letters');

  let keyIndex = 0;
  return text.split('').map(char => {
    if (/[a-zA-Z]/.test(char)) {
      const base = char === char.toUpperCase() ? 65 : 97;
      const p = char.charCodeAt(0) - base;
      const k = key.charCodeAt(keyIndex % key.length) - 65;
      keyIndex++;
      let c;
      if (mode === 'encrypt') {
        c = (p + k) % 26;
      } else {
        c = (p - k + 26) % 26;
      }
      return String.fromCharCode(c + base);
    }
    return char;
  }).join('');
}

function handler(req, res) {
  try {
    const { text, key, mode = 'encrypt' } = req.body;
    if (!text || !key) return res.status(400).json({ error: 'Provide text and key' });

    const result = vigenere(text, key, mode);
    res.json({
      algorithm: 'Vigenère Cipher',
      inputs: { text, key, mode },
      result,
      explanation: 'Uses a repeating keyword. Each letter of the plaintext is shifted by the corresponding key letter (A=0 ... Z=25).'
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { vigenere, handler };
