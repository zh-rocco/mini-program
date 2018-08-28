import apis from '../../services/index'

const {
  $Message,
  $Toast
} = require('../../iview/base/index');

//获取应用实例
const app = getApp()

Page({
  data: {
    isDeleteModal: false,
    deleteActions: [{
        name: '取消'
      },
      {
        name: '删除',
      }
    ],
    selectedDish: {},
    dishesList: [],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  getUserInfo: function(e) {
    console.log('uid:', wx.BaaS.storage.get('uid'))
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  getGoodList() {
    apis.getList()
      .then(res => {
        if (res.statusCode === 200) {
          const list = res.data.objects
            .map(item => ({
              id: item.id,
              title: item.title,
              desc: item.desc,
              images: item.images,
              amount: item.amount
            }))
            .reverse()
          this.setData({
            dishesList: list
          })
        }
        this.stopPullDownRefresh()
      })
      .catch(() => {
        this.stopPullDownRefresh()
      })
  },

  handleOrder(e) {
    const id = e.target.dataset.id
    console.log(id)
    apis.add(id).then(res => {
      console.log(res)
    })
  },

  handleDelete(e) {
    const item = e.target.dataset.item
    this.setData({
      selectedDish: item
    })
    this.setData({
      isDeleteModal: true
    })
  },

  hideDeleteModal(modal) {
    console.log(modal)
    if (modal.detail.index === 0) {
      this.setData({
        isDeleteModal: false,
        selectedDish: {}
      })
    } else {
      apis.del(this.data.selectedDish.id)
        .then(res => {
          console.log(res)
          this.setData({
            isDeleteModal: false,
            selectedDish: {}
          })
          $Message({
            content: '删除成功',
            type: 'success'
          })
          this.getGoodList()
        })
        .catch(() => {
          this.setData({
            isDeleteModal: false,
            selectedDish: {}
          })
          $Message({
            content: '删除失败',
            type: 'error'
          })
        })
    }
  },

  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  onShow() {
    this.getGoodList()
  },

  onPullDownRefresh() {
    this.getGoodList()
  },

  stopPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh({
        complete(res) {}
      })
    }, 500)
  }
})