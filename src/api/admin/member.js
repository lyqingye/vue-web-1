import request from '@/utils/request'

export function getMemberPageInfo(pagerRequest) {
  return request({
    url: '/api/admin/member/page',
    method: 'post',
    data: pagerRequest
  })
}

export function deleteMember(memberId) {
  return request({
    url: '/api/admin/member/delete/' + memberId,
    method: 'delete'
  })
}

export function forceResetMemberLoginPassword(data) {
  return request({
    url: '/api/admin/member/forceResetLoginPassword' ,
    method: 'post',
    data
  })
}

