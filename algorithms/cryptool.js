/**
 * 15. Study of Cryptool
 * Educational notes about CrypTool (popular open-source e-learning tool for cryptography)
 */

function handler(req, res) {
  res.json({
    topic: 'Study of CrypTool',
    overview: 'CrypTool is a free, open-source e-learning software for cryptography and cryptanalysis. It is widely used in education and training.',
    versions: [
      'CrypTool 1 (CT1) - Classic Windows application',
      'CrypTool 2 (CT2) - Modern .NET based, visual programming',
      'JCrypTool - Java-based, cross-platform',
      'CrypTool-Online (CTO) - Browser-based'
    ],
    features: [
      'Visualization of classical and modern ciphers',
      'Cryptanalysis tools (frequency analysis, brute force, etc.)',
      'Number theory tools (primality, modular arithmetic)',
      'Visual programming of crypto protocols in CT2',
      'Support for AES, DES, RSA, ECC, hash functions, digital signatures',
      'Interactive tutorials and challenges'
    ],
    educationalValue: [
      'Students can see intermediate steps of algorithms',
      'Experiment with parameters and observe effects',
      'Learn attacks on weak ciphers hands-on',
      'Bridge theory and practice'
    ],
    website: 'https://www.cryptool.org/',
    relatedInThisRepo: 'Many algorithms implemented here (Caesar, Vigenère, RSA, AES, primality tests, etc.) can be explored visually inside CrypTool.',
    recommendation: 'Download CrypTool 2 or use CrypTool-Online for interactive learning alongside this server-side API.'
  });
}

module.exports = { handler };
