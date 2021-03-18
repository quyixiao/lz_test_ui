import Mock from 'mockjs'

// 登录响应参数
export const login = () => {
  Mock.mock('http://mock.com/login', 'post', {
    code: 1000,
    msg: '成功',
    data: {
      spaceId: 1,
      spaceName: '开发指南',
      roleId: 2,
      userName: 'zc',
      userId: '100',
      token: '123546566757'
    }
  })
}

// 退出响应参数
export const logout = () => {
  Mock.mock('http://mock.com/logout', 'post', {
    code: 1000,
    msg: '成功'
  })
}

// 空间列表响应
export const spaceList = () => {
  Mock.mock('http://mock.com/spaceList', 'post', {
    code: 1000,
    msg: '成功',
    data: {
      list: [
        { name: '开发指南', id: 1 },
        { name: '接口文档', id: 2 },
        { name: '空间3', id: 3 }
      ]
    }
  })
}

// 文档菜单响应
export const docMenu = () => {
  Mock.mock('http://mock.com/docMenu', 'post', {
    code: 1000,
    msg: '成功',
    data: {
      list: [
        {
          id: 1,
          path: 'system/index',
          title: '系统管理',
          list: [
            {
              id: 2,
              title: '用户管理',
              path: 'system/user/index'
            },
            {
              id: 3,
              title: '角色管理'
            },
            {
              id: 4,
              title: '菜单管理'
            },
            {
              id: 5,
              title: '日志管理',
              path: 'log',
              list: [
                {
                  id: 6,
                  title: '操作日志'
                },
                {
                  id: 7,
                  title: '登录日志'
                }
              ]
            }
          ]
        },
        {
          id: 8,
          title: '系统监控',
          path: 'monitor',
          list: [
            {
              id: 9,
              title: '在线用户'
            },
            {
              id: 10,
              title: '在线用户2'
            }
          ]
        }
      ]
    }
  })
}

