import request from '@/utils/request'
import { login, docMenu, spaceList, logout } from './mock'
login()
logout()
docMenu()
spaceList()

// 登录
export const apiProcessList = data => {
  console.log(data)
  return request({
    url: '/lt-web/task/list',
    method: 'post',
    data
  })
}

export const apiProcessInfo = data => {
  console.log(data)
  return request({
    url: '/lt-web/task/info',
    method: 'post',
    data
  })
}

export const apiDepartmentInfo = data => {
  console.log(data)
  return request({
    url: '/lt-web/task/departments',
    method: 'post',
    data
  })
}

export const addOrUpdateTask = data => {
  console.log(data)
  return request({
    url: '/lt-web/task/addOrUpdateTask',
    method: 'post',
    data
  })
}

export const apiHandleDelete = data => {
  console.log(data)
  return request({
    url: '/lt-web/task/delete',
    method: 'post',
    data
  })
}
