// 导入装好的 uni-app-fetch 插件
import { createUniFetch } from 'uni-app-fetch'

// 配置符合自身业务的请求对象

export const uniFetch = createUniFetch({
  baseURL: 'https://slwl-api.itheima.net', // 基地址
  loading: { title: '正在加载...' },
  intercept: {
    // 请求拦截器
    request(options) {
      // 后续补充实际逻辑
      return options
    },
    // 响应拦截器
    response(result) {
      // 后续补充实际逻辑

      return result
    },
  },
})
