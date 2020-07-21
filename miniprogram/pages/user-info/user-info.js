// pages/user-info/user-info.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pNum: null,
    wNum: null,
    searchinput: '',
    contacts: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    const db = wx.cloud.database()
    db.collection('contacts').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        that.setData({
          contacts: res.data
        })
        console.log('[数据库]counters [查询记录] 成功: ', res)
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })

  },
  //获取手机号
  handlePhoneNumInput(e) {
    const value = e.detail.value
    this.data.pNum = value
  },
  //获取微信号
  handleWeichatNumInput(e) {
    const value = e.detail.value
    this.data.wNum = value
  },
  //保存用户联系方式
  onAdd: function() {
    if (this.data.contacts.length == 0) {
      if (this.data.pNum != null && this.data.wNum) {
        var that = this
        const db = wx.cloud.database()
        db.collection('contacts').add({
          data: {
            _id: that.data.wNum,
            PhoneNum: that.data.pNum,
            WeiChatNum: that.data.wNum
          },
          success: res => {
            // 在返回结果中会包含新创建的记录的 _id
            this.setData({
              counterId: res._id,
              PhoneNum: that.data.pNum,
              WeiChatNum: that.data.wNum
            })
            wx.showToast({
              title: '保存成功',
            })
            console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)

          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '联系方式已存在'
            })
            console.error('[数据库] [新增记录] 失败：', err)
          }
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '请填写完整',
        })

      }
    } else {
      wx.showToast({
        icon: 'none',
        title: '已存',
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})