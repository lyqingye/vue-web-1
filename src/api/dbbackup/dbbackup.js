import request from '@/utils/request'

export function getDbBackupPageInfo(pagerRequest) {
  return request({
    url: '/api/admin/dataBaseBackup/page',
    method: 'post',
    data: pagerRequest
  })
}

export function backup() {
  return request({
    url: '/api/admin/dataBaseBackup/backup',
    method: 'put'
  })
}

export function recover(fileName) {
  return request({
    url: '/api/admin/dataBaseBackup/recover/' + fileName,
    method: 'put'
  })
}

export function deleteFile(fileName) {
  return request({
    url: '/api/admin/dataBaseBackup/delete/' + fileName,
    method: 'delete'
  })
}
