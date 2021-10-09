// index.ts
// 获取应用实例
const app = getApp<IAppOption>()

Page({
  data: {
    name: '张三'
  },
  onLoad() {
    console.log('onLoad...')
  },
})
