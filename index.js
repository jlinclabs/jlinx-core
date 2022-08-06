const crypto = require('hypercore-crypto')
const b4a = require('b4a')
const sodium = require('sodium-universal')
const multibase = require('./multibase')

exports.sign = crypto.sign
exports.verify = crypto.verify
exports.randomBytes = crypto.randomBytes
exports.multibase = multibase

exports.now = () => (new Date()).toISOString().slice(0, -1)

const JLINX_PREFIX = 'jlinx:'
exports.publicKeyToJlinxId = publicKey => {
  return JLINX_PREFIX + multibase.encode(publicKey)
}

exports.jlinxIdToPublicKey = jlinxId => {
  return multibase.toBuffer(jlinxId.slice(JLINX_PREFIX.length))
}

exports.isPublicKey = publicKey => {
  if (typeof publicKey === 'string') {
    try {
      publicKey = multibase.toBuffer(publicKey)
    } catch (e) {
      return false
    }
  }
  return (
    b4a.isBuffer(publicKey) &&
    publicKey.byteLength === sodium.crypto_sign_PUBLICKEYBYTES
  )
}

exports.createRandomString = function (size = 12) {
  return exports.randomBytes(size).toString('hex')
}

exports.createSigningKeyPair = function (seed) {
  return crypto.keyPair(seed)
}

exports.validateSigningKeyPair = function (keyPair) {
  return crypto.validateKeyPair(keyPair)
}

exports.createEncryptionKey = function () {
  const encryptionKey = Buffer.alloc(sodium.crypto_stream_KEYBYTES, 'encryption key')
  sodium.randombytes_buf(encryptionKey)
  return encryptionKey
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
