<script setup>
  import { reactive, ref } from 'vue'
  import { onLoad } from '@dcloudio/uni-app'
  // 导入 userAPI
  import userAPI from '@/apis/user.js'
  // 导入状态数据
  import { useUserStore } from '@/stores/user'
  // 调用 useUserStore 来读取数据
  const userStore = useUserStore()

  // 表单元素的 ref 属性
  const accountForm = ref()

  // 回跳地址
  const redirectURL = ref('')
  // 跳转地址方式
  const routeType = ref('')

  // 定义表单中的响应式数据 reactive定义的值不能修改
  const formData = reactive({
    account: '',
    password: '',
  })

  // 定义表单数据验证规则
  const accountRules = reactive({
    account: {
      rules: [
        { required: true, errorMessage: '请输入登录账号' },
        { pattern: '^[a-zA-Z0-9]{6,8}$', errorMessage: '登录账号格式不正确' },
      ],
    },
    password: {
      rules: [
        { required: true, errorMessage: '请输入登录密码' },
        { pattern: '^\\d{6}$', errorMessage: '登录密码格式不正确' },
      ],
    },
  })

  // 获取地址中的参数
  onLoad((query) => {
    redirectURL.value = query.redirectURL
    routeType.value = query.routeType
    console.log(redirectURL.value, routeType.value)
  })

  // 监听表单的提交
  async function onFormSubmit() {
    try {
      // 验证通过
      // 当验证成功后所返回的数据为 表单中的数据 这些数据用于表单提交
      const formData = await accountForm.value.validate()
      // 表单的数据
      // console.log(formData)
      // 调用登录接口
      const { code, data } = await userAPI.login(formData)
      // 提示
      uni.utils.toast('登录成功')
      // 验证失败会提示失败的原因
      if (code !== 200) return uni.utils.toast('登录失败，请重试！')

      // 持久化存储用户登录状态  data就是获取的token 在pinia中允许直接对数据进行修改
      userStore.token = data

      console.log(routeType.value)

      // 地址重定向或switchTab
      // console.log(redirectURL.value)
      // uni[routeType.value]({ url: redirectURL.value })

      // 解决打包h5端登陆页面的问题
      // 地址重定向或switchTab
      if (routeType.value === 'switchTab') {
        uni.switchTab({ url: redirectURL.value })
      } else {
        uni.redirectTo({ url: redirectURL.value })
      }
    } catch (err) {
      // 验证失败
      console.log(err)
    }
  }
</script>

<template>
  <uni-forms class="login-form" ref="accountForm" :model="formData" :rules="accountRules">
    <uni-forms-item name="account">
      <input
        type="text"
        v-model="formData.account"
        placeholder="请输入账号"
        class="uni-input-input"
        placeholder-style="color: #818181"
      />
    </uni-forms-item>
    <uni-forms-item name="password">
      <input
        type="text"
        v-model="formData.password"
        placeholder="请输入密码"
        class="uni-input-input"
        placeholder-style="color: #818181"
      />
    </uni-forms-item>
    <button @click="onFormSubmit" class="submit-button">登录</button>
  </uni-forms>
</template>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
