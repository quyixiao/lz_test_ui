import request from '@/utils/request'
import { login, docMenu, spaceList, logout } from './mock'
login()
logout()
docMenu()
spaceList()

// 登录
export const apiLogin = data => {
  console.log(data)
  return request({
    url: '/lt-web/user/login',
    method: 'post',
    data
  })
}

// 退出
export const apiLogout = data => {
  console.log(data)
  return request({
    url: 'http://mock.com/logout',
    method: 'post',
    data
  })
}

// 获取用户空间列表
export const apiGetSpaceList = data => {
  console.log(data)
  return request({
    url: '/lt-web/sysSpace/list',
    method: 'post',
    data
  })
}

// 获取用户文档菜单
export const apiGetDocMenu = data => {
  console.log(data)
  return request({
    url: '/lt-web/sysMenu/getTreeBySpaceId',
    method: 'post',
    data
  })
}

// 测试api
export const apiPostDataApi = data => {
  return request({
    url: '/lt-web/user/test',
    method: 'post',
    data
  })
}
