const fs = require('fs/promises')
const crypto = require('hypercore-crypto')
const b64 = require('urlsafe-base64')
const b4a = require('b4a')
const sodium = require('sodium-universal')
const base58BitcoinAlphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const base58 = require('base-x')(base58BitcoinAlphabet);

exports.sign = crypto.sign
exports.verify = crypto.verify
exports.randomBytes = crypto.randomBytes

exports.now = () => (new Date()).toISOString().slice(0, -1)

exports.keyToString = key =>
  typeof key === 'string' ? key : b64.encode(key)

exports.keyToBuffer = key =>
  Buffer.isBuffer(key) ? key : b64.decode(key)

exports.keyToMultibase = key =>
  `u${exports.keyToString(key)}`

exports.isPublicKey = publicKey =>
  exports.keyToString(publicKey).match(/^[A-Za-z0-9\-_]{43}$/)

exports.createRandomString = function (size = 12) {
  return exports.randomBytes(size).toString('hex')
}

exports.createSigningKeyPair = function (seed) {
  return crypto.keyPair(seed)
}

exports.validateSigningKeyPair = function (keyPair) {
  return crypto.validateKeyPair(keyPair)
}

exports.createEncryptingKeyPair = function () {
  const publicKey = b4a.allocUnsafe(sodium.crypto_box_PUBLICKEYBYTES)
  const secretKey = b4a.allocUnsafe(sodium.crypto_box_SECRETKEYBYTES)
  sodium.crypto_box_keypair(publicKey, secretKey)
  return { publicKey, secretKey }
}

exports.validateEncryptingKeyPair = function (keyPair) {
  const nonce = b4a.allocUnsafe(sodium.crypto_box_NONCEBYTES)
  const message = b4a.from('Hello, World!')
  const mac = b4a.allocUnsafe(sodium.crypto_box_MACBYTES)
  const cipher = b4a.allocUnsafe(message.length)
  sodium.crypto_box_detached(cipher, mac, message, nonce, keyPair.publicKey, keyPair.secretKey)
  const plain = b4a.allocUnsafe(cipher.length)
  sodium.crypto_box_open_detached(plain, cipher, mac, nonce, keyPair.publicKey, keyPair.secretKey)
  return b4a.equals(plain, message)
}

exports.fsExists = async function (path) {
  try {
    await fs.stat(path)
    return true
  } catch (error) {
    if (error.code === 'ENOENT') return false
    throw error
  }
}

exports.signingKeyToDidDocument = function(publicKey){
  const base68EncodedPK = base58.encode(exports.keyToBuffer(publicKey))
  const publicKeyMultibase = `z6mk${base68EncodedPK}`
  const did = `did:key:${publicKeyMultibase}`
  const didDocument = {
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
  }

  return didDocument
}
