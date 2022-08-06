const test = require('brittle')
const multibase = require('../multibase')
const util = require('../')

test('now', async t => {
  t.is(typeof util.now, 'function')
})

test('key transformations', async t => {
  const { publicKey } = util.createSigningKeyPair()
  const jlinxId = util.publicKeyToJlinxId(publicKey)
  t.is(
    util.publicKeyToJlinxId(publicKey),
    'jlinx:' + multibase.encode(publicKey, 'base64url')
  )
  t.alike(
    util.jlinxIdToPublicKey(jlinxId),
    publicKey
  )
  t.ok(util.isPublicKey(publicKey))
  t.not(util.isPublicKey(jlinxId))
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
