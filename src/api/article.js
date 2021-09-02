import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/table/list',
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

export function createArticle(data) {
  return request({
    url: '/ali/create_product',
    method: 'post',
    data
  })
}
export function createAot(data) {
  return request({
    url: '/ota/create',
    method: 'post',
    data
  })
}
export function fetchAot(query) {
  return request({
    url: '/ota/list',
    method: 'get',
    params: query
  })
}
export function updateArticle(data) {
  return request({
    url: '/table/update',
    method: 'post',
    data
  })
}
