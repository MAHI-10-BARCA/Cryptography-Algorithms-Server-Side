/**
 * 14. DES (Data Encryption Standard) - Educational overview + simplified steps
 * Full DES is complex; this provides key generation outline and notes.
 * For real DES use Node crypto (but DES is weak and deprecated).
 */

const crypto = require('crypto');

function educationalDESNotes() {
  return {
    blockSize: '64 bits',
    keySize: '56 bits effective (64 with parity)',
    rounds: 16,
    structure: 'Feistel network',
    steps: [
      '1. Initial Permutation (IP) of 64-bit block',
      '2. Split into L0 (32) and R0 (32)',
      '3. For i = 1 to 16:',
      '   - Expand R to 48 bits (E)',
      '   - XOR with round key Ki (48 bits)',
      '   - Pass through 8 S-boxes → 32 bits',
      '   - Permute with P',
      '   - Li = Ri-1, Ri = Li-1 XOR f(Ri-1, Ki)',
      '4. Final swap and Inverse IP'
    ],
    keySchedule: 'PC-1, 16 left shifts, PC-2 to generate 16 round keys',
    securityNote: 'DES is broken (brute force feasible). Use 3DES or AES instead.'
  };
}

function handler(req, res) {
  try {
    const { action = 'info', plaintext, key, mode = 'encrypt' } = req.body;

    if (action === 'info' || !plaintext) {
      return res.json({
        algorithm: 'DES (Data Encryption Standard) - Educational',
        ...educationalDESNotes(),
        note: 'For actual encryption use Node.js crypto.createCipheriv with "des-ede3" or better AES. DES single is insecure.'
      });
    }

    // Optional: demonstrate with Node crypto (using 3DES for slightly better demo)
    // Key must be 24 bytes for 3DES
    if (action === 'demo') {
      const keyBuf = crypto.createHash('sha256').update(String(key || 'defaultkey')).digest().slice(0, 24);
      const iv = Buffer.alloc(8, 0); // zero IV for demo only

      if (mode === 'encrypt') {
        const cipher = crypto.createCipheriv('des-ede3-cbc', keyBuf, iv);
        let encrypted = cipher.update(plaintext, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return res.json({
          algorithm: '3DES Demo (educational only)',
          ciphertext: encrypted,
          warning: 'Zero IV and weak key derivation - DEMO ONLY. Never use in production.'
        });
      } else {
        const decipher = crypto.createDecipheriv('des-ede3-cbc', keyBuf, iv);
        let decrypted = decipher.update(plaintext, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return res.json({
          algorithm: '3DES Demo (educational only)',
          plaintext: decrypted
        });
      }
    }

    res.json(educationalDESNotes());
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { handler };
