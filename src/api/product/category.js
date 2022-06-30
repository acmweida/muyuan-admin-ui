import request from '@/utils/request'

// 查询商品分类列表
export function listCategory(query) {
  return request({
    url: '/api/product/category/list',
    method: 'get',
    params: query
  })
}

export function treeSelect(query) {
  return request({
    url: '/api/product/category/treeSelect',
    method: 'get',
    params: query
  })
}

// 查询商品分类详细
export function getCategory(id) {
  return request({
    url: '/api/product/category/' + id,
    method: 'get'
  })
}

export function getCategoryByCode(code) {
  return request({
    url: '/api/product/category/3th/' + code,
    method: 'get'
  })
}

// 新增商品分类
export function addCategory(data) {
  return request({
    url: '/api/product/category',
    method: 'post',
    data: data
  })
}

// 修改商品分类
export function updateCategory(data) {
  return request({
    url: '/api/product/category',
    method: 'put',
    data: data
  })
}

// 删除商品分类
export function delCategory(id) {
  return request({
    url: '/api/product/category/' + id,
    method: 'delete'
  })
}


// 查询商品分类属性列表
export function getCategoryAttribute(id) {
  return request({
    url: '/api/product/category/detail/'+id,
    method: 'get'
  })
}
