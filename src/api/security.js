import request from '@/utils/request'


//----------------------------------------------------------
// permission
//----------------------------------------------------------

export function getPermissionList() {
  return request({
    url: '/api/admin/security/permissionList',
    method: 'get'
  })
}

export function addPermission(data) {
  return request({
    url: '/api/admin/security/addPermission',
    method: 'post',
    data
  })
}

export function updatePermission(data) {
  return request({
    url: '/api/admin/security/updatePermission',
    method: 'put',
    data
  })
}

export function updatePermissionIsEnable(id) {
  return request({
    url: '/api/admin/security/updatePermissionIsEnable/' + id,
    method: 'put'
  })
}

export function deletePermission(id) {
  return request({
    url: '/api/admin/security/deletePermission/' + id,
    method: 'delete'
  })
}

//----------------------------------------------------------
// router
//----------------------------------------------------------

export function getRouterList() {
  return request({
    url: '/api/admin/security/routerList',
    method: 'get'
  })
}

export function getMenuRouterList() {
  return request({
    url: '/api/admin/security/menuRouterList',
    method: 'get'
  })
}

export function addMenuRouter(data) {
  return request({
    url: '/api/admin/security/addMenuRouter',
    method: 'post',
    data
  })
}

export function updateMenuRouter(data) {
  return request({
    url: '/api/admin/security/updateMenuRouter',
    method: 'put',
    data
  })
}

export function deleteMenuRouter(routerId) {
  return request({
    url: '/api/admin/security/deleteMenuRouter/' + routerId,
    method: 'delete'
  })
}

//----------------------------------------------------------
// role
//----------------------------------------------------------

export function getRolePageInfo(pagerRequest) {
  return request({
    url: '/api/admin/security/rolePageInfo',
    method: 'post',
    data: pagerRequest
  })
}

export function addRole(data) {
  return request({
    url: '/api/admin/security/addRole',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/api/admin/security/updateRole',
    method: 'put',
    data
  })
}

export function deleteRole(roleId) {
  return request({
    url: '/api/admin/security/deleteRole/' + roleId,
    method: 'delete'
  })
}
