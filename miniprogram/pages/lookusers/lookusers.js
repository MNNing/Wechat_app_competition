// pages/lookusers/lookusers.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //upStatus: false,
    // upNum: 448,
    //CollectionStatus:false,
    // CollectionNum:311,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openid: '',
    id: '',
    deleted: false,
    works: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.id)
    this.setData({
      id: options.id
    })
    console.log(this.data.id)
    const db = wx.cloud.database()
    db.collection('counters').where({
      _id: this.data.id
    }).get({
      success: res => {
        this.setData({
          works: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true

      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,

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
  getAuthorInfo: function() {

    this.setData({
      openid: this.data.works[0]._openid
    })
    wx.navigateTo({
      url: '../authorInfo/authorInfo?openid=' + this.data.openid,
    })
  },

  //预览图片
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.works[0].fileID
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log(this.data.openid)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const db = wx.cloud.database()
    db.collection('counters').where({
      _id: this.data.id
    }).get({
      success: res => {
        this.setData({
          works: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
        this.setData({
          openid: this.data.works[0]._openid
        })
        console.log(this.data.openid)
        if (this.data.openid == app.globalData.openid) {
          this.setData({
            deleted: true
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  //作品删除
  onRemove: function() {
    const value = this.data.id
    wx.showActionSheet({
      itemList: ['删除'],
      success(res) {
        console.log(res.tapIndex)
        wx.cloud.callFunction({
          name: 'onRemove',
          data: {
            _id: value,
          },
          succee: res => {
            console.log("删除成功!")
          }
        })
        wx.navigateBack({
          delta: 1,
          success: function(e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) retturn;
            page.onLoad();
          }
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
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

  },
  //点赞
  // onUpTap:function(){
  //  var isupStatus = this.data.upStatus;
  // this.setData({ upStatus: !isupStatus}) 
  // if (this.data.upStatus==true){
  //   var num = this.data.upNum+1;
  //   this.setData({ upNum:num}) 
  // }else{
  //  var num = this.data.upNum - 1;
  // this.setData({ upNum:num}) 
  // }

  //},
  //收藏
  //onCollectionTap:function() {
  // var isCollectionStatus = this.data.CollectionStatus;
  // this.setData({ CollectionStatus: !isCollectionStatus}) 
  //if (this.data.CollectionStatus == true) {
  //  var num = this.data.CollectionNum + 1;
  //  this.setData({ CollectionNum: num })
  // } else {
  //  var num = this.data.CollectionNum - 1;
  //   this.setData({ CollectionNum: num })
  // }

  //},
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    app.globalData.checkLogin = true
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})