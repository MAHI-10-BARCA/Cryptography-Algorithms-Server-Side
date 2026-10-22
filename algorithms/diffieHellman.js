/**
 * 18. Diffie–Hellman Key Exchange
 */

const crypto = require('crypto');

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

function dhGenerateParams(primeBits = 256) {
  // Use Node's DiffieHellman for proper params
  const dh = crypto.createDiffieHellman(primeBits);
  dh.generateKeys();
  return {
    prime: dh.getPrime('hex'),
    generator: dh.getGenerator('hex'),
    publicKey: dh.getPublicKey('hex'),
    privateKey: dh.getPrivateKey('hex'), // keep secret!
    dhObjectNote: 'In real use keep privateKey secret and only share publicKey + params'
  };
}

function dhComputeSecret(primeHex, generatorHex, privateKeyHex, otherPublicKeyHex) {
  const dh = crypto.createDiffieHellman(Buffer.from(primeHex, 'hex'), Buffer.from(generatorHex, 'hex'));
  dh.setPrivateKey(Buffer.from(privateKeyHex, 'hex'));
  const secret = dh.computeSecret(Buffer.from(otherPublicKeyHex, 'hex'));
  return secret.toString('hex');
}

// Pure educational small numbers
function toyDH(p = 23n, g = 5n, a = 6n, b = 15n) {
  // Alice: A = g^a mod p
  const A = modPow(g, a, p);
  // Bob: B = g^b mod p
  const B = modPow(g, b, p);
  // Shared secret
  const secretAlice = modPow(B, a, p);
  const secretBob = modPow(A, b, p);
  return {
    p: p.toString(), g: g.toString(),
    alicePrivate: a.toString(), alicePublic: A.toString(),
    bobPrivate: b.toString(), bobPublic: B.toString(),
    sharedSecretAlice: secretAlice.toString(),
    sharedSecretBob: secretBob.toString(),
    match: secretAlice === secretBob
  };
}

function handler(req, res) {
  try {
    const { action = 'toy', primeBits = 256, prime, generator, privateKey, otherPublicKey } = req.body;

    if (action === 'generate') {
      const params = dhGenerateParams(Number(primeBits));
      return res.json({
        algorithm: 'Diffie–Hellman Key Exchange',
        action: 'generate',
        ...params,
        explanation: 'Alice and Bob agree on public p (prime) and g (generator). Each chooses private x, publishes g^x mod p. Shared secret = (g^y)^x = (g^x)^y mod p.'
      });
    }

    if (action === 'compute') {
      if (!prime || !generator || !privateKey || !otherPublicKey) {
        return res.status(400).json({ error: 'Provide prime, generator, privateKey, otherPublicKey (all hex)' });
      }
      const secret = dhComputeSecret(prime, generator, privateKey, otherPublicKey);
      return res.json({ algorithm: 'Diffie–Hellman', sharedSecret: secret });
    }

    // Default educational toy
    const result = toyDH();
    res.json({
      algorithm: 'Diffie–Hellman (Toy Example)',
      ...result,
      explanation: 'Classic small numbers example: p=23, g=5. Alice a=6 → A=8, Bob b=15 → B=19. Shared secret = 2.'
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { handler, toyDH, modPow };
