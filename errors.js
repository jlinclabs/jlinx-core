module.exports = class JlinxError extends Error {
  constructor (msg, code, fn = JlinxError) {
    super(`${code}: ${msg}`)
    this.code = code

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, fn)
    }
  }

  get name () {
    return 'JlinxError'
  }

  static BAD_ARGUMENT (msg) {
    return new JlinxError(msg, 'BAD_ARGUMENT', JlinxError.BAD_ARGUMENT)
  }

  static INVALID_JLINX_ID (msg) {
    return new JlinxError(msg, 'INVALID_JLINX_ID', JlinxError.INVALID_JLINX_ID)
  }

  static INVALID_SIGNATURE (msg) {
    return new JlinxError(msg, 'INVALID_SIGNATURE', JlinxError.INVALID_SIGNATURE)
  }
}
