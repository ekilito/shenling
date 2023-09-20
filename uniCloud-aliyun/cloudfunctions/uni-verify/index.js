'use strict'
exports.main = async (event, context) => {
  // event为客户端上传的参数
  // console.log('event : ', event)
  // 云函数获取实人认证实例
  const frvManager = uniCloud.getFacialRecognitionVerifyManager({
    requestId: context.requestId,
  })

  // 云函数提交姓名、身份证号以获取认证服务的certifyId
  const result = await frvManager.getCertifyId({
    realName: event.realName, // 姓名
    idCard: event.idCard, // 身份证号
    metaInfo: event.metaInfo, // 设备信息
  })

  //返回数据给客户端
  return result
}
