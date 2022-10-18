import request from '@/utils/request'

// 登录方法
export function login(username, password, captcha, uuid) {
  const data = {
    username,
    password,
    captcha,
    uuid,
    client_id: process.env.VUE_APP_CLIENT_NAME,
    client_secret: process.env.VUE_APP_CLIENT_SECRET,
    scope: process.env.VUE_APP_CLIENT_SCOPE,
    grant_type: process.env.VUE_APP_CLIENT_IMAGE_CAPTCHA,
    platform_type: process.env.VUE_APP_PLATFORM_TYPE
  }
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: [
      function (data) {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        ret = ret.substring(0, ret.lastIndexOf('&'));
        return ret
      }
    ],
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/user/user/get',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/auth/cancel',
    method: 'get'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/auth/captchaImage',
    method: 'get'
  })
}
