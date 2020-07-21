// pages/getinfo/getinfo.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: true, //未处理
    after: false, //已处理
    mine: false, //我的约拍
    bookinfos: [], //约拍信息
    openid: '',
    bookinfoed: [], //已处理信息
    showworks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
    contacts: [], //联系方式
    messages: [], //我的约拍信息

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      openid: options.openid
    })
    //查询被约请求
    const db = wx.cloud.database()
    db.collection('bookInfo').where({
      author_openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          bookinfos: res.data
        })
        console.log('[数据库] bookInfo[查询记录] 成功: ', res)
      },
      fail: err => {
        console.error('[数据库]bookInfo [查询记录] 失败：', err)
      }
    })
    //查询联系方式
    const db2 = wx.cloud.database()
    db2.collection('contacts').where({
      _openid: this.data.openid,
    }).get({
      success: res => {
        this.setData({
          contacts: res.data
        })
        console.log('[数据库]contacts [查询记录] 成功: ', res)
      },
      fail: err => {
        console.error('[数据库][查询记录] 失败：', err)
      }
    })
    //查询所有已处理请求
    const d = wx.cloud.database()
    d.collection('bookInfoed').where({
      anwser_openid: this.data.openid,
    }).get({
      success: res => {
        this.setData({
          bookinfoed: res.data
        })
        console.log('[数据库]bookInfoed [查询记录] 成功: ', res)
      },
      fail: err => {
        console.error('[数据库] bookInfoed[查询记录] 失败：', err)
      }
    })
    //查询请求回馈
    const db3 = wx.cloud.database()
    db3.collection('bookInfoed').where({
      ask_openid: this.data.openid,
    }).get({
      success: res => {
        this.setData({
          messages: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  //查看请求者或者已处理的主页
  oneclick: function(e) {
    var value = this.data.bookinfoed[e.target.id].ask_openid
    wx.navigateTo({
      url: '../authorInfo/authorInfo?openid=' + value,
    })
  },
  //同意请求
  agree: function(e) {

    if (this.data.contacts.length != 0) {
      console.log("用户" + e.target.id)
      const db = wx.cloud.database()
      db.collection('bookInfoed').add({
        data: {
          askname: this.data.bookinfos[e.target.id].myname,
          anwser_openid: this.data.openid,
          ask_openid: this.data.bookinfos[e.target.id]._openid,
          agree: true,
          disagree: false,
          phoneNum: this.data.bookinfos[e.target.id].PhoneNum,
          weiChatNum: this.data.bookinfos[e.target.id].WeiChatNum,
          anwsername: this.data.bookinfos[e.target.id].authorname,
          answerPhoneNum: this.data.contacts[0].PhoneNum,
          answerWeiChatNum: this.data.contacts[0].WeiChatNum
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          this.setData({
            anwser_openid: this.data.openid,
            ask_openid: this.data.bookinfos[e.target.id]._openid,
            agree: true,
            disagree: false,
            anwsername: this.data.bookinfos[e.target.id].authorname,
            answerPhoneNum: this.data.contacts[0].PhoneNum,
            answerWeiChatNum: this.data.contacts[0].WeiChatNum
          })
          console.log('[数据库] bookInfoed[新增记录] 成功，记录 _id: ', res._id)
        },
        fail: err => {
          console.error('[数据库] bookInfoed[新增记录] 失败：', err)
        }
      })

      wx.cloud.callFunction({
        name: 'update',
        data: {
          _id: this.data.bookinfos[e.target.id]._id,
        },
        succee: res => {
          console.log("更新数据成功!")
        }
      })

      const db2 = wx.cloud.database()
      db2.collection('bookInfo').where({
        author_openid: this.data.openid
      }).get({
        success: res => {
          this.setData({
            bookinfos: res.data
          })
          console.log('[数据库] bookInfo[查询记录] 成功: ', res)
        },
        fail: err => {
          console.error('[数据库]bookInfo [查询记录] 失败：', err)
        }
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请先在个人主页完善联系方式',
      })
    }
  },
  //拒绝请求
  disagree: function(e) {
    console.log("用户" + e.target.id)
    const db = wx.cloud.database()
    db.collection('bookInfoed').add({
      data: {
        askname: this.data.bookinfos[e.target.id].myname,
        anwser_openid: this.data.openid,
        ask_openid: this.data.bookinfos[e.target.id]._openid,
        agree: false,
        disagree: true,
        anwsername: this.data.bookinfos[e.target.id].authorname,
        answerPhoneNum: this.data.contacts[0].PhoneNum,
        answerWeiChatNum: this.data.contacts[0].WeiChatNum
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          anwser_openid: this.data.openid,
          ask_openid: this.data.bookinfos[e.target.id]._openid,
          agree: true,
          disagree: false,
          anwsername: this.data.bookinfos[e.target.id].authorname,
          answerPhoneNum: this.data.contacts[0].PhoneNum,
          answerWeiChatNum: this.data.contacts[0].WeiChatNum

        })
        console.log('[数据库] bookInfoed[新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        console.error('[数据库] bookInfoed[新增记录] 失败：', err)
      }
    })
    wx.cloud.callFunction({
      name: 'update',
      data: {
        _id: this.data.bookinfos[e.target.id]._id,
      },
      succee: res => {
        console.log("更新数据成功!")
      }
    })
    const db2 = wx.cloud.database()
    db2.collection('bookInfo').where({
      author_openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          bookinfos: res.data
        })
        console.log('[数据库] bookInfo[查询记录] 成功: ', res)
      },
      fail: err => {
        console.error('[数据库]bookInfo [查询记录] 失败：', err)
      }
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
    const db2 = wx.cloud.database()
    db2.collection('bookInfo').where({
      author_openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          bookinfos: res.data
        })
        console.log('[数据库] bookInfo[查询记录] 成功: ', res)
      },
      fail: err => {
        console.error('[数据库]bookInfo [查询记录] 失败：', err)
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
  //点击“未处理”
  datedefault: function() {
    const db = wx.cloud.database()
    db.collection('bookInfoed').where({
      anwser_openid: this.data.openid,
    }).get({
      success: res => {
        this.setData({
          bookinfoed: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)

      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    const db2 = wx.cloud.database()
    db2.collection('bookInfo').where({
      author_openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          bookinfos: res.data
        })
        console.log('[数据库] bookInfo[查询记录] 成功: ', res)
      },
      fail: err => {
        console.error('[数据库]bookInfo [查询记录] 失败：', err)
      }
    })
    this.setData({
      date: true,
      after: false,
      mine: false
    })
  },
   //点击“已处理”
  afterdefault: function() {
    const db = wx.cloud.database()
    db.collection('bookInfoed').where({
      anwser_openid: this.data.openid,
    }).get({
      success: res => {
        this.setData({
          bookinfoed: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)

      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    this.setData({
      date: false,
      after: true,
      mine: false
    })
  },
   //点击“我的约拍”
  minedefault: function() {
    const db = wx.cloud.database()
    db.collection('bookInfoed').where({
      ask_openid: this.data.openid,
    }).get({
      success: res => {
        this.setData({
          messages: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    this.setData({
      date: false,
      after: false,
      mine: true
    })
  },
})