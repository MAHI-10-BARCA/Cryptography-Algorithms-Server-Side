/**
 * 12. Cryptanalytic Attack - Simple frequency analysis & brute-force Caesar
 */

const ENGLISH_FREQ = {
  A: 8.2, B: 1.5, C: 2.8, D: 4.3, E: 13.0, F: 2.2, G: 2.0, H: 6.1,
  I: 7.0, J: 0.15, K: 0.77, L: 4.0, M: 2.4, N: 6.7, O: 7.5, P: 1.9,
  Q: 0.095, R: 6.0, S: 6.3, T: 9.1, U: 2.8, V: 0.98, W: 2.4, X: 0.15,
  Y: 2.0, Z: 0.074
};

function frequencyAnalysis(text) {
  text = text.toUpperCase().replace(/[^A-Z]/g, '');
  const counts = {};
  for (const c of text) counts[c] = (counts[c] || 0) + 1;
  const total = text.length || 1;
  const freq = {};
  for (const c in counts) {
    freq[c] = ((counts[c] / total) * 100).toFixed(2);
  }
  // Sort by frequency descending
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  return { frequencies: freq, sorted, totalLetters: total };
}

function bruteForceCaesar(cipher) {
  const results = [];
  for (let shift = 0; shift < 26; shift++) {
    let plain = '';
    for (const char of cipher) {
      if (/[a-zA-Z]/.test(char)) {
        const base = char === char.toUpperCase() ? 65 : 97;
        plain += String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base);
      } else {
        plain += char;
      }
    }
    results.push({ shift, plaintext: plain });
  }
  return results;
}

function handler(req, res) {
  try {
    const { text, attack = 'frequency' } = req.body;
    if (!text) return res.status(400).json({ error: 'Provide text (ciphertext)' });

    if (attack === 'bruteforce-caesar') {
      const results = bruteForceCaesar(text);
      return res.json({
        algorithm: 'Cryptanalytic Attack - Brute Force Caesar',
        inputs: { text },
        results,
        explanation: 'Try all 26 possible shifts. Useful when the cipher is known to be Caesar.'
      });
    }

    // Default: frequency analysis
    const analysis = frequencyAnalysis(text);
    res.json({
      algorithm: 'Cryptanalytic Attack - Frequency Analysis',
      inputs: { text },
      ...analysis,
      expectedEnglish: ENGLISH_FREQ,
      explanation: 'Compare letter frequencies of ciphertext with English language frequencies. Most frequent letter often corresponds to E, then T, A, etc.'
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = { frequencyAnalysis, bruteForceCaesar, handler };
