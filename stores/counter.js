import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCounterStore = defineStore(
  'counter',
  () => {
    // 响应式数据
    const count = ref(0)

    // 定义方法
    function increment() {
      count.value++
    }
    function decrement() {
      count.value--
    }

    // 一定要将定义的数据和方法返回
    return { count, increment, decrement }
  },
  {
    // 持久化
    persist: {
      paths: ['count'], // 仅仅指定count持久化数据  提升性能
    },
  }
)
