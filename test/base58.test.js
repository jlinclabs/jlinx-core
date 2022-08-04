const test = require('brittle')
const base58 = require('../base58')

test('decode makes buffers', t => {
  const publicKeyAsHex = 'cdd0ae3ddae68928a13f07a6f3544442dd6b5a616a98f2b8e37f64c95d88f425'
  const publicKey = Buffer.from(publicKeyAsHex, 'hex')
  const publicKeyAsBase58 = base58.encode(publicKey)
  t.is(typeof publicKeyAsBase58, 'string')
  t.is(publicKeyAsBase58, 'ErR8uLsXoD2ZRuyVHZifFttunuzNpmAiaTYxhE3W4XEt')
  const publicKeyFromBase58 = base58.decode(publicKeyAsBase58)
  t.ok(publicKeyFromBase58 instanceof Buffer)
  t.alike(publicKeyFromBase58, publicKey)
})
