import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/ota/list',
    method: 'get',
    params: query
  })
}
export function createAot(data) {
  return request({
    url: '/ota/create',
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
export function fetchProject(query) {
  return request({
    url: '/ota_project/list_pull',
    method: 'get',
    params: query
  })
}
export function deleteAot(id) {
  return request({
    url: '/ota/delete',
    method: 'get',
    params: { id }
  })
}
