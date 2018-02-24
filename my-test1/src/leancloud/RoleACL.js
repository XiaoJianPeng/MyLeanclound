import AV from 'leancloud-storage'
import Enum from '../common/Enum'

class RoleACL {
  // 创建角色查询
  static getQuery () {
    return new AV.Query(AV.Role)
  }
  // 创建新角色对象
  static getRole (roleName, roleACL) {
    return new AV.Role(roleName, roleACL)
  }
  // 查询角色是否存在，存在则返回角色，否则返回'', roleName:角色名称
  static roleExisit (roleName) {
    var promise = new Promise(function (resolve, reject) {
      var roleQuery = RoleACL.getQuery()
      roleQuery.equalTo('name', roleName)
      roleQuery.find().then(function (role) {
        if (role.length > 0) {
          resolve(role[0])
        } else {
          resolve('')
        }
      }).catch(function () {
        resolve('')
      })
    })
    return promise
  }
  // 获取当前登录人所拥有的角色
  static getRoles () {
    var promise = new Promise(function (resolve, reject) {
      let user = AV.User.current()
      // roles 是一个 AV.Role 数组，这些 AV.Role 表示 user 拥有的角色
      user.getRoles().then(function (roles) {
        resolve(roles)
      }).catch(function (error) {
        reject(error)
      })
    })
    return promise
  }
  // 给当前用户赋予某角色
  static roleUsersAdd (roleName) {
    var promise = new Promise(function (resolve, reject) {
      // 根据角色名称查询出角色
      RoleACL.roleExisit(roleName).then(function (role) {
        if (role.length === 0) {
          roleName('不存在角色:' + roleName)
        } else {
          // 判断用户是否拥有该角色
          var roleQuery = new AV.Query(AV.Role)
          roleQuery.equalTo('name', roleName)
          roleQuery.equalTo('users', AV.User.current())
          roleQuery.find().then(function (results) {
            if (results.length > 0) {
              // 已拥有角色则直接返回角色
              return results[0]
            } else { // 将用户添加到role的Users中
              var relation = role.getUsers()
              relation.add(AV.User.current())
              return role.save()
            }
          })
        }
      })
    })
    return promise
  }

  // 剥夺用户角色
  static roleUsersRemove (roleName) {
    var promise = new Promise(function (resolve, reject) {
      // 根据角色名称查询出角色
      RoleACL.roleExisit(roleName).then(function (role) {
        if (role.length === 0) {
          roleName('不存在角色:' + roleName)
        } else {
          // 判断用户是否拥有该角色
          var roleQuery = new AV.Query(AV.Role)
          roleQuery.equalTo('name', roleName)
          roleQuery.equalTo('users', AV.User.current())
          roleQuery.find().then(function (results) {
            if (results.length > 0) {
              var moderatorRole = results[0]
              var relation = moderatorRole.getUsers()
              relation.remove(AV.User.current())
              return moderatorRole.save()
            }
          })
        }
      })
    })
    return promise
  }
  // 创建角色 并给角色Users字段添加用户
  static roleUsersPush (roleName) {
    var promise = new Promise(function (resolve, reject) {
      var roleAcl = new AV.ACL()
      roleAcl.setPublicReadAccess(true)
      roleAcl.setPublicWriteAccess(true)
      roleAcl.setWriteAccess(AV.User.current(), true)
      var role = RoleACL.getRole(roleName, roleAcl)
      // 将当前用户添加到角色中
      role.getUsers().add(AV.User.current())
      role.save().then(function (res) {
        resolve(res)
      }).catch(function (error) {
        reject(error)
      })
    })
    return promise
  }
  // 设置角色
  static setUserRole (position) {
    // 登录成功后首先获取用户的角色
    var promise = new Promise(function (resolve, reject) {
    /* 如过用户已分配角色则返回 ，否则
    * 先校验是否存在角色 不存在则创建所有角色: HR、HRD、CHO
    * 角色存在，则向角色中添加用户
    */
      RoleACL.getRoles().then(function (roles) {
        if (roles.length > 0) {
          return roles[0]
        } else {
          RoleACL.roleExisit(Enum.role.HR).then(function (role) {
            if (role.length === 0) {
              // 设置角色的acl
              var roleAcl = new AV.ACL()
              roleAcl.setPublicReadAccess(true)
              roleAcl.setPublicWriteAccess(true)
              // 保存CHO
              let cho = new AV.Role(Enum.role.CHO, roleAcl)
              if (position === Enum.position.CHO) {
                cho.getUsers().add(AV.User.current())
              }
              cho.save().then(function (resCHO) {
                // 保存HRM
                let hrm = new AV.Role(Enum.role.HRM, roleAcl)
                if (position === Enum.position.HRM) {
                  hrm.getUsers().add(AV.User.current())
                }
                hrm.getRoles().add(resCHO)
                hrm.save().then(function (resHRM) {
                  // 保存HR
                  let hr = new AV.Role(Enum.role.HR, roleAcl)
                  if (position === Enum.position.CHO) {
                    cho.getUsers().add(AV.User.current())
                  }
                  hr.getRoles().add(resHRM)
                  hr.save().then(function (resHR) {
                    resolve('success')
                  })
                })
              }).catch(function (error) {
                reject(error)
              })
            } else { // 存在角色 则给用户赋予角色
              let roleName = ''
              if (position === Enum.position.HR) {
                roleName = Enum.role.HR
              } else if (position === Enum.position.HRM) {
                roleName = Enum.role.HRM
              } else {
                roleName = Enum.role.CHO
              }
              RoleACL.roleUsersAdd(roleName).then(function (res) {
                resolve('success')
              }).catch(function (error) {
                reject(error)
              })
            }
          })
        }
      }).catch(function (error) {
        reject(error)
      })
    })
    return promise
  }

  // 对象acl权限
  static setACL () {
    // 创建一个acl实例
    var acl = new AV.ACL()
    var hr = RoleACL.getRole(Enum.role.HR)
    var cho = RoleACL.getRole(Enum.role.CHO)
    // 给处理人 角色 赋予可读可写权限
    acl.setRoleReadAccess(hr, true)
    acl.setRoleReadAccess(cho, true)
    // 给提交人角色赋予读的权限
    acl.setWriteAccess(AV.User.current())
    return acl
  }
}
export default RoleACL
