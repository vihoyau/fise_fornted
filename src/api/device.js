import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/device/list',
    method: 'get',
    params: query
  })
}
export function static_windy(query) {
  return request({
    url: '/device/static',
    method: 'get',
    params: query
  })
}
export function fetch_device_login_List(query) {
  return request({
    url: '/device/login_list',
    method: 'get',
    params: query
  })
}
export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}
export function fetch_product_List() {
  return request({
    url: '/table/product/list',
    method: 'get',
    params: { }
  })
}
export function selectDeviceInfo(deviceName) {
  return request({
    url: '/device/info',
    method: 'get',
    params: { deviceName }
  })
}

export function fetch_product_type_List() {
  return request({
    url: '/table/product/type_list',
    method: 'get',
    params: { }
  })
}

export function deleteArticle(id) {
  return request({
    url: '/table/delete',
    method: 'get',
    params: { id }
  })
}

export function create_Fix_Device(data) {
  return request({
    url: '/device/create_fix_device',
    method: 'post',
    data
  })
}
export function createDevice(data) {
  return request({
    url: '/device/create_device',
    method: 'post',
    data
  })
}


export function updateArticle(data) {
  return request({
    url: '/table/update',
    method: 'post',
    data
  })
}
export function winter_list(query) {
  return request({
    url: '/device/winter_list',
    method: 'get',
    params: query
  })
}

export function device_log_list(query) {
  return request({
    url: '/device/device_log_list',
    method: 'get',
    params: query
  })
}