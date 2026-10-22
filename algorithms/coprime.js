/**
 * 2. Co-prime - Two numbers are co-prime if GCD is 1
 */

const { gcd } = require('./gcd');

function isCoprime(a, b) {
  return gcd(a, b) === 1;
}

function handler(req, res) {
  try {
    const { a, b } = req.body;
    if (a === undefined || b === undefined) {
      return res.status(400).json({ error: 'Provide a and b as numbers' });
    }
    const result = isCoprime(a, b);
    const g = gcd(a, b);
    res.json({
      algorithm: 'Co-prime Check',
      inputs: { a: Number(a), b: Number(b) },
      gcd: g,
      isCoprime: result,
      explanation: 'Two integers are co-prime (relatively prime) if their greatest common divisor is 1.'
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = { isCoprime, handler };
