const util = require('./')
const test = require('tape')

test('now', async t => {
  t.equal(typeof util.now, 'function')
})

test('createSigningKeyPair', async t => {
  const keyPair = util.createSigningKeyPair()

  t.is(keyPair.publicKey.length, 32)
  t.is(keyPair.secretKey.length, 64)
})

test('validate key pair', async t => {
  const keyPair1 = util.createSigningKeyPair()
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
