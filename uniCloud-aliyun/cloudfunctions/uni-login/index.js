'use strict'
exports.main = async (event, context) => {
  //event 里面包含着客户端上传的参数
  // console.log(event)
  const res = await uniCloud.getPhoneNumber({
    appid: context.APPID, // 替换成自己开通一键登录的应用的DCloud appid
    provider: 'univerify',
    apiKey: 'a459f67141238b1e7e6cebfb7ee4e1d0', // 在开发者中心开通服务并获取apiKey
    apiSecret: 'fb13cb4d0f19199f843a0b26fd36138f', // 在开发者中心开通服务并获取apiSecret
    access_token: event.access_token,
    openid: event.openid,
  })

  console.log(res) // res里面包含这手机号

  // 执行用户信息入库等操作，正常情况下不要把完整手机号返回给前端
  // 在云函数中也可以调用后端接口将手机号存入后端数据中或云数据库中
  return {
    code: 200,
    message: '获取手机号成功',
  }
}
