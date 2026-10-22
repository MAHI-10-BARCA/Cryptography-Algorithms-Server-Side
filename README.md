# Cryptography Algorithms - Server Side Programming

This repository contains **server-side** (Node.js + Express) implementations of 21 classic cryptography and number theory topics.

## Topics Covered

1. **GCD (Greatest Common Divisor)** - Euclidean algorithm
2. **Co-prime** - Check if two numbers are coprime
3. **Caesar Cipher** - Shift cipher encryption/decryption
4. **Playfair Cipher** - Digraph substitution cipher
5. **Hill Cipher** - Matrix-based polygraphic cipher
6. **Affine Cipher** - Linear congruence cipher
7. **Vigenère Cipher** - Polyalphabetic substitution
8. **Autokey Cipher** - Autokey variant of Vigenère
9. **Columnar Transposition** - Column rearrangement cipher
10. **Row Transposition** - Row-based transposition
11. **Extended Euclidean Algorithm** - Modular inverse & gcd with coefficients
12. **Cryptanalytic Attack** - Frequency analysis / brute force examples
13. **S-DES (Simplified DES)** - Educational 8-bit DES variant
14. **DES (Data Encryption Standard)** - Simplified educational DES steps
15. **Study of Cryptool** - Overview and educational notes on CrypTool
16. **AES (Advanced Encryption Standard)** - Using Node.js crypto module + explanation
17. **RSA** - Public-key encryption (key generation, encrypt, decrypt)
18. **Diffie–Hellman** - Key exchange protocol
19. **ElGamal** - Public-key encryption scheme
20. **Fermat Test** - Primality testing (Fermat's Little Theorem)
21. **Miller–Rabin Test** - Probabilistic primality test

## How to Run

```bash
npm install
npm start
```

Server runs on `http://localhost:3000`

## API Endpoints

All endpoints are **POST** (except health) and accept JSON body.

| Endpoint | Description |
|----------|-------------|
| `GET /` | Health / list of available endpoints |
| `POST /gcd` | Compute GCD |
| `POST /coprime` | Check coprime |
| `POST /caesar` | Caesar encrypt/decrypt |
| `POST /playfair` | Playfair |
| `POST /hill` | Hill Cipher |
| `POST /affine` | Affine Cipher |
| `POST /vigenere` | Vigenère |
| `POST /autokey` | Autokey |
| `POST /columnar` | Columnar Transposition |
| `POST /row-transposition` | Row Transposition |
| `POST /extended-euclidean` | Extended Euclidean |
| `POST /cryptanalysis` | Simple frequency analysis |
| `POST /sdes` | Simplified DES |
| `POST /des` | Educational DES steps |
| `POST /aes` | AES encrypt/decrypt |
| `POST /rsa` | RSA operations |
| `POST /diffie-hellman` | Diffie-Hellman key exchange |
| `POST /elgamal` | ElGamal |
| `POST /fermat` | Fermat primality test |
| `POST /miller-rabin` | Miller-Rabin test |
| `GET /cryptool` | CrypTool study notes |

## Example Requests

### GCD
```bash
curl -X POST http://localhost:3000/gcd -H "Content-Type: application/json" -d '{"a": 48, "b": 18}'
```

### Caesar Cipher
```bash
curl -X POST http://localhost:3000/caesar -H "Content-Type: application/json" -d '{"text": "HELLO", "shift": 3, "mode": "encrypt"}'
```

### RSA
```bash
curl -X POST http://localhost:3000/rsa -H "Content-Type: application/json" -d '{"action": "generate", "bits": 512}'
```

## Notes

- These are **educational implementations**. Do **not** use in production for real security.
- Full DES/AES use Node.js `crypto` where appropriate; S-DES and educational DES are pure JS for learning.
- All code is pure server-side JavaScript (Node.js).

## License

MIT
