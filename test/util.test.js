const test = require('brittle')
const util = require('../')

test('now', async t => {
  t.is(typeof util.now, 'function')
})

test('key transformations', async t => {
  const publicKeyAsHex = 'cdd0ae3ddae68928a13f07a6f3544442dd6b5a616a98f2b8e37f64c95d88f425'
  const publicKey = Buffer.from(publicKeyAsHex, 'hex')
  const publicKeyAsBase58 = 'ErR8uLsXoD2ZRuyVHZifFttunuzNpmAiaTYxhE3W4XEt'
  const uri = `jlinx:uu${publicKeyAsBase58}`
  t.is(publicKey.toString('hex'), publicKeyAsHex)

  t.is(util.keyToString(publicKey), publicKeyAsBase58)
  t.is(util.keyToString(publicKeyAsBase58), publicKeyAsBase58)

  t.alike(util.keyToBuffer(publicKey), publicKey)
  t.alike(util.keyToBuffer(publicKeyAsBase58), publicKey)

  t.ok(util.isPublicKey(publicKey))
  t.ok(util.isPublicKey(publicKeyAsBase58))

  t.is(util.keyToUri(publicKey), uri)
  t.is(util.keyToUri(publicKeyAsBase58), uri)
})

test('createRandomString', t => {
  t.is(typeof util.createRandomString(), 'string')
})

test('signing keys', async t => {
  const keyPair1 = util.createSigningKeyPair()
  t.is(keyPair1.publicKey.length, 32)
  t.is(keyPair1.secretKey.length, 64)
  const keyPair2 = util.createSigningKeyPair()

  t.ok(util.validateSigningKeyPair({
    publicKey: keyPair1.publicKey,
    secretKey: keyPair1.secretKey
  }))
  t.ok(!util.validateSigningKeyPair({
    publicKey: keyPair1.publicKey,
    secretKey: keyPair2.secretKey
  }))
})

test('createEncryptionKey', async t => {
  const key = util.createEncryptionKey()
  t.ok(key instanceof Buffer)
  t.is(key.length, 32)
})

test.skip('encrypting key pairs', async t => {
  const keyPair1 = util.createEncryptingKeyPair()
  const keyPair2 = util.createEncryptingKeyPair()

  t.ok(util.validateEncryptingKeyPair({
    publicKey: keyPair1.publicKey,
    secretKey: keyPair1.secretKey
  }))
  // KNOWN BUG
  t.ok(!util.validateEncryptingKeyPair({
    publicKey: keyPair1.publicKey,
    secretKey: keyPair2.secretKey
  }))
})
