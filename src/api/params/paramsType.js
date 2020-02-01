import request from '@/utils/request'


export function getGlobalParamsTypePageInfo(pagerRequest) {
  return request({
    url: '/api/admin/globalParamsType/page',
    method: 'post',
    data: pagerRequest
  })
}

export function addGlobalParamsType(data) {
  return request({
    url: '/api/admin/globalParamsType/add',
    method: 'post',
    data: data
  })
}

export function updateGlobalParamsType(data) {
  return request({
    url: '/api/admin/globalParamsType/update',
    method: 'put',
    data: data
  })
}

export function deleteGlobalParamsType(GlobalParamsTypeId) {
  return request({
    url: '/api/admin/globalParamsType/delete/' + GlobalParamsTypeId,
    method: 'delete'
  })
}

export function listGlobalParamsType() {
  return request({
    url: '/api/admin/globalParamsType/list',
    method: 'get'
  })
}
