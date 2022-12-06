import request from '@/utils/request'

// 查询通用特征量列表
export function listFeature(query) {
  return request({
    url: '/manager-goods/feature/list',
    method: 'get',
    params: query
  })
}

export function selectOptions(query) {
  return request({
    url: '/manager-goods/feature/options',
    method: 'get',
    params: query
  })
}



// 查询通用特征量详细
export function getFeature(id) {
  return request({
    url: '/manager-goods/feature/' + id,
    method: 'get'
  })
}

// 新增通用特征量
export function addFeature(data) {
  return request({
    url: '/manager-goods/feature',
    method: 'post',
    data: data
  })
}

// 修改通用特征量
export function updateFeature(data) {
  return request({
    url: '/manager-goods/feature',
    method: 'put',
    data: data
  })
}

// 删除通用特征量
export function delFeature(id) {
  return request({
    url: '/manager-goods/feature/' + id,
    method: 'delete'
  })
}
