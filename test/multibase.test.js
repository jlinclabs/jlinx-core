const test = require('brittle')
const multibase = require('../multibase')

test('multibase', t => {
  const publicKeyAsHex = 'cdd0ae3ddae68928a13f07a6f3544442dd6b5a616a98f2b8e37f64c95d88f425'
  const publicKey = Buffer.from(publicKeyAsHex, 'hex')
  const publicKeyEncoded = multibase.encode(publicKey)
  t.is(typeof publicKeyEncoded, 'string')
  t.is(publicKeyEncoded, 'f' + publicKeyAsHex)
  t.alike(multibase.toBuffer(publicKeyEncoded), publicKey)

  const helloWorldEncoded = multibase.encode('hello world')
  t.is(typeof helloWorldEncoded, 'string')
  t.is(
    helloWorldEncoded,
    'f' + Buffer.from('hello world').toString('hex')
  )
  t.is(
    multibase.toString(helloWorldEncoded),
    'hello world'
  )
})
