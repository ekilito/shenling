// 项目中一系列的工具方法

export const utils = {
  toast(title = '数据加载失败', icon = 'none') {
    uni.showToast({
      title,
      icon,
      mask: true,
    })
  },
}

// 为了方便使用 全局进行使用
uni.utils = utils
