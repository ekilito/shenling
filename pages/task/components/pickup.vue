<script setup>
  import { ref, onMounted } from 'vue'
  import taskApi from '@/apis/task'

  // 任务列表数据
  const pickUpList = ref([])
  // 是否为空列表
  const isEmpty = ref(false)
  // 下一页页码
  const nextPage = ref(1)
  // 每页包含数据条数
  const pageSize = ref(5)
  // 是否还有更多数据
  const hasMore = ref(true)
  // 是否加载完成
  const isTriggered = ref(false)

  // 上拉分页
  // 监听页面是否滚动到底部
  function onScrollToLower() {
    // 没有更多数据时则不需要再请求了
    if (!hasMore.value) return uni.utils.toast('没有更多数据了')
    // 获取下一页数据
    getPickUpList(nextPage.value)
  }

  // 下拉刷新
  async function onScrollViewRefresh() {
    isTriggered.value = true
    await getPickUpList()
    isTriggered.value = false
    uni.utils.toast('下拉刷新成功')
  }

  // 生命周期（也可以用其它的生命周期）
  onMounted(() => {
    getPickUpList()
  })

  // 获取任务列表
  async function getPickUpList(page = 1, pageSize = 5) {
    const { code, data } = await taskApi.list(1, page, pageSize)
    // 检测接口是否调用成功
    if (code !== 200) return uni.utils.toast('获取列表失败，稍后重试！')
    // 渲染任务列表
    pickUpList.value = [...pickUpList.value, ...(data.items || [])]
    // 计算下一页页码
    nextPage.value = ++data.page
    // 判断列表是否为空
    isEmpty.value = pickUpList.value.length === 0
    // 判断还有没有更多的数据
    hasMore.value = nextPage.value <= data.pages
  }
</script>

<template>
  <scroll-view
    @refresherrefresh="onScrollViewRefresh"
    @scrolltolower="onScrollToLower"
    scroll-y
    refresher-enabled
    :refresher-triggered="isTriggered"
    class="scroll-view"
  >
    <view class="scroll-view-wrapper">
      <view v-for="pickup in pickUpList" :key="pickup.id" class="task-card">
        <navigator hover-class="none" :url="`/subpkg_task/detail/index?id=${pickup.id}`">
          <view class="header">
            <text class="no">任务编号: {{ pickup.transportTaskId }}</text>
            <!--  <text class="status">已延迟</text> -->
          </view>
          <view class="body">
            <view class="timeline">
              <view class="line">{{ pickup.startAddress }}</view>
              <view class="line">{{ pickup.endAddress }}</view>
            </view>
          </view>
        </navigator>
        <view class="footer">
          <view class="label">提货时间</view>
          <view class="time">{{ pickup.planDepartureTime }}</view>
          <navigator
            v-if="pickup.enablePickUp"
            hover-class="none"
            :url="`/subpkg_task/pickup/index?id=${pickup.id}`"
            class="action"
            >提货</navigator
          >
          <navigator v-else hover-class="none" url=" " class="action disabled"> 提货 </navigator>
        </view>
      </view>

      <view v-if="isEmpty" class="task-blank">无待提货物</view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
