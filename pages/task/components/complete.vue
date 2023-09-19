<script setup>
  import { ref, onMounted } from 'vue'
  import taskApi from '@/apis/task'

  // 已完成任务列表
  const completeList = ref([])
  // 在途列任务列表是否为空
  const isEmpty = ref(false)
  // 计算下一页页码
  const nextPage = ref(1)
  // 判断还有没有更多数据
  const hasMore = ref(true)
  const isTriggered = ref(false)

  // 上拉分页
  function onScrollToLower() {
    if (!hasMore.value) return
    // 获取下一页数据
    getCompleteList(nextPage.value)
  }

  // 监听用户的下拉操作
  async function onScrollViewRefresh() {
    isTriggered.value = true
    await getCompleteList()
    // 关闭动画交互
    isTriggered.value = false
    uni.utils.toast('下拉刷新成功')
  }

  // 生命周期（获取数据）
  onMounted(() => {
    getCompleteList()
  })

  async function getCompleteList(page = 1, pageSize = 5) {
    // 调用接口  司机的运输任务完成回成登记后状态会变成 `6` 即已完成的状态。
    const { code, data } = await taskApi.list(6, page, pageSize)
    // 检测接口是否成功
    if (code !== 200) return uni.utils.toast('已完成任务获取失败！')
    // 页面为 1 时，清空数组
    if (page === 1) completeList.value = []
    // 渲染数据
    completeList.value = [...completeList.value, ...(data.items || [])]
    // 更新下一页页码
    nextPage.value = ++data.page
    // 是否为空列表
    isEmpty.value = completeList.value.length === 0
    // 是否有更多数据
    hasMore.value = nextPage.value <= data.pages
  }
</script>

<template>
  <view class="task-search">
    <view class="search-bar">
      <text class="iconfont icon-search"></text>
      <input class="input" type="text" placeholder="输入任务编号" />
    </view>
    <view class="filter-bar">
      <picker class="picker" mode="date">2023.05.20</picker>
      <text class="text">至</text>
      <picker class="picker" mode="date">结束时间</picker>
      <button disabled class="button">筛选</button>
    </view>
  </view>
  <scroll-view
    @refresherrefresh="onScrollViewRefresh"
    @scrolltolower="onScrollToLower"
    :refresher-triggered="isTriggered"
    scroll-y
    refresher-enabled
    class="scroll-view"
  >
    <view class="scroll-view-wrapper">
      <view v-for="complete in completeList" :key="complete.id" class="task-card">
        <navigator hover-class="none" :url="`/subpkg_task/detail/index?id=${complete.id}`">
          <view class="header">
            <text class="no">任务编号: {{ complete.transportTaskId }}</text>
          </view>
          <view class="body">
            <view class="timeline">
              <view class="line">{{ complete.startAddress }}</view>
              <view class="line">{{ complete.endAddress }}</view>
            </view>
          </view>
        </navigator>
        <view class="footer flex">
          <view class="label">提货时间</view>
          <view class="time">{{ complete.created }}</view>
        </view>
      </view>
      <view v-if="isEmpty" class="task-blank">无完成货物</view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
  @import './styles.scss';

  .task-search {
    padding: 30rpx;
    // margin-top: -1rpx;
    background-color: #fff;
    border-bottom: 1rpx solid #eee;

    .search-bar {
      position: relative;

      .icon-search {
        position: absolute;
        top: 22rpx;
        left: 24rpx;
        color: $uni-secondary-color;
        font-size: $uni-font-size-small;
      }

      .input {
        height: 72rpx;
        background-color: #f4f4f4;
        border-radius: 72rpx;
        padding-left: 72rpx;
        font-size: $uni-font-size-small;
      }
    }

    .filter-bar {
      display: flex;
      margin-top: 30rpx;
      font-size: $uni-font-size-small;
      text-align: center;
      line-height: 64rpx;
      color: $uni-secondary-color;

      .picker {
        width: 230rpx;
        height: 64rpx;
        border-radius: 64rpx;
        background-color: $uni-bg-color;
      }

      .text {
        margin: 0 24rpx;
      }

      .button {
        width: 120rpx;
        height: 64rpx;
        padding: 0;
        margin-left: 40rpx;
        line-height: 64rpx;
        border-radius: 64rpx;
        font-size: $uni-font-size-small;
        color: #fff;
        background-color: $uni-primary;

        &[disabled] {
          background-color: #fadcd9;
        }
      }
    }
  }
</style>
