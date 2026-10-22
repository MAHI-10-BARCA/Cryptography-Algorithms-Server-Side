/**
 * 1. GCD (Greatest Common Divisor) - Euclidean Algorithm
 * Server-side implementation
 */

function gcd(a, b) {
  a = Math.abs(Number(a));
  b = Math.abs(Number(b));
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function handler(req, res) {
  try {
    const { a, b } = req.body;
    if (a === undefined || b === undefined) {
      return res.status(400).json({ error: 'Provide a and b as numbers' });
    }
    const result = gcd(a, b);
    res.json({
      algorithm: 'GCD (Euclidean Algorithm)',
      inputs: { a: Number(a), b: Number(b) },
      gcd: result,
      explanation: 'Repeatedly replace (a, b) with (b, a % b) until b is 0. The remaining a is the GCD.'
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = { gcd, handler };
