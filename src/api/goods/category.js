import request from '@/utils/request'

// 查询商品分类列表
export function listCategory(query) {
  return request({
    url: '/manager-goods/category/list',
    method: 'get',
    params: query
  })
}

export function treeSelect(query) {
  return request({
    url: '/manager-goods/category/treeSelect',
    method: 'get',
    params: query
  })
}

export function selectOption(query) {
  return request({
    url: '/manager-goods/category/leaf/selectOption',
    method: 'get',
    params: query
  })
}

// 查询商品分类详细
export function getCategory(id) {
  return request({
    url: '/manager-goods/category/' + id,
    method: 'get'
  })
}

export function getCategoryByCode(code) {
  return request({
    url: '/manager-goods/category/leaf/' + code,
    method: 'get'
  })
}

// 新增商品分类
export function addCategory(data) {
  return request({
    url: '/manager-goods/category',
    method: 'post',
    data: data
  })
}

// 修改商品分类
export function updateCategory(data) {
  return request({
    url: '/manager-goods/category',
    method: 'put',
    data: data
  })
}

// 删除商品分类
export function delCategory(id) {
  return request({
    url: '/manager-goods/category/' + id,
    method: 'delete'
  })
}


// 查询商品分类属性列表
export function getCategoryAttribute(id) {
  return request({
    url: '/manager-goods/category/detail/'+id,
    method: 'get'
  })
}
