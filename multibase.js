const multibase = require('multibase')
const { encodeText, decodeText } = require('multibase/src/util')
const toBuffer = require('typedarray-to-buffer')

exports.encode = (buf, format = 'base64url') => {
  if (typeof buf === 'string') buf = encodeText(buf)
  return decodeText(multibase.encode(format, buf))
}

exports.toBuffer = encoded => {
  return toBuffer(multibase.decode(encoded))
}

exports.toString = encoded => {
  return decodeText(multibase.decode(encoded))
}
