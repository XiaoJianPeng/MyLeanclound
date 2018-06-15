import AV from 'leancloud-storage'
/*
*数据字典类
*/
class Equipment extends AV.Object {
  constructor () {
    // 调用 父类构造函数，并注册
    super()
    AV.Object.register(Equipment, 'Equipment')
  }
  static createWithoutData (id) {
    return super.createWithoutData('Equipment', id)
  }

  static getQuery () {
    return new AV.Query('Equipment')
  }
  
}

export default Equipment
