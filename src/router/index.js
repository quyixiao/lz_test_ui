import Vue from 'vue'
import VueRouter from 'vue-router'
import { mutations } from '@/store'
import Layout from '@/views/layout/index'
import { Message } from 'element-ui'
import { apiGetDocMenu, apiGetSpaceList } from '@/api/login'

Vue.use(VueRouter)

const parentRoute = [
  {
    path: '/page',
    name: 'page',
    component: Layout,
    children: [
      { path: ':id', name: 'pageId', component: () => import('@/views/page') }
    ]
  },
  // {
  //   path: '/testport',
  //   name: 'testport',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'testportId',
  //       meta: { title: '组列表' },
  //       component: () => import('@/views/testport')
  //     },
  //     {
  //       path: 'port/list',
  //       name: 'port',
  //       meta: { title: '接口列表' },
  //       component: () => import('@/views/testport/port')
  //     }
  //   ]
  // },
  {
    path: '/html',
    name: 'html',
    component: Layout,
    children: [
      {
        path: 'port/list',
        name: 'port',
        meta: { title: '接口列表' },
        component: () => import('@/views/testport/port')
      }
    ]
  },
  {
    path: '/pyeditor',
    name: 'pyEditor',
    component: Layout,
    children: [
      {
        path: 'add',
        name: 'addPort',
        meta: { title: '新建接口' },
        component: () => import('@/views/pyEditor/index')
      },
      {
        path: 'edit/:id',
        name: 'editPort',
        meta: { title: '编辑接口' },
        component: () => import('@/views/pyEditor/index')
      }
    ]
  },
  {
    path: '/home',
    name: 'home',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'home/index',
        component: () => import('@/views/home/index'),
        meta: { title: '首页' }
      }
    ]
  },
  {
    path: '/edit',
    name: 'page-edit',
    component: () => import('@/views/page/edit'),
    meta: { title: '编辑文档' }
  }
]

const globalRoutes = [
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    meta: { title: '404' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    meta: { title: '登录页' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/doc/',
  routes: globalRoutes
})

let isAddDynamicRoutes
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title
  if (isAddDynamicRoutes || isGlobalRoute(to, globalRoutes)) {
    next()
  } else {
    const spaceId = localStorage.getItem('spaceId')
    const params = {
      spaceId: spaceId
    }
    await apiGetDocMenu(params).then(res => {
      if (res.code === 1000) {
        isAddDynamicRoutes = true
        mutations.updateMenuList(handleMenuList(res.data.list))
        parentRoute[1].children.push(...handleRoutes(res.data.list))
        router.addRoutes(parentRoute)
        next({ ...to })
        apiGetSpaceList().then(res => {
          if (res.code === 1000) {
            mutations.updateSpaceList(
              res.data.map(item => ({ label: item.name, value: item.id }))
            )
          }
        })
      } else {
        Message.error(res.msg)
      }
    })
  }
})

function isGlobalRoute(to, routes) {
  if (routes.find(item => item.path === to.path)) return true
}

function handleMenuList(list) {
  const result = []
  list.forEach(item => {
    const obj = {
      id: item.id,
      title: item.name,
      path: item.url ? `/html/${item.url}` : `/page/${item.id}`,
      component: item.component
    }
    if (item.list && item.list.length) {
      obj.list = handleMenuList(item.list)
    }
    result.push(obj)
  })
  return result
}

function handleRoutes(list) {
  const result = []
  list.forEach(item => {
    if (item.url) {
      const url = item.url.replace(/\?.*$/g, '')
      const route = {
        path: url,
        name: item.id,
        meta: {
          title: item.name
        }
      }
      try {
        route.component = resolve => require([`@/views/${url}.vue`], resolve)
      } catch (e) {
        console.error(e)
      }
      result.push(route)
    }
    if (item.list && item.list.length) {
      result.push(...handleRoutes(item.list))
    }
  })
  return result
}

export default router
