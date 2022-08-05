const b4a = require('b4a')
const multibase = require('./multibase')

class JlinxId {
  constructor(jlinxId){
    if (typeof jlinxId === 'string'){
      if (jlinxId.startsWith('jlinx:')){
        jlinxId = jlinxId.slice(6)
      }
      jlinxId = multibase.toBuffer(jlinxId)
    }
    this.publicKey = jlinxId
    this.toString = function toString(){
      return multibase.encode(this.publicKey)
    }
    Object.freeze(this)
  }

  toUri(){ return `jlinx:${this}` }
}

Object.assign(JlinxId, {
  toPublicKey(jlinxId){ return new JlinxId(jlinxId).publicKey },
  toString(jlinxId){ return new JlinxId(jlinxId).toString() },
  toUri(jlinxId){ return new JlinxId(jlinxId).toUri() }
})

module.exports = JlinxId
