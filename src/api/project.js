import request from '@/utils/request'
export function fetchList(query) {
  return request({
    url: '/project/list',
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

export function createProject(data) {
     return request({
       url: '/project/create_project',
       method: 'post',
       data
     })
}
