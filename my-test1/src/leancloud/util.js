import os from 'os'

export default {
   /**
   * 获取内网ip
   */
  getLocalIp () {
    var map = []
    var ifaces = os.networkInterfaces()
    console.log(os)
    for (var dev in ifaces) {
      if (ifaces[dev][1].address.indexOf('192.168') !== -1) {
        return ifaces[dev][1].address
      }
    }
    return map
  },
  /**
   * 获取对应mac地址
   */
  getLocalIpMac () {
    var map = []
    var ifaces = os.networkInterfaces()
    for (var dev in ifaces) {
      if (ifaces[dev][1].address.indexOf('192.168') !== -1) {
        return ifaces[dev][1].mac
      }
    }
    return map
  }
}