import request from '@/utils/request'

export function fetchProject(query) {
     return request({
       url: '/ota_project/list_pull',
       method: 'get',
       params: query
     })
}
export function fetchOta(query) {
  return request({
    url: '/ota_project/list_ota',
    method: 'get',
    params: query
  })
}

export function fetchList(query) {
  return request({
    url: '/ota_project/list',
    method: 'get',
    params: query
  })
}
export function createProject(data) {
  return request({
    url: '/ota_project/create',
    method: 'post',
    data
  })
}
export function updateProject(data) {
  return request({
    url: '/ota_project/update',
    method: 'post',
    data
  })
}
export function updateStatus(query) {
  return request({
    url: '/ota_project/change',
    method: 'get',
    params: query
  })
}
export function updateComfirm(data) {
  return request({
    url: '/ota_project/otacomfirm',
    method: 'post',
    data
  })
}

export function updateOta(data) {
  return request({
    url: '/ota_project/otaupdate',
    method: 'post',
    data
  })
}

export function publicAot(data) {
  return request({
    url: '/ota/pub',
    method: 'post',
    data
  })
}

export function deleteAot(id) {
  return request({
    url: '/ota/delete',
    method: 'get',
    params: { id }
  })
}
