<script setup>
  import { ref } from 'vue'
  // 引入task仓库
  import { useTaskStore } from '@/stores/task'

  // 调用一下 拿到仓库taskStore
  const taskStore = useTaskStore()

  // 记录当前被选中选项的索引值
  const tabIndex = ref(-1)

  // 接收传入组件的数据
  // 在自定义组件的时接收外部传入的数据 defineProps  用 props 接收
  const props = defineProps({
    types: Array,
    dataKey: String, // 为组件自定义一个属性 `dataKey`  通过 `dataKey` 来区分用户当前点击的是哪个类型
  })

  // 点击选中选项
  function onOptionSelect(index, text, id) {
    // 高亮显示选中的选项
    tabIndex.value = index
    console.log('用户选中的值', tabIndex.value, text, '用户选中的类型', props.dataKey, 'id', id)
    // 将数据存入 Pinia 数据要的不是文字text 而是 id  所以要存入 id
    taskStore.recordData[props.dataKey] = id
    // taskStore.recordData[props.dataKey] = text
  }
</script>

<template>
  <view class="vehicle-options">
    <!-- 如果 index索引值 和 记录的索引值一样 就是选中了-->
    <view
      class="option"
      :class="{ active: tabIndex === index }"
      v-for="(option, index) in props.types"
      :key="option.id"
      @click="onOptionSelect(index, option.text, option.id)"
    >
      {{ option.text }}
    </view>
  </view>
</template>

<style lang="scss" scoped>
  .vehicle-options {
    display: flex;
    flex-wrap: wrap;
    font-size: $uni-font-size-small;

    .option {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 180rpx;
      height: 70rpx;
      padding-top: 1rpx;
      margin-top: 30rpx;
      margin-right: 38rpx;
      color: $uni-secondary-color;
      border: 2rpx solid $uni-bg-color;
      background-color: $uni-bg-color;
      border-radius: 20rpx;

      &:nth-child(3n) {
        margin-right: 0;
      }

      &.active {
        color: $uni-primary;
        border: 2rpx solid $uni-primary;
        background-color: #ffe0dd;
      }
    }
  }
</style>
