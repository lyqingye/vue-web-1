import request from '@/utils/request'


export function getDictPageInfo(pagerRequest) {
  return request({
    url: '/api/admin/dictionary/page',
    method: 'post',
    data: pagerRequest
  })
}

export function addDict(data) {
  return request({
    url: '/api/admin/dictionary/add',
    method: 'post',
    data: data
  })
}

export function updateDict(data) {
  return request({
    url: '/api/admin/dictionary/update',
    method: 'put',
    data: data
  })
}

export function deleteDict(dictId) {
  return request({
    url: '/api/admin/dictionary/delete/' + dictId,
    method: 'delete'
  })
}
