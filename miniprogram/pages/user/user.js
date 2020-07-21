// pages/user/user.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    work: true,
    praise: false,
    collect: false,
    works: [],
    openid: '',
    bookinfos: [],
    redspot: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
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

    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  oneclick: function(e) {
    console.log(e.target.id)
    console.log(this.data.works[0]._id)
    var value = this.data.works[e.target.id]._id

    wx.navigateTo({
      url: '../lookusers/lookusers?id=' + value,
    })

  },
  /**
   *
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.checkLogin) {
      var that = this
      const db = wx.cloud.database()
      db.collection('counters').where({
        _openid: this.data.openid
      }).get({
        success: res => {
          that.setData({
            works: res.data
          })
          console.log('[数据库]counters [查询记录] 成功: ', res)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })

      const d = wx.cloud.database()
      d.collection('bookInfo').where({
        author_openid: this.data.openid
      }).get({
        success: res => {
          that.setData({
            bookinfos: res.data
          })
          console.log('[数据库] bookInfo[查询记录] 成功: ', res)
          if (this.data.bookinfos.length != 0) {
            this.setData({
              redspot: true
            })
          } else {
            this.setData({
              redspot: false
            })
          }
        },
        fail: err => {
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
    }
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
    var that = this
    const db = wx.cloud.database()
    db.collection('counters').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        that.setData({
          works: res.data
        })
        console.log('[数据库]counters [查询记录] 成功: ', res)
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })


    //当逻辑执行完后关闭刷新    
    wx.stopPullDownRefresh()
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
  //用户登录
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    app.globalData.checkLogin = true
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.setData({
      openid: app.globalData.openid
    })

    var that = this
    const db = wx.cloud.database()
    db.collection('counters').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        that.setData({
          works: res.data
        })
        console.log('[数据库]counters [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })

    const d = wx.cloud.database()
    d.collection('bookInfo').where({
      author_openid: this.data.openid
    }).get({
      success: res => {
        that.setData({
          bookinfos: res.data
        })
        console.log('[数据库] bookInfo[查询记录] 成功: ', res)
        if (this.data.bookinfos.length != 0) {
          this.setData({
            redspot: true
          })
        }
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  //workdefault: function() {
  //this.setData({
  // work: true,
  //praise: false,
  //collect: false
  // })
  // },
  // praisedefault: function() {
  // this.setData({
  //   work: false,
  //  praise: true,
  //  collect: false
  //})
  // },
  //collectdefault: function() {
  //this.setData({
  //  work: false,
  // praise: false,
  // collect: true
  // })
  // },
  //跳转到约拍界面
  getbookinfo: function() {
    wx.navigateTo({
      url: '../getinfo/getinfo?openid=' + this.data.openid,
    })
  },
  //联系方式
  bindViewTap: function() {
    wx.navigateTo({
      url: '../user-info/user-info',
    })
  }
})