// 引入网络请求模块
import { uniFetch } from './uni-fetch.js'

// export const xxx = () => {}  推荐使用

export default {
  // 登录接口
  // data 表单登录需要的用户名和密码
  login(data) {
    if (!data.account || !data.password) return
    // 根据接口文档来调用接口
    return uniFetch.post('/driver/login/account', data)
  },
}
