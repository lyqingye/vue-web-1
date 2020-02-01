import request from '@/utils/request'


export function getDictTypePageInfo(pagerRequest) {
  return request({
    url: '/api/admin/dictionaryType/page',
    method: 'post',
    data: pagerRequest
  })
}

export function addDictType(data) {
  return request({
    url: '/api/admin/dictionaryType/add',
    method: 'post',
    data: data
  })
}

export function updateDictType(data) {
  return request({
    url: '/api/admin/dictionaryType/update',
    method: 'put',
    data: data
  })
}

export function deleteDictType(dictTypeId) {
  return request({
    url: '/api/admin/dictionaryType/delete/' + dictTypeId,
    method: 'delete'
  })
}

export function listDictType() {
  return request({
    url: '/api/admin/dictionaryType/list',
    method: 'get'
  })
}
