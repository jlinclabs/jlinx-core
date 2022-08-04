const toBuffer = require('typedarray-to-buffer')
const base58BitcoinAlphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const base58 = require('base-x')(base58BitcoinAlphabet)

const bufferize = (func) =>
  (...args) => toBuffer(func(...args))

exports.encode = base58.encode
exports.decodeUnsafe = bufferize(base58.decodeUnsafe)
exports.decode = bufferize(base58.decode)
