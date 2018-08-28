import apis from '../../services/index'
import uploader from '../../services/uploader'

const {
  $Message,
  $Toast
} = require('../../iview/base/index');

Page({
  data: {
    count: 9,
    uploaderLoading: false,
    title: '',
    desc: '',
    imageList: [],
  },

  handleTitleChange(e) {
    this.setData({
      title: e.detail.detail.value
    })
  },

  handleDescChange(e) {
    this.setData({
      desc: e.detail.detail.value
    })
  },

  chooseImage() {
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed', 'original'],
      count: this.data.count,
      success: (res) => {
        console.log(res)
        this.setData({
          imageList: res.tempFilePaths
        })
      }
    })
  },

  previewImage(e) {
    const current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },

  handleUpload() {
    return uploader.upload(this.data.imageList)
      .then(res => {
        const images = res
          .map(({
            statusCode,
            data
          }) => statusCode === 200 ? data.path : '')
          .filter(item => item)
        return images.length ? images : Promise.reject('images length is 0. minapp error.')
      })
  },

  checkForm() {
    if (!this.data.title) {
      $Message({
        content: '请填写菜品名称',
        type: 'warning'
      })
      return Promise.reject()
    }

    if (!this.data.desc) {
      $Message({
        content: '请填写菜品描述',
        type: 'warning'
      })
      return Promise.reject()
    }

    if (!this.data.imageList.length) {
      $Message({
        content: '请上传菜品图片',
        type: 'warning'
      })
      return Promise.reject()
    }

    return Promise.resolve()
  },

  handleCreateTap() {
    this.checkForm()
      .then(() => {
        $Toast({
          content: '创建中',
          type: 'loading'
        })
        return this.handleUpload()
      })
      .then((images) => {
        return apis.create({
          title: this.data.title,
          desc: this.data.desc,
          images
        })
      })
      .then((data) => {
        console.log(data)
        $Toast({
          content: '创建成功',
          type: 'success'
        });
        setTimeout(() => {
          $Toast.hide();
        }, 2000);

        this.setData({
          title: '',
          desc: '',
          imageList: []
        })
      })
      .catch((err) => {
        if (!err) return
        $Toast({
          content: '创建失败',
          type: 'error'
        });
        setTimeout(() => {
          $Toast.hide();
        }, 2000);
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

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