import request from '@/utils/request'

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/manager-system/menu/list',
    method: 'get',
    params: query
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: '/manager-system/menu/' + menuId,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/manager-system/menu/treeSelect',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeSelect(roleId) {
  return request({
    url: '/manager-system/menu/roleMenuTreeSelect/' + roleId,
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data,token) {
  return request({
    url: '/manager-system/menu?token='+token,
    method: 'post',
    data: data
  })
}

// 新增菜单
export function getToken() {
  return request({
    url: '/manager-system/menu/token',
    method: 'get'
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/manager-system/menu',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenu(menuId) {
  return request({
    url: '/manager-system/menu/' + menuId,
    method: 'delete'
  })
}
