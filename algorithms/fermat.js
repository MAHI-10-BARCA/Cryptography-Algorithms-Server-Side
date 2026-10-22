/**
 * 20. Fermat Primality Test
 * Based on Fermat's Little Theorem: if p is prime and a not divisible by p,
 * then a^(p-1) ≡ 1 mod p
 */

function modPow(base, exp, mod) {
  base = BigInt(base); exp = BigInt(exp); mod = BigInt(mod);
  let result = 1n;
  base %= mod;
  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % mod;
    base = (base * base) % mod;
    exp >>= 1n;
  }
  return result;
}

function fermatTest(n, k = 5) {
  n = BigInt(n);
  if (n <= 1n) return { isProbablyPrime: false, reason: 'n <= 1' };
  if (n <= 3n) return { isProbablyPrime: true, reason: 'n is 2 or 3' };
  if (n % 2n === 0n) return { isProbablyPrime: false, reason: 'even' };

  const witnesses = [];
  for (let i = 0; i < k; i++) {
    // random a in [2, n-2]
    const a = 2n + BigInt(Math.floor(Math.random() * Number(n - 3n > 1000000n ? 1000000n : n - 3n)));
    const result = modPow(a, n - 1n, n);
    witnesses.push({ a: a.toString(), aPowNMinus1ModN: result.toString() });
    if (result !== 1n) {
      return {
        isProbablyPrime: false,
        reason: `Fermat witness found: a=${a}, a^(n-1) mod n = ${result} ≠ 1`,
        witnesses
      };
    }
  }
  return {
    isProbablyPrime: true,
    reason: `Passed ${k} Fermat tests (probabilistic)`,
    witnesses,
    note: 'Carmichael numbers can fool Fermat test. Prefer Miller-Rabin for higher confidence.'
  };
}

function handler(req, res) {
  try {
    const { n, k = 5 } = req.body;
    if (n === undefined) return res.status(400).json({ error: 'Provide n (number to test)' });

    const result = fermatTest(n, Number(k));
    res.json({
      algorithm: 'Fermat Primality Test',
      input: n.toString(),
      trials: Number(k),
      ...result,
      explanation: 'If n is prime, a^(n-1) ≡ 1 (mod n) for a not divisible by n. If this fails for any a, n is composite. Passing multiple tests suggests n is probably prime.'
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { fermatTest, handler };