// 获取文档
export const getDocContent = () => {
  Mock.mock('http://mock.com/docCotent', 'post', {
    code: 1000,
    msg: '成功',
    data: {
      content:
        '<table data-sort="sortDisabled"><tbody><tr class="firstRow"><td valign="top" rowspan="1" colspan="5" style="word-break: break-all;" height="0" width="409">需求明细</td><td valign="top" rowspan="1" colspan="4" style="word-break: break-all;" height="0" width="233">开发借款</td><td valign="top" colspan="2" rowspan="1" style="word-break: break-all;" height="0">测试阶段</td><td valign="top" colspan="2" rowspan="1" style="word-break: break-all;" height="0">上线<br/></td></tr><tr><td width="69" valign="top" style="word-break: break-all;" height="106">需求名称</td><td valign="top" style="word-break: break-all;" rowspan="1" colspan="3" width="141" height="106">需求背景</td><td width="154" valign="top" style="word-break: break-all;" height="106">模块、功能点</td><td width="66" valign="top" style="word-break: break-all;" height="106">开发人团</td><td width="68" valign="top" style="word-break: break-all;" height="106">开发时间</td><td width="16" valign="top" style="word-break: break-all;" height="106">结算时间</td><td width="54" valign="top" style="word-break: break-all;" height="106">当前进度</td><td valign="top" colspan="1" rowspan="1" width="55" style="word-break: break-all;" height="106">分支</td><td valign="top" colspan="1" rowspan="1" width="55" style="word-break: break-all;" height="106">测试人员</td><td valign="top" colspan="1" rowspan="1" width="55" style="word-break: break-all;" height="106">开始时间</td><td width="55" valign="top" style="word-break: break-all;" height="106">结束时间</td></tr><tr><td width="69" valign="top" style="word-break: break-all;" rowspan="8" colspan="1">借款入口关闭-易借优化</td><td width="41" valign="top"><br/></td><td width="55" valign="top" style="word-break: break-all;"><br/></td><td width="5" valign="top"><br/></td><td width="154" valign="top" style="word-break: break-all;"><span style="color: #333333; font-family: Arial, sans-serif; font-size: 14px; white-space: pre-wrap; background-color: #FFFFFF;">沃易贷3.0链接跳转配置开关</span></td><td width="55" valign="top" style="word-break: break-all;"><span style="color: #333333; font-family: Arial, sans-serif; font-size: 14px; white-space: pre-wrap; background-color: #FFFFFF;">朱华坤</span></td><td width="66" valign="top" style="word-break: break-all;"><span style="color: #333333; font-family: Arial, sans-serif; font-size: 14px; white-space: pre-wrap; background-color: #FFFFFF;">2020-12-1</span></td><td width="5" valign="top" style="word-break: break-all;"><span style="color: #333333; font-family: Arial, sans-serif; font-size: 14px; white-space: pre-wrap; background-color: #FFFFFF;">2020-12-1</span></td><td width="54" valign="top"><br/></td><td valign="top" colspan="1" rowspan="1" width="55" style="word-break: break-all;"><p style="margin-top: 0px; margin-bottom: 0px; color: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 14px; white-space: pre-wrap; background-color: rgb(255, 255, 255);"><span data-mce-style="color: #111f2c;" style="color: #111F2C;">service-api：version_1.5.11<br/></span></p><p style="margin-top: 10px; margin-bottom: 0px; color: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 14px; white-space: pre-wrap; background-color: rgb(255, 255, 255);"><span data-mce-style="color: #111f2c;" style="color: #111F2C;">test_html_lt01：h5_1.1.0</span></p></td><td valign="top" colspan="1" rowspan="1" width="55" style="word-break: break-all;"><span style="color: #333333; font-family: Arial, sans-serif; font-size: 14px; white-space: pre-wrap; background-color: #FFFFFF;">黎甜</span></td><td valign="top" colspan="1" rowspan="1" width="55" style="word-break: break-all;"><span style="color: #333333; font-family: Arial, sans-serif; font-size: 14px; white-space: pre-wrap; background-color: #FFFFFF;">2020-12-2</span></td><td width="55" valign="top" style="word-break: break-all;"><span style="color: #333333; font-family: Arial, sans-serif; font-size: 14px; white-space: pre-wrap; background-color: #FFFFFF;">2020-12-2</span></td></tr><tr><td width="41" valign="top"><br/></td><td width="55" valign="top"><br/></td><td width="55" valign="top"><br/></td><td width="54" valign="top"><br/></td><td width="104" valign="top"><br/></td><td width="66" valign="top"><br/></td><td width="5" valign="top"><br/></td><td width="54" valign="top"><br/></td><td valign="top" colspan="1" rowspan="1" width="55"><br/></td><td valign="top" colspan="1" rowspan="1" width="55"><br/></td><td valign="top" colspan="1" rowspan="1" width="55"><br/></td><td width="55" valign="top"><br/></td></tr><tr><td width="41" valign="top"><br/></td><td width="55" valign="top"><br/></td><td width="55" valign="top"><br/></td><td width="54" valign="top"><br/></td><td width="104" valign="top"><br/></td><td width="66" valign="top"><br/></td><td width="5" valign="top"><br/></td><td width="54" valign="top"><br/></td><td valign="top" colspan="1" rowspan="1" width="55"><br/></td><td valign="top" colspan="1" rowspan="1" width="55"><br/></td><td valign="top" colspan="1" rowspan="1" width="55"><br/></td><td width="55" valign="top"><br/></td></tr><tr><td width="41" valign="top"><br/></td><td width="55" valign="top"><br/></td><td width="55" valign="top"><br/></td><td width="54" valign="top"><br/></td><td width="104" valign="top"><br/></td><td width="66" valign="top"><br/></td><td width="5" valign="top"><br/></td><td width="54" valign="top"><br/></td><td valign="top" colspan="1" rowspan="1" width="55"><br/></td><td valign="top" colspan="1" rowspan="1" width="55"><br/></td><td valign="top" colspan="1" rowspan="1" width="55"><br/></td><td width="55" valign="top"><br/></td></tr><tr><td width="41" valign="top"><br/></td><td width="55" valign="top"><br/></td><td width="55" valign="top"><br/></td><td width="54" valign="top"><br/></td><td width="104" valign="top"><br/></td><td width="66" valign="top"><br/></td><td width="5" valign="top"><br/></td><td width="54" valign="top"><br/></td><td valign="top" colspan="1" rowspan="1" width="55"><br/></td><td valign="top" colspan="1" rowspan="1" width="55"><br/></td><td valign="top" colspan="1" rowspan="1" width="55"><br/></td><td width="55" valign="top"><br/></td></tr><tr><td width="41" valign="top"><br/></td><td width="55" valign="top"><br/></td><td width="55" valign="top"><br/></td><td width="54" valign="top"><br/></td><td width="104" valign="top"><br/></td><td width="66" valign="top"><br/></td><td width="5" valign="top"><br/></td><td width="54" valign="top"><br/></td><td valign="top" colspan="1" rowspan="1" width="55"><br/></td><td valign="top" colspan="1" rowspan="1" width="55"><br/></td><td valign="top" colspan="1" rowspan="1" width="55"><br/></td><td width="55" valign="top"><br/></td></tr><tr><td width="41" valign="top"><br/></td><td width="55" valign="top"><br/></td><td width="55" valign="top"><br/></td><td width="54" valign="top"><br/></td><td width="104" valign="top"><br/></td><td width="66" valign="top"><br/></td><td width="5" valign="top"><br/></td><td width="54" valign="top"><br/></td><td valign="top" colspan="1" rowspan="1" width="55"><br/></td><td valign="top" colspan="1" rowspan="1" width="55"><br/></td><td valign="top" colspan="1" rowspan="1" width="55"><br/></td><td width="55" valign="top"><br/></td></tr><tr><td width="41" valign="top" height="60"><br/></td><td width="55" valign="top" height="60"><br/></td><td width="55" valign="top" height="60"><br/></td><td width="54" valign="top" height="60"><br/></td><td width="104" valign="top" height="60"><br/></td><td width="66" valign="top" height="60"><br/></td><td width="5" valign="top" height="60"><br/></td><td width="54" valign="top" height="60"><br/></td><td valign="top" colspan="1" rowspan="1" width="55" height="60"><br/></td><td valign="top" colspan="1" rowspan="1" width="55" height="60"><br/></td><td valign="top" colspan="1" rowspan="1" width="55" height="60"><br/></td><td width="55" valign="top" height="60"><br/></td></tr></tbody></table><p><br/></p>'
    }
  })
}

// 编辑文档
export const updateDocContent = () => {
  Mock.mock('http://mock.com/updateDoc', 'post', {
    code: 1000,
    msg: '成功'
  })
}

// 新建文档
export const createDocContent = () => {
  Mock.mock('http://mock.com/createDoc', 'post', {
    code: 1000,
    msg: '成功',
    data: {
      id: 123
    }
  })
}

// 新建页面
export const createPage = () => {
  Mock.mock('http://mock.com/createPage', 'post', {
    code: 1000,
    msg: '成功'
  })
}

// 新建空间
export const createSpace = () => {
  Mock.mock('http://mock.com/createSpace', 'post', {
    code: 1000,
    msg: '成功',
    data: {
      spaceId: 100
    }
  })
}
