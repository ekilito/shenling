<script setup>
  import { computed, ref } from 'vue'
  import { onLoad } from '@dcloudio/uni-app'
  import taskApi from '@/apis/task'
  // 接收传过来的原计划提货时间
  const planDepartureTime = ref('')
  // 延迟提货任务的ID
  const id = ref('')

  // 获取地址上的参数
  onLoad((query) => {
    // 接收原计划提货时间
    planDepartureTime.value = query.planDepartureTime
    // 接收提货任务的id
    id.value = query.id
  })

  // 延迟提货时间
  const delayTime = ref('')

  // 监听用户选择时间
  function onPickerChange(ev) {
    // console.log(ev) // ev.detail.value 当前选择的时间
    // delayTime.value = ev.detail.value
    // 延迟时间必定与原定时间处于同一天
    const [date] = planDepartureTime.value.split(' ')
    console.log(date) // 今天的日期
    // 延迟提货时间，需要拼接日期
    delayTime.value = `${date} ${ev.detail.value}`
  }

  // 延迟原因
  const delayReason = ref('')
  // 统计输入字数
  const wordsCount = computed(() => delayReason.value.length)

  // 验证延迟时间 用户一选择就开始验证
  const delayTimeValid = computed(() => {
    // 延迟时间不能超过两个小时
    const start = new Date(planDepartureTime.value) // 原定的时间
    const end = new Date(delayTime.value) // 用户选择的时间
    return end - start > 0 && end - start < 7200 * 1000
  })

  // 验证延迟原因
  const delayReasonValid = computed(() => {
    return wordsCount.value <= 50 && wordsCount.value > 0
  })

  // 是否允许表单提交按钮的功能
  const enableSubmit = computed(() => {
    return !delayReasonValid.value || !delayTimeValid.value
  })

  // 表单提交
  async function onSubmitForm() {
    // console.log('提交')
    // 待提交的数据
    const formData = {
      id: id.value,
      delayTime: delayTime.value,
      delayReason: delayReason.value,
    }
    const { code } = await taskApi.delay(formData)
    // 检测接口是否调用成功
    if (code !== 200) return uni.utils.toast('提交数据失败，稍后重试!')
    // 跳转到任务列表
    uni.reLaunch({
      url: '/pages/task/index',
    })
    uni.utils.toast('延迟提货成功!')
  }
</script>

<template>
  <view class="page-container">
    <uni-list :border="false">
      <uni-list-item title="原定时间 " showArrow :rightText="planDepartureTime" />
      <uni-list-item title="延迟时间" showArrow>
        <template v-slot:footer>
          <picker @change="onPickerChange" class="time-picker" mode="time">
            <text v-if="!delayTime">不可超过2个小时</text>
            <text :class="{ error: !delayTimeValid }" v-else>{{ delayTime + ':00' }}</text>
          </picker>
        </template>
      </uni-list-item>
      <uni-list-item direction="column">
        <template v-slot:body>
          <view class="textarea-wrapper">
            <textarea
              v-model="delayReason"
              class="textarea"
              placeholder-style="color: #818181"
              placeholder="请输入延迟提货原因"
            ></textarea>
            <text :class="{ error: wordsCount > 50 }" class="words-count">{{ wordsCount }}/50</text>
          </view>
        </template>
      </uni-list-item>
      <uni-list-item :border="false">
        <template v-slot:body>
          <button @click="onSubmitForm" :disabled="enableSubmit" class="button">提交</button>
        </template>
      </uni-list-item>
    </uni-list>
  </view>
</template>

<style lang="scss" scoped>
  @import './index.scss';
</style>
