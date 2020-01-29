import request from '@/utils/request'


export function getExceptionLogPageInfo(pagerRequest) {
  return request({
    url: '/api/admin/log/exceptionLog/page',
    method: 'post',
    data: pagerRequest
  })
}
