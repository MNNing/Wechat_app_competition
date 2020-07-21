// pages/authorInfo/authorInfo.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    booked: true, //是否已约
    openid: '',
    works: [], //作品集
    bookInfos: [], //被约记录
    bookinfoed: [], //消息处理情况
    contacts: [], //联系方式
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.openid)
    this.setData({
      openid: options.openid
    })
    //查询作品集
    const db = wx.cloud.database()
    db.collection('counters').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          works: res.data
        })
        console.log('[数据库] counters[查询记录] 成功: ', res)
      },
      fail: err => {
        console.error('[数据库]counters[查询记录] 失败：', err)
      }
    })

    //查询被约记录
    const d = wx.cloud.database()
    d.collection('bookInfo').where({
      _openid: app.globalData.openid,
      author_openid: this.data.openid

    }).get({
      success: res => {
        this.setData({
          bookInfos: res.data
        })
        console.log('[数据库]bookinfo [查询记录] 成功: ', res)
        if (this.data.bookInfos.length != 0 && app.globalData.checkLogin) {
          this.setData({
            booked: false
          })
        }
      },
      fail: err => {
        console.error('[数据库]bookinfo [查询记录] 失败：', err)
      }
    })
    //查询联系方式
    const dc = wx.cloud.database()
    dc.collection('contacts').where({
      _openid: app.globalData.openid,
    }).get({
      success: res => {
        this.setData({
          contacts: res.data
        })
        console.log('[数据库]contacts[查询记录] 成功: ', res)
      },
      fail: err => {
        console.error('[数据库] counters[查询记录] 失败：', err)
      }
    })
  },
  //按钮点击实现"想约"
  book: function() {
    var isbooked = this.data.booked
    var that = this;
    if (app.globalData.checkLogin) { //只有在登录后才能使用此功能
      if (app.globalData.openid == this.data.openid) {
        wx.showToast({
          icon: 'none',
          title: '不能约自己',
        })
      } else if (this.data.contacts.length == 0) {
        wx.showToast({
          icon: 'none',
          title: '请先在个人主页填写联系方式',
        })
      } else {
        if (this.data.booked) {
          const db = wx.cloud.database()
          //存入约拍信息
          db.collection('bookInfo').add({
            data: {
              myname: app.globalData.userInfo.nickName,
              authorname: this.data.works[0].authorname,
              author_openid: this.data.works[0]._openid,
              flag: true,
              PhoneNum: this.data.contacts[0].PhoneNum,
              WeiChatNum: this.data.contacts[0].WeiChatNum
            },
            success: res => {
              // 在返回结果中会包含新创建的记录的 _id
              this.setData({
                counterId: res._id,
                _id: app.globalData.userInfo.nickName,
                authorname: this.data.works[0].authorname,
                author_openid: this.data.works[0]._openid
              })
              console.log('[数据库] bookInfo[新增记录] 成功，记录 _id: ', res._id)
              this.setData({
                booked: !isbooked
              })
            },
            fail: err => {
              console.error('[数据库] bookInfo[新增记录] 失败：', err)
            }
          })
        }
      }
    } else {
      wx.showToast({
        icon: 'none',
        title: '请先登录',
      })
    }

  },
  //点击图片集封面进入作品展示页
  oneclick: function(e) {
    console.log(e.target.id)
    console.log(this.data.works[0]._id)
    var value = this.data.works[e.target.id]._id

    wx.navigateTo({
      url: '../lookusers/lookusers?id=' + value,
    })

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