import crypto from 'crypto'

export default {
  getmd5 (value) {
    var md5 = crypto.createHash('md5')
    md5.update(value)
    return md5.digest('hex').toUpperCase()
  }
}
