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

test('signingKeyToDidDocument', async t => {
  const kp = util.createSigningKeyPair()
  const didDocument = util.signingKeyToDidDocument(kp.publicKey)
  const did = didDocument.id
  const publicKeyMultibase = did.split('did:key:')[1]
  t.deepEqual(didDocument, {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/suites/ed25519-2020/v1",
      "https://w3id.org/security/suites/x25519-2020/v1"
    ],
    "id": `${did}`,
    "verificationMethod": [{
      "id": `${did}#${publicKeyMultibase}`,
      "type": "Ed25519VerificationKey2020",
      "controller": `${did}`,
      "publicKeyMultibase": `${publicKeyMultibase}`
    }],
    "authentication": [
      `${did}#${publicKeyMultibase}`
    ],
    "assertionMethod": [
      `${did}#${publicKeyMultibase}`
    ],
    "capabilityDelegation": [
      `${did}#${publicKeyMultibase}`
    ],
    "capabilityInvocation": [
      `${did}#${publicKeyMultibase}`
    ],
    "keyAgreement": [{
      "id": `${did}#${publicKeyMultibase}`,
      "type": "X25519KeyAgreementKey2020",
      "controller": `${did}`,
      "publicKeyMultibase": `${publicKeyMultibase}`
    }]
  })

})
