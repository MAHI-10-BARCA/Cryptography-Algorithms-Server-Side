/**
 * 21. Miller–Rabin Primality Test
 * Stronger probabilistic test than Fermat
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

function millerRabinTest(n, k = 5) {
  n = BigInt(n);
  if (n <= 1n) return { isProbablyPrime: false, reason: 'n <= 1' };
  if (n <= 3n) return { isProbablyPrime: true, reason: 'n is 2 or 3' };
  if (n % 2n === 0n) return { isProbablyPrime: false, reason: 'even' };

  // Write n-1 = 2^s * d
  let s = 0n;
  let d = n - 1n;
  while (d % 2n === 0n) {
    d /= 2n;
    s++;
  }

  const witnesses = [];
  for (let i = 0; i < k; i++) {
    const a = 2n + BigInt(Math.floor(Math.random() * Number(n - 3n > 1000000n ? 1000000n : n - 3n)));
    let x = modPow(a, d, n);
    witnesses.push({ a: a.toString(), x0: x.toString() });

    if (x === 1n || x === n - 1n) continue;

    let composite = true;
    for (let r = 1n; r < s; r++) {
      x = modPow(x, 2n, n);
      if (x === n - 1n) {
        composite = false;
        break;
      }
    }
    if (composite) {
      return {
        isProbablyPrime: false,
        reason: `Miller-Rabin witness found: a=${a}`,
        s: s.toString(),
        d: d.toString(),
        witnesses
      };
    }
  }

  return {
    isProbablyPrime: true,
    reason: `Passed ${k} Miller-Rabin rounds (error probability < 4^(-k))`,
    s: s.toString(),
    d: d.toString(),
    witnesses,
    note: 'Very strong probabilistic test. For deterministic results with small n, specific witness sets exist.'
  };
}

function handler(req, res) {
  try {
    const { n, k = 5 } = req.body;
    if (n === undefined) return res.status(400).json({ error: 'Provide n (number to test)' });

    const result = millerRabinTest(n, Number(k));
    res.json({
      algorithm: 'Miller–Rabin Primality Test',
      input: n.toString(),
      trials: Number(k),
      ...result,
      explanation: 'Write n-1 = 2^s * d. For random a, compute a^d mod n. Then square up to s times checking for n-1. If neither 1 nor -1 appears appropriately, n is composite.'
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { millerRabinTest, handler };
