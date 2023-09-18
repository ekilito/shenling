<script setup>
  import { ref } from 'vue'
  import slVehicleViolation from './components/vehicle-violation'
  import slVehicleBreakdown from './components/vehicle-breakdown'
  import slVehicleAccident from './components/vehicle-accident'
  import { onLoad } from '@dcloudio/uni-app'
  // 导入 pinia
  import { storeToRefs } from 'pinia'
  import { useTaskStore } from '@/stores/task'

  // 回车登记的全部数据 解构保持响应式
  const { recordData } = storeToRefs(useTaskStore())

  // 回车时间（临时性的）
  const endTime = ref('')

  // 出车时间
  const startTime = ref('')

  // 获取地址参数
  onLoad((query) => {
    console.log(query) // {transportTaskId: '3091808271628768382', actualDepartureTime: '2023-09-18 08:32:00'}
    // startTime.value = query.actualDepartureTime //出车时间
    // 任务ID  存入store
    recordData.value.id = query.transportTaskId
    // 发车时间  存入store
    recordData.value.startTime = query.actualDepartureTime
  })
</script>
<template>
  <view class="page-container">
    <scroll-view class="scroll-view" scroll-y>
      <view class="scroll-view-wrapper">
        <uni-list class="base-info">
          <uni-list-item title="出车时间" show-arrow :right-text="recordData.startTime" />
          <uni-list-item show-arrow title="回车时间">
            <template v-slot:footer>
              <!-- 回车时间 -->
              <uni-datetime-picker v-model="recordData.endTime">
                <view class="picker-value">{{ recordData.endTime || '请选择' }}</view>
              </uni-datetime-picker>
            </template>
          </uni-list-item>
        </uni-list>
        <sl-vehicle-violation></sl-vehicle-violation>
        <sl-vehicle-breakdown></sl-vehicle-breakdown>
        <sl-vehicle-accident></sl-vehicle-accident>
      </view>
    </scroll-view>
    <view class="toolbar">
      <button class="button">提交登记</button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
  @import './index.scss';
</style>
