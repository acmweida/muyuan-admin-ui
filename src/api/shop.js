import request from '@/utils/request'

export function getShop() {
  return request({
    url: '/api/member/user/getUserInfo',
    method: 'get'
  })
}
