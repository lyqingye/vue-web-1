import request from '@/utils/request'

export function getMemberPageInfo(pagerRequest) {
  return request({
    url: '/api/admin/member/page',
    method: 'post',
    data: pagerRequest
  })
}


