import request from '@/utils/request'

// 查询通用特征值列表
export function listValue(query) {
  return request({
    url: '/manager-goods/value/list',
    method: 'get',
    params: query
  })
}

// 查询通用特征值详细
export function getValue(id) {
  return request({
    url: '/manager-goods/value/' + id,
    method: 'get'
  })
}

// 新增通用特征值
export function addValue(data) {
  return request({
    url: '/manager-goods/value',
    method: 'post',
    data: data
  })
}

// 修改通用特征值
export function updateValue(data) {
  return request({
    url: '/manager-goods/value',
    method: 'put',
    data: data
  })
}

// 删除通用特征值
export function delValue(id) {
  return request({
    url: '/manager-goods/value/' + id,
    method: 'delete'
  })
}
