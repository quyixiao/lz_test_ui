import axios from 'axios'
import { Message } from 'element-ui'
import VueCookie from 'vue-cookie'
import router from '../router'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

const service = axios.create({
  baseURL: '',
  timeout: 10000
})
// request拦截器
service.interceptors.request.use(
  config => {
    const token = VueCookie.get('token')
    if (token) {
      config.headers.token = token
    }
    const spaceId = localStorage.getItem('spaceId')
    config.headers.spaceId = spaceId
    return config
  },
  error => {
    Message.error('请求超时')
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  res => {
    if (res.status === 200) {
      return res.data
    }
  },
  error => {
    if (error.response.status === 504 || error.response.status === 404) {
      Message.error('服务器正在外太空遨游，请稍后再试~')
    } else if (error.response.status === 403) {
      Message.error('权限不足，请重新登陆')
      router.replace({ path: '/login' })
    }
    return Promise.resolve(error)
  }
)

export default service
