import request from '@/utils/request'

// 获取组列表
export const apiGetGroupList = data => {
  return request({
    url: '/lt-web/group/list',
    method: 'post',
    data
  })
}

// 添加编辑组
export const apiModifyGroup = data => {
  return request({
    url: '/lt-web/group/doAddOrUpdate',
    method: 'post',
    data
  })
}

// 获取单条组
export const apiGetGroupInfo = data => {
  return request({
    url: '/lt-web/group/toUpate',
    method: 'post',
    data
  })
}

// 获取组的所有接口
export const apiGetGroupPort = data => {
  return request({
    url: '/lt-web/group/interface/list',
    method: 'post',
    data
  })
}

// 接口列表
export const apiGetPortList = data => {
  return request({
    url: '/lt-web/interface/list',
    method: 'post',
    data
  })
}

// 接口更新添加
export const apiModifyPory = data => {
  return request({
    url: '/lt-web/interface/doAddOrUpdate',
    method: 'post',
    data
  })
}

// 去编辑接口
export const apiGetPortInfo = data => {
  return request({
    url: '/lt-web/interface/toUpate',
    method: 'post',
    data
  })
}

// 组添加接口
export const apiAddPort = data => {
  return request({
    url: '/lt-web/group/doAddInterface',
    method: 'post',
    data
  })
}

// 组编辑接口
export const apiModifyGroupPort = data => {
  return request({
    url: '/lt-web/group/interface/update',
    method: 'post',
    data
  })
}

// 接口测试
export const apiTestPort = data => {
  return request({
    url: '/lt-web/interface/run',
    method: 'post',
    data
  })
}

// 组接口测试
export const apiTestGroup = data => {
  return request({
    url: '/lt-web/group/groupInterface/test',
    method: 'post',
    data
  })
}

// 接口结果值轮询
export const apiGetPortResult = data => {
  return request({
    url: '/lt-web/group/test/result',
    method: 'post',
    data
  })
}
