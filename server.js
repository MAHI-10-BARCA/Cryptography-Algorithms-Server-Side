const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const gcd = require('./algorithms/gcd');
const coprime = require('./algorithms/coprime');
const caesar = require('./algorithms/caesar');
const playfair = require('./algorithms/playfair');
const hill = require('./algorithms/hill');
const affine = require('./algorithms/affine');
const vigenere = require('./algorithms/vigenere');
const autokey = require('./algorithms/autokey');
const columnar = require('./algorithms/columnar');
const rowTransposition = require('./algorithms/rowTransposition');
const extendedEuclidean = require('./algorithms/extendedEuclidean');
const cryptanalysis = require('./algorithms/cryptanalysis');
const sdes = require('./algorithms/sdes');
const des = require('./algorithms/des');
const aes = require('./algorithms/aes');
const rsa = require('./algorithms/rsa');
const diffieHellman = require('./algorithms/diffieHellman');
const elgamal = require('./algorithms/elgamal');
const fermat = require('./algorithms/fermat');
const millerRabin = require('./algorithms/millerRabin');
const cryptool = require('./algorithms/cryptool');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'Cryptography Algorithms Server-Side API',
    version: '1.0.0',
    endpoints: [
      'POST /gcd', 'POST /coprime', 'POST /caesar', 'POST /playfair',
      'POST /hill', 'POST /affine', 'POST /vigenere', 'POST /autokey',
      'POST /columnar', 'POST /row-transposition', 'POST /extended-euclidean',
      'POST /cryptanalysis', 'POST /sdes', 'POST /des', 'POST /aes',
      'POST /rsa', 'POST /diffie-hellman', 'POST /elgamal',
      'POST /fermat', 'POST /miller-rabin', 'GET /cryptool'
    ]
  });
});

app.post('/gcd', gcd.handler);
app.post('/coprime', coprime.handler);
app.post('/caesar', caesar.handler);
app.post('/playfair', playfair.handler);
app.post('/hill', hill.handler);
app.post('/affine', affine.handler);
app.post('/vigenere', vigenere.handler);
app.post('/autokey', autokey.handler);
app.post('/columnar', columnar.handler);
app.post('/row-transposition', rowTransposition.handler);
app.post('/extended-euclidean', extendedEuclidean.handler);
app.post('/cryptanalysis', cryptanalysis.handler);
app.post('/sdes', sdes.handler);
app.post('/des', des.handler);
app.post('/aes', aes.handler);
app.post('/rsa', rsa.handler);
app.post('/diffie-hellman', diffieHellman.handler);
app.post('/elgamal', elgamal.handler);
app.post('/fermat', fermat.handler);
app.post('/miller-rabin', millerRabin.handler);
app.get('/cryptool', cryptool.handler);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Cryptography Server running on http://localhost:${PORT}`);
});
