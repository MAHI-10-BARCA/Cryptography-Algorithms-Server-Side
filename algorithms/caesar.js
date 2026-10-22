/**
 * 3. Caesar Cipher - Classic shift cipher
 */

function caesarCipher(text, shift, mode = 'encrypt') {
  shift = Number(shift) % 26;
  if (mode === 'decrypt') shift = (26 - shift) % 26;

  return text
    .split('')
    .map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const base = code >= 65 && code <= 90 ? 65 : 97;
        return String.fromCharCode(((code - base + shift) % 26) + base);
      }
      return char;
    })
    .join('');
}

function handler(req, res) {
  try {
    const { text, shift = 3, mode = 'encrypt' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Provide text' });
    }
    const result = caesarCipher(text, shift, mode);
    res.json({
      algorithm: 'Caesar Cipher',
      inputs: { text, shift: Number(shift), mode },
      result,
      explanation: 'Each letter is shifted by a fixed number of positions in the alphabet. Shift 3 was used by Julius Caesar.'
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = { caesarCipher, handler };
