<script setup>
  import { ref, onMounted } from 'vue'
  // 引入messageAPI
  import messageAPI from '@/apis/message.js'

  // 任务列表数据 任务通知列表
  const notifyList = ref([])
  // 当前列表是否为空列表
  const isEmpty = ref(false)
  // 下一页页码 定义页码来记录请求第几页
  const nextPage = ref(1)
  // 每页包含数据条数
  const pageSize = ref(5)
  // 是否还有更多数据
  const hasMore = ref(true)
  // 是否加载完成
  const isTriggered = ref(false)

  // 生命周期
  onMounted(() => {
    getNotifyList()
  })

  // 上拉分页
  function onScrollToLower() {
    console.log('到底了...开始发送请求获取数据')
    // 如果没有更多数据了 不获取下一页
    if (!hasMore.value) return uni.utils.toast('没有更多数据啦')
    // 获取下一页数据
    getNotifyList(nextPage.value)
  }

  // 下拉刷新
  async function onScrollViewRefresh() {
    console.log('下拉刷新啦...')
    // 开启下拉
    isTriggered.value = true
    // 必须在请求结束后 才结束下拉的动画
    await getNotifyList() // 没有传惨 默认page=1
    // 关闭下拉
    isTriggered.value = false
    uni.utils.toast('下拉刷新成功')
  }

  async function getNotifyList(page = 1, pageSize = 5) {
    // 调用接口
    const { code, data } = await messageAPI.list(201, page, pageSize)
    // console.log(res)
    // 检测接口是否调用成功
    if (code !== 200) return uni.utils.toast('获取通知失败，稍后重试!')
    // 清空原始的数据 下拉刷新时候 重置数据
    if (page === 1) notifyList.value = []
    // 渲染数据  合并数据
    notifyList.value = [...notifyList.value, ...data.items]
    // 更新下一页页码
    nextPage.value = ++data.page
    // 是否还有更多数据
    // 如果下一页的页码 `nextPage` 小于等于总页码 `data.page` 时，表明还有更多的数据，否则没有更多数据了
    hasMore.value = nextPage.value <= data.pages
    // 是否为空列表
    isEmpty.value = notifyList.value.length === 0
  }
</script>
<template>
  <!-- scrolltolower 事件监听页面是否滚动到达底部
   scroll-y 垂直滚动
   refresher-enabled 下拉刷新
    @refresherrefresh="onScrollViewRefresh" 下拉刷新效果
    :refresher-triggered="isTriggered"  绑定下拉交互
   -->
  <scroll-view
    @refresherrefresh="onScrollViewRefresh"
    @scrolltolower="onScrollToLower"
    class="scroll-view"
    refresher-enabled
    :refresher-triggered="isTriggered"
    scroll-y
  >
    <view class="scroll-view-wrapper">
      <view class="message-action">
        <text class="iconfont icon-clear"></text>
        全部已读
      </view>
      <uni-card v-for="notify in notifyList" :key="notify.id" :border="false" :is-shadow="false">
        <view class="brief">{{ notify.content }}</view>
        <view class="extra">
          <text class="time">{{ notify.created }}</text>
          <navigator hover-class="none" class="link" :url="`/subpkg_task/detail/index?id=${notify.id}`"
            >查看详情</navigator
          >
        </view>
        <template v-slot:title>
          <view :class="{ unread: !notify.isRead }" class="title">您有新的运输任务</view>
        </template>
      </uni-card>

      <view v-if="isEmpty" class="message-blank">暂无消息</view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
