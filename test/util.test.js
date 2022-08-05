const test = require('brittle')
const util = require('../')

test('now', async t => {
  t.is(typeof util.now, 'function')
})

test('key transformations', async t => {
  const publicKeyAsHex = 'cdd0ae3ddae68928a13f07a6f3544442dd6b5a616a98f2b8e37f64c95d88f425'
  const publicKeyAsMultibase = 'zErR8uLsXoD2ZRuyVHZifFttunuzNpmAiaTYxhE3W4XEt'
  const publicKey = Buffer.from(publicKeyAsHex, 'hex')
  const uri = `jlinx:${publicKeyAsMultibase}`
  t.is(publicKey.toString('hex'), publicKeyAsHex)

  t.is(util.encode(publicKey), publicKeyAsMultibase)

  t.is(util.keyToString(publicKey), publicKeyAsMultibase)
  t.is(util.keyToString(publicKeyAsMultibase), publicKeyAsMultibase)

  t.alike(util.keyToBuffer(publicKey), publicKey)
  t.alike(util.keyToBuffer(publicKeyAsMultibase), publicKey)

  t.ok(util.isPublicKey(publicKey))
  t.ok(util.isPublicKey(publicKeyAsMultibase))

  t.is(util.keyToUri(publicKey), uri)
  t.is(util.keyToUri(publicKeyAsMultibase), uri)

  let tries = 100
  while (tries--) {
    const { publicKey } = util.createSigningKeyPair()
    const key = util.keyToString(publicKey)
    t.ok(util.isPublicKey(publicKey))
    t.ok(util.isPublicKey(key))
    t.alike(util.keyToBuffer(key), publicKey)
  }
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
