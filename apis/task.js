// apis/task.js
// 引入网络请求模块
import { uniFetch } from './uni-fetch'
export default {
  /**
   * 任务列表
   * @param {number} status - 任务状态
   * @param {string} page - 数据页码
   * @param {string} pageSize - 每页数据条件
   */
  list(status, page = 1, pageSize = 10) {
    return uniFetch.get('/driver/tasks/list', { status, page, pageSize })
  }
  /**
   * 任务详情
   * @param {string} id - 任务ID
   */,
  detail(id) {
    if (!id) return
    return uniFetch.get(`/driver/tasks/details/${id}`)
  },
}
