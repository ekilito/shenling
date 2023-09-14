// 导入装好的 uni-app-fetch 插件
import { createUniFetch } from 'uni-app-fetch'
// 导入用户相关的store
import { useUserStore } from '@/stores/user'

// 配置符合自身业务的请求对象
export const uniFetch = createUniFetch({
  baseURL: 'https://slwl-api.itheima.net', // 基地址
  loading: { title: '正在加载...' },
  intercept: {
    // 请求拦截器
    request(options) {
      const userState = useUserStore()
      // 全局公共头信息 自定义头信息 扩展一个 方便
      const defaultHeaders = {
        Authorization: userState.token,
        // a: '',
        // b: ''
      }
      // console.log(options)
      // 自定义头信息（token）  合并对象 将定义好的头信息与请求本身的头信息options.header合并
      options.header = Object.assign({}, defaultHeaders, options.header)
      // 记得return出去
      return options
    },
    // 响应拦截器
    response({ data }) {
      // 后续补充实际逻辑
      // 过滤多余的数据
      return data
    },
  },
})
