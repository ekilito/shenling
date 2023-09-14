<script setup>
  import { ref, onMounted } from 'vue'
  // 引入messageAPI
  import messageAPI from '@/apis/message.js'

  // 任务列表数据 任务通知列表
  const notifyList = ref([])
  // 当前列表是否为空列表
  const isEmpty = ref(false)
  // 下一页页码
  //const nextPage = ref(1)
  // 每页包含数据条数
  //const pageSize = ref(5)

  // 生命周期
  onMounted(() => {
    getNotifyList()
  })

  async function getNotifyList(page = 1, pageSize = 10) {
    // 调用接口
    const { code, data } = await messageAPI.list(201, page, pageSize)
    // console.log(res)
    // 检测接口是否调用成功
    if (code !== 200) return uni.utils.toast('获取通知失败，稍后重试!')
    // 渲染数据
    notifyList.value = data.items || []
    // 是否为空列表
    isEmpty.value = notifyList.value.length === 0
  }
</script>
<template>
  <scroll-view class="scroll-view" refresher-enabled scroll-y>
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
