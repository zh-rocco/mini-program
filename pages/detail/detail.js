import apis from '../../services/index'

const {
  $Message,
  $Toast
} = require('../../iview/base/index');

//获取应用实例
const app = getApp()

Page({
  data: {
    food: {
      title: '',
      desc: '',
      amount: '',
      total_amount: '',
      images: []
    }
  },

  getGood(id) {
    apis.getById(id)
      .then(res => {
        if (res.statusCode === 200) {
          this.setData({
            food: res.data
          })
        }
      })
      .catch(() => {})
  },

  previewImage(e) {
    const current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: this.data.food.images
    })
  },

  handleOrder(e) {
    const id = e.target.dataset.id
    console.log(id)
    apis.add(id).then(res => {
      console.log(res)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const {
      id
    } = options

    id !== undefined && this.getGood(id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // this.getGood()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
})