const test = require('brittle')
const constants = require('multibase/src/constants')
const { createSigningKeyPair } = require('../')
const multibase = require('../multibase')
const JlinxId = require('../JlinxId')

test('JlinxId', t => {
  const publicKeyAsHex = 'cdd0ae3ddae68928a13f07a6f3544442dd6b5a616a98f2b8e37f64c95d88f425'
  const jlinxId = 'f' + publicKeyAsHex
  const publicKey = Buffer.from(publicKeyAsHex, 'hex')

  // class methods
  t.is(JlinxId.toString(publicKey), jlinxId)
  t.alike(JlinxId.toPublicKey(jlinxId), publicKey)
  t.is(JlinxId.toUri(jlinxId), `jlinx:${jlinxId}`)

  // as class instance
  const id = new JlinxId(jlinxId)
  t.is(id.toString(), jlinxId)
  t.alike(id.publicKey, publicKey)
  t.is(id.toUri(), `jlinx:${jlinxId}`)

  let tries = 10
  while (tries--) {
    const { publicKey } = createSigningKeyPair()
    let id = new JlinxId(publicKey)
    t.is(id.toString(), 'f' + publicKey.toString('hex'))
    t.is(id.toString().length, 65)
    t.alike(id.publicKey, publicKey)
    t.is(id.toUri(), `jlinx:${id.toString()}`)

    id = new JlinxId(id.toString())
    t.is(id.toString(), 'f' + publicKey.toString('hex'))
    t.alike(id.publicKey, publicKey)

    id = new JlinxId(id.toUri())
    t.is(id.toString(), 'f' + publicKey.toString('hex'))
    t.alike(id.publicKey, publicKey)
  }

  // TODO needs tests for decoding other multibase formats
  // examples found here https://github.com/multiformats/js-multibase/blob/master/test/multibase.spec.js

  for (
    const [encoding, encoded] of
    Object.entries({
      base2: '01100110111010000101011100011110111011010111001101000100100101000101000010011111100000111101001101111001101010100010001000100001011011101011010110101101001100001011010101001100011110010101110001110001101111111011001001100100101011101100010001111010000100101',
      base8: '763350256173553464222424117603646746521042055655326460552461712707067754462256610750224',
      base10: '993092840720517518312714134363527926834534166435900492203777835247181922628645',
      base16: 'fcdd0ae3ddae68928a13f07a6f3544442dd6b5a616a98f2b8e37f64c95d88f425',
      base16upper: 'FCDD0AE3DDAE68928A13F07A6F3544442DD6B5A616A98F2B8E37F64C95D88F425',
      base32hex: 'vpn8asfeqsq4ih89v0ujf6l248bemmmj1dacf5e73fticinc8ugig',
      base32hexupper: 'VPN8ASFEQSQ4IH89V0UJF6L248BEMMMJ1DACF5E73FTICINC8UGIG',
      base32hexpad: 'tpn8asfeqsq4ih89v0ujf6l248bemmmj1dacf5e73fticinc8ugig====',
      base32hexpadupper: 'TPN8ASFEQSQ4IH89V0UJF6L248BEMMMJ1DACF5E73FTICINC8UGIG====',
      base32: 'bzxik4po242esrij7a6tpgvceilowwwtbnkmpfohdp5smsxmi6qsq',
      base32upper: 'BZXIK4PO242ESRIJ7A6TPGVCEILOWWWTBNKMPFOHDP5SMSXMI6QSQ',
      base32pad: 'czxik4po242esrij7a6tpgvceilowwwtbnkmpfohdp5smsxmi6qsq====',
      base32padupper: 'CZXIK4PO242ESRIJ7A6TPGVCEILOWWWTBNKMPFOHDP5SMSXMI6QSQ====',
      base32z: 'h3zekhxq4h4r1tej9y6uxginremqsssubpkcxfq8dx71c1zce6o1o',
      base36: 'k54o49h4c16sd6url4dfrlni8pew4jd1x25yga6iur5gmycfsx1',
      base36upper: 'K54O49H4C16SD6URL4DFRLNI8PEW4JD1X25YGA6IUR5GMYCFSX1',
      base58btc: 'zErR8uLsXoD2ZRuyVHZifFttunuzNpmAiaTYxhE3W4XEt',
      base58flickr: 'ZeRq8UkSwNd2yqUYuhyHEfTTUMUZnPLaHzsxXGe3v4weT',
      base64: 'mzdCuPdrmiSihPwem81REQt1rWmFqmPK4439kyV2I9CU',
      base64pad: 'MzdCuPdrmiSihPwem81REQt1rWmFqmPK4439kyV2I9CU=',
      base64url: 'uzdCuPdrmiSihPwem81REQt1rWmFqmPK4439kyV2I9CU',
      base64urlpad: 'UzdCuPdrmiSihPwem81REQt1rWmFqmPK4439kyV2I9CU='
    })
  ){
    t.is(multibase.encode(publicKey, encoding), encoded)

    t.is(JlinxId.toString(encoded), jlinxId)
    t.alike(JlinxId.toPublicKey(encoded), publicKey)
    t.is(JlinxId.toUri(encoded), `jlinx:${jlinxId}`)

    let id = new JlinxId(encoded)
    t.is(id.toString(), jlinxId)
    t.alike(id.publicKey, publicKey)
    t.is(id.toUri(), `jlinx:${jlinxId}`)
    id = new JlinxId(`jlinx:${encoded}`)
    t.is(id.toString(), jlinxId)
    t.alike(id.publicKey, publicKey)
    t.is(id.toUri(), `jlinx:${jlinxId}`)
  }
})
