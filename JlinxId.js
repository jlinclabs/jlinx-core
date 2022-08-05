const b4a = require('b4a')
const sodium = require('sodium-universal')

const multibase = require('./multibase')
const { INVALID_JLINX_ID } = require('./errors')
const URL_PREFIX = 'jlinx:'

class JlinxId {
  constructor(jlinxId){
    if (typeof jlinxId === 'string'){
      if (jlinxId.startsWith(URL_PREFIX))
        jlinxId = jlinxId.slice(URL_PREFIX.length)
      try{ jlinxId = multibase.toBuffer(jlinxId) }catch(error){
        throw INVALID_JLINX_ID(`failed to parse multibase encoding`)
      }
    }

    if (!b4a.isBuffer(jlinxId))
      throw INVALID_JLINX_ID(`expected buffer`)

    if (jlinxId.byteLength !== sodium.crypto_sign_PUBLICKEYBYTES)
      throw INVALID_JLINX_ID(`expected byteLength to be ${sodium.crypto_sign_PUBLICKEYBYTES} but got ${jlinxId.byteLength}`)

    this.publicKey = jlinxId
    const id = URL_PREFIX + multibase.encode(this.publicKey)
    this.toString = function toString(){ return id }
    Object.freeze(this)
  }
}

Object.assign(JlinxId, {
  toPublicKey(jlinxId){ return new JlinxId(jlinxId).publicKey },
  toString(jlinxId){ return new JlinxId(jlinxId).toString() }
})

module.exports = JlinxId
