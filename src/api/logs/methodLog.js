import request from '@/utils/request'


export function getMethodLogPageInfo(pagerRequest) {
  return request({
    url: '/api/admin/log/methodLog/page',
    method: 'post',
    data: pagerRequest
  })
}