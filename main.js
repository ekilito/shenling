// 引入 Pinia
import { createPinia } from 'pinia'
import { createSSRApp } from 'vue'
// 持久化插件
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { piniaPluginPersistedstate } from '@/stores/persist'

import App from './App'
// 在项目入口引入 utils.js
import '@/utils/utils'

export function createApp() {
  const app = createSSRApp(App)
  // 实例化Pinia
  const pinia = createPinia()
  // 传递给项目应用
  app.use(pinia)
  // Pinia 持久化插件
  // pinia.use(piniaPluginPersistedstate)
  // Pinia 持久化插件
  pinia.use(piniaPluginPersistedstate)

  return { app }
}
