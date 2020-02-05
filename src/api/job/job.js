import request from '@/utils/request'


export function getJobPageInfo(pagerRequest) {
  return request({
    url: '/api/admin/schedule/page',
    method: 'post',
    data: pagerRequest
  })
}

export function addJob(data) {
  return request({
    url: '/api/admin/schedule/add',
    method: 'post',
    data
  })
}

export function updateJob(data) {
  return request({
    url: '/api/admin/schedule/update',
    method: 'post',
    data
  })
}

export function pauseJob(jobId) {
  return request({
    url: '/api/admin/schedule/pause/' + jobId,
    method: 'put'
  })
}

export function resumeJob(jobId) {
  return request({
    url: '/api/admin/schedule/resume/' + jobId,
    method: 'put'
  })
}

export function deleteJob(jobId) {
  return request({
    url: '/api/admin/schedule/delete/' + jobId,
    method: 'delete'
  })
}

export function getJobClassList() {
  return request({
    url: '/api/admin/schedule/jobList',
    method: 'get'
  })
}
