<script setup>
  import { ref, reactive, computed } from 'vue'
  import slAccount from './components/account'
  import slMobile from './components/mobile'

  // 登录类型索引值
  const tabIndex = ref(0)
  // 表单相关数据
  const tabMetas = reactive([
    {
      title: '账号登录',
      subTitle: '手机号登陆',
    },
    {
      title: '手机号登录',
      subTitle: '账号登录',
    },
  ])

  // 当前登录信息
  const tabMeta = computed(() => {
    return tabMetas[tabIndex.value]
  })

  // 切换登录类型
  async function changeLoginType() {
    // 如果点击的是 app 端 ， 则弹出手机号的授权页面
    // #ifdef APP-PLUS
    const { authResult } = await uni.login({
      provider: 'univerify', // `provider`: 指定登录服务类型，`univerify` 表示是一键登录
      univerifyStyle: {
        // `univerifystyle` 自定义授权界面的样式
        fullScreen: true,
        icon: {
          path: 'static/logo.png', // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
        },
        authButton: {
          normalColor: '#ef4f3f', // 授权按钮正常状态背景颜色 默认值：#3479f5
          highlightColor: '#ef4f3f', // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）
        },
        privacyTerms: {
          defaultCheckBoxState: false,
          uncheckedImage: 'static/images/uncheckedImage.png',
          checkedImage: 'static/images/checkedImage.png',
          termsColor: '#ef4f3f',
        },
      },
    })
    // 当用户进行授权后再去调用云函数来换取手机号
    // 调用云函数
    uniCloud.callFunction({
      name: 'uni-login', // 文件名
      // 给云函数传的实参
      data: authResult,
    })
    // #endif

    // 如果不是app短板执行下面的逻辑
    // #ifndef APP-PLUS
    tabIndex.value = Math.abs(tabIndex.value - 1)
    // #endif
  }
</script>

<template>
  <view class="user-login">
    <view class="login-type">
      <view class="title">{{ tabMeta.title }}</view>
      <view class="type">
        <text @click="changeLoginType">{{ tabMeta.subTitle }}</text>
        <text class="iconfont icon-caret"></text>
      </view>
    </view>
    <sl-account v-if="tabIndex === 0"></sl-account>
    <sl-mobile v-else></sl-mobile>
  </view>
</template>

<style lang="scss" scoped>
  @import './index.scss';
</style>
