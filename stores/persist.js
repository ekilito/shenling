import { createPersistedState } from 'pinia-plugin-persistedstate'

export const piniaPluginPersistedstate = createPersistedState({
  key: (id) => `__persisted__${id}`,
  storage: {
    // 获取key
    getItem: (key) => {
      return uni.getStorageSync(key)
    },
    // 设置key
    setItem: (key, value) => {
      uni.setStorageSync(key, value)
    },
  },
})

// localstorage 在小程序中用不了
