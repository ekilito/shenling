// 导入装好的 uni-app-fetch 插件
import { createUniFetch } from 'uni-app-fetch'
// 导入用户相关的store
import { useUserStore } from '@/stores/user'

// 定义 tabBar 的路径 三个tabbar页面要区别对待  跳转的方式不一样
// 将当前项目所有 tabBar 页面列出来
const tabBarPagePaths = ['pages/task/index', 'pages/message/index', 'pages/my/index']

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
    response({ statusCode, data }) {
      // 判断响应结果是不是401 如果是表明用户未登录或登录失效
      // 此时需要引导用户完成登录
      if (statusCode === 401) {
        // 页面栈 页面跳转的历史 全局的 getCurrentPages() 获取页面栈
        // 1.页面栈是一个数组
        // 2.页面栈中放的是已经打开的页面
        // 3.页面被打开的顺序恰好是数组单元存入的顺序
        // 4.返回操作会关闭一个页面
        // 5.页面栈的最后一个单元即当前页面！
        const pageStack = getCurrentPages()
        // 获取当前页面地址  通过页面栈实例获取 即页面栈数组的最后一个单元！ route是页面路径
        const redirectURL = pageStack[pageStack.length - 1].route
        // 跳转到登录页(需要在地址上平凑哦，即回调地址)
        // 是 tabBar 页面需要使用 switchTab 跳转   不是tabbar页面就redirectTo跳转

        // 判断数组中是否包含某个单元
        const routeType = tabBarPagePaths.includes(redirectURL) ? 'switchTab' : 'redirectTo'

        // 跳转到登录页(需要在地址上拼凑参数，即回跳地址)
        return uni.redirectTo({
          url: `/pages/login/index?redirectURL=/${redirectURL}&routeType=${routeType}`,
        })
      }

      // 将返回数据中多余部分过滤掉
      return data
    },
  },
})
