const test = require('brittle')
const util = require('../')

test('now', async t => {
  t.is(typeof util.now, 'function')
})

test('key transformations', async t => {
  const publicKeyAsHex = 'cdd0ae3ddae68928a13f07a6f3544442dd6b5a616a98f2b8e37f64c95d88f425'
  const publicKey = Buffer.from(publicKeyAsHex, 'hex')
  const publicKeyAsMultibase = 'f' + publicKeyAsHex
  const jlinxId = 'jlinx:' + publicKeyAsMultibase

  t.alike(util.jlinxIdToPublicKey(jlinxId), publicKey)
  t.alike(util.jlinxIdToString(publicKey), jlinxId)

  let tries = 10
  while (tries--) {
    const { publicKey } = util.createSigningKeyPair()
    const jlinxId = 'jlinx:f' + publicKey.toString('hex')
    t.is(util.jlinxIdToString(publicKey), jlinxId)
    t.alike(util.jlinxIdToPublicKey(jlinxId), publicKey)
    t.ok(util.isPublicKey(publicKey))
    t.ok(util.isPublicKey(jlinxId))
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
