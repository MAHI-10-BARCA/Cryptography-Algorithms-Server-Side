/**
 * 8. Autokey Cipher
 * Similar to Vigenère but the key is extended using the plaintext itself.
 */

function autokey(text, key, mode = 'encrypt') {
  key = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!key) throw new Error('Key must contain letters');

  const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
  let fullKey;

  if (mode === 'encrypt') {
    fullKey = (key + cleanText).slice(0, cleanText.length);
  }

  let result = '';
  let keyIndex = 0;
  let decryptedSoFar = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (/[a-zA-Z]/.test(char)) {
      const base = char === char.toUpperCase() ? 65 : 97;
      const p = char.charCodeAt(0) - base;

      let k;
      if (mode === 'encrypt') {
        k = fullKey.charCodeAt(keyIndex) - 65;
      } else {
        // For decrypt, key is original key + previously decrypted letters
        if (keyIndex < key.length) {
          k = key.charCodeAt(keyIndex) - 65;
        } else {
          k = decryptedSoFar.charCodeAt(keyIndex - key.length) - 65;
        }
      }

      let c;
      if (mode === 'encrypt') {
        c = (p + k) % 26;
      } else {
        c = (p - k + 26) % 26;
        decryptedSoFar += String.fromCharCode(c + 65);
      }

      result += String.fromCharCode(c + base);
      keyIndex++;
    } else {
      result += char;
    }
  }
  return result;
}

function handler(req, res) {
  try {
    const { text, key, mode = 'encrypt' } = req.body;
    if (!text || !key) return res.status(400).json({ error: 'Provide text and key' });

    const result = autokey(text, key, mode);
    res.json({
      algorithm: 'Autokey Cipher',
      inputs: { text, key, mode },
      result,
      explanation: 'Like Vigenère, but after the primer key the plaintext (or previously decrypted text) is used as the continuing key stream.'
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { autokey, handler };
