import request from '@/utils/request'


export function getSmsLogPageInfo(pagerRequest) {
  return request({
    url: '/api/admin/log/smsLog/page',
    method: 'post',
    data: pagerRequest
  })
}