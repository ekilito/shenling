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
  // 用户信息
  profile() {
    return uniFetch.get('/driver/users')
  },
  /**
   * 任务数据
   * @param {string} year - 任务数据的年份
   * @param {string} month - 任务数据的月份
   */
  task(year, month) {
    return uniFetch.get('/driver/users/taskReport', { year, month })
  },
  // 车辆信息
  truck() {
    return uniFetch.get('/driver/users/truck')
  },
}
