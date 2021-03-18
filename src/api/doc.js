import request from '@/utils/request'
import {
  getDocContent,
  updateDocContent,
  createDocContent,
  createPage,
  createSpace
} from './mock'
getDocContent()
updateDocContent()
createPage()
createDocContent()
createSpace()

// 获取文档内容
export const apiGetDocContent = data => {
  console.log(data)
  return request({
    url: '/lt-web/ordinaryDoc/getDoc',
    method: 'post',
    data
  })
}

// 更新文档内容
export const apiUpdateDocContent = data => {
  console.log(data)
  return request({
    url: '/lt-web/ordinaryDoc/editDoc',
    method: 'post',
    data
  })
}

// 新疆文档
export const apiCreateDoc = data => {
  console.log(data)
  return request({
    url: 'http://mock.com/createDoc',
    method: 'post',
    data
  })
}

// 新疆页面
export const apiCreatePage = data => {
  console.log(data)
  return request({
    url: '/lt-web/sysMenu/saveOrUpdate',
    method: 'post',
    data
  })
}

// 新建空间
export const apiCreateSpace = data => {
  console.log(data)
  return request({
    url: '/lt-web/sysSpace/saveOrUpdate',
    method: 'post',
    data
  })
}

// 获取项目分支列表
export const apiGetSpaceBranchs = data => {
  console.log(data)
  return request({
    url: '/lt-web/git/branch',
    method: 'get',
    data
  })
}

// 生成分支API文档
export const apiGetBranchsAPI = data => {
  console.log(data)
  return request({
    url: '/lt-web/api/start/generate/api',
    method: 'get',
    params: data
  })
}

// 删除菜单
export const apiDeleteMenu = data => {
  console.log(data)
  return request({
    url: '/lt-web/sysMenu/delete',
    method: 'post',
    data
  })
}
