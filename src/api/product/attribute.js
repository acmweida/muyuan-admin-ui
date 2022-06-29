import request from '@/utils/request'

// 查询商品分类属性列表
export function getCategoryAttribute(id) {
  return request({
    url: '/api/product/category/attribute/detail/'+id,
    method: 'get'
  })
}

// 查询商品分类属性详细
export function getAttribute(id) {
  return request({
    url: '/api/product/category/attribute/' + id,
    method: 'get'
  })
}

// 新增商品分类属性
export function addAttribute(data) {
  return request({
    url: '/api/product/category/attribute',
    method: 'post',
    data: data
  })
}

// 修改商品分类属性
export function updateAttribute(data) {
  return request({
    url: '/api/product/category/attribute',
    method: 'put',
    data: data
  })
}

// 删除商品分类属性
export function delAttribute(id) {
  return request({
    url: '/api/product/category/attribute/' + id,
    method: 'delete'
  })
}
