/**
 * 11. Extended Euclidean Algorithm
 * Finds gcd(a,b) and integers x,y such that ax + by = gcd(a,b)
 * Also used to find modular inverse.
 */

function extendedGcd(a, b) {
  a = Number(a);
  b = Number(b);
  if (b === 0) {
    return { gcd: a, x: 1, y: 0 };
  }
  const { gcd, x: x1, y: y1 } = extendedGcd(b, a % b);
  const x = y1;
  const y = x1 - Math.floor(a / b) * y1;
  return { gcd, x, y };
}

function modInverse(a, m) {
  const { gcd, x } = extendedGcd(a, m);
  if (gcd !== 1) return null; // inverse does not exist
  return ((x % m) + m) % m;
}

function handler(req, res) {
  try {
    const { a, b, action = 'extended' } = req.body;
    if (a === undefined || b === undefined) {
      return res.status(400).json({ error: 'Provide a and b' });
    }

    if (action === 'inverse') {
      const inv = modInverse(a, b);
      if (inv === null) {
        return res.json({
          algorithm: 'Modular Inverse (Extended Euclidean)',
          inputs: { a: Number(a), modulus: Number(b) },
          inverse: null,
          message: 'Modular inverse does not exist (gcd != 1)'
        });
      }
      return res.json({
        algorithm: 'Modular Inverse (Extended Euclidean)',
        inputs: { a: Number(a), modulus: Number(b) },
        inverse: inv,
        verification: (Number(a) * inv) % Number(b) === 1
      });
    }

    const result = extendedGcd(a, b);
    res.json({
      algorithm: 'Extended Euclidean Algorithm',
      inputs: { a: Number(a), b: Number(b) },
      gcd: result.gcd,
      x: result.x,
      y: result.y,
      equation: `${a}*${result.x} + ${b}*${result.y} = ${result.gcd}`,
      explanation: 'Finds integers x, y such that a*x + b*y = gcd(a,b). Essential for modular inverses in RSA etc.'
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = { extendedGcd, modInverse, handler };
