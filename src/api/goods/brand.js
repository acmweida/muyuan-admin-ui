import request from '@/utils/request'

// 查询品牌列表
export function listBrand(query) {
  return request({
    url: '/manager-goods/brand/list',
    method: 'get',
    params: query
  })
}

// 查询品牌分类列表
export function listCategory(id) {
  return request({
    url: '/manager-goods/brand/category/'+id,
    method: 'get',
  })
}

// 查询品牌详细
export function getBrand(id) {
  return request({
    url: '/manager-goods/brand/' + id,
    method: 'get'
  })
}

// 新增品牌
export function addBrand(data) {
  return request({
    url: '/manager-goods/brand',
    method: 'post',
    data: data
  })
}

// 新增品牌
export function linkCategory(data) {
  return request({
    url: '/manager-goods/brand/category',
    method: 'put',
    data: data
  })
}

// 修改品牌
export function updateBrand(data) {
  return request({
    url: '/manager-goods/brand',
    method: 'put',
    data: data
  })
}

// 删除品牌
export function delBrand(id) {
  return request({
    url: '/manager-goods/brand/' + id,
    method: 'delete'
  })
}
