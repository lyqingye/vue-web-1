import request from '@/utils/request'

export function getVetoFormPageInfo(pagerRequest) {
  return request({
    url: '/api/admin/veto/page',
    method: 'post',
    data: pagerRequest
  })
}

export function deleteVeto(vetoId) {
  return request({
    url: '/api/admin/veto/delete/' + vetoId,
    method: 'delete'
  })
}
