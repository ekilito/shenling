import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    // 登录状态 定义一个数据 token 用来记录用户的登录状态
    const token = ref('')

    return { token }
  },
  {
    persist: {
      paths: ['token'],
    },
  }
)
