import request from '@/utils/request'

// 查询权限信息列表
export function listPermission(query) {
  return request({
    url: '/manager-system/permission/list',
    method: 'get',
    params: query
  })
}

// 查询权限信息详细
export function getPermission(id) {
  return request({
    url: '/manager-system/permission/' + id,
    method: 'get'
  })
}

// 新增权限信息
export function addPermission(data) {
  return request({
    url: '/manager-system/permission',
    method: 'post',
    data: data
  })
}

// 修改权限信息
export function updatePermission(data) {
  return request({
    url: '/manager-system/permission',
    method: 'put',
    data: data
  })
}

// 删除权限信息
export function delPermission(id) {
  return request({
    url: '/manager-system/permission/' + id,
    method: 'delete'
  })
}
