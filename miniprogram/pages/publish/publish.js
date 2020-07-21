// pages/publish/publish.js
var app = getApp();
var util = require('../../utils/util.js')
import {
  promisify
} from '../../utils/promise.util'
import {
  $init,
  $digest
} from '../../utils/common.util'
import config from '../../config'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    titleCount: 0, //标题字数
    contentCount: 0, //正文字数
    title: null, //标题内容
    content: '', //正文内容
    role: null,
    openid: '',
    time: '',
    filePath: [],
    fileid: [],
    log: false,
    radioItems: [{
        name: '摄影师',
        value: '摄影师',
        checked: false
      },
      {
        name: '模 特',
        value: '模 特',
        checked: false
      }
    ],
    index: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    } else {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid)
          app.globalData.openid = res.result.openid
          this.setData({
            openid: app.globalData.openid
          })
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    }
    if (!app.globalData.checkLogin) {
      wx.showModal({
        title: '提示',
        content: '请先在个人主页进行登录',
        showCancel: false,
        success: function(res) {
          if (res.confirm) { //这里是点击了确定以后
            console.log('用户点击确定')
          } else { //这里是点击了取消以后
            console.log('用户点击取消')
          }
        }
      })
    }
    $init(this)
  },
  //上传图片
  doUpload: function() {
    var that = this
    // 选择图片
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

        const images = that.data.images.concat(res.tempFilePaths)
        that.data.images = images
        $digest(that)
        that.data.filePath = res.tempFilePaths;
        that.setData({
          imgUrl: that.data.filePath
        })
        //上传
        const cloudPath = [];
        var TIME = util.formatTime(new Date());
        that.data.filePath.forEach((item, i) => {
          cloudPath.push(that.data.openid + '_' + TIME + i + that.data.filePath[i].match(/\.[^.]+?$/)[0])
        })
        console.log(cloudPath)
        var a = 0
        that.data.filePath.forEach((item, i) => {
          wx.cloud.uploadFile({
            cloudPath: cloudPath[i],
            filePath: that.data.filePath[i],
            success: res => {
              console.log('[上传文件] 成功：', cloudPath, res)
              console.log("fileid1 " + res.fileID)
              const value = res.fileID
              that.data.fileid[a] = value;
              a++
            }
          })
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  //删除图片
  removeImage(e) {
    var that = this
    const idx = e.currentTarget.dataset.idx
    wx.cloud.deleteFile({
      fileList: [that.data.fileid[idx]],
      success: res => {
        // handle success
        console.log(res.fileList)
      },
      fail: err => {
        // handle error
        console.log(idx)
      }
    })
    this.data.images.splice(idx, 1)
    $digest(this)
  },
  //预览图片
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },
  //获取作者身份
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const value = e.detail.value
    this.data.role = value
    this.setData({
      index: e.target.id
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

  },
  onUploadImage: function(e) {

  },

  //获取作品名
  handleTitleInput(e) {
    const value = e.detail.value
    this.data.title = value
  },
  //获取作品简介
  handleContentInput(e) {
    const value = e.detail.value
    this.data.content = value
  },
  //存储作品信息
  onAdd: function() {
    var that = this
    if (app.globalData.checkLogin) {
      if (this.data.title != null) {
        if (this.data.images.length != 0) {
          if (this.data.role != null) {
            const db = wx.cloud.database()
            db.collection('counters').add({
              data: {
                _id: that.data.title,
                title: that.data.title,
                content: that.data.content,
                role: that.data.role,
                fileID: that.data.fileid,
                authorname: app.globalData.userInfo.nickName
              },
              success: res => {
                // 在返回结果中会包含新创建的记录的 _id
                this.setData({
                  counterId: res._id,
                  title: that.data.title,
                  content: that.data.content,
                  role: that.data.role,
                  fileID: that.data.fileid,
                  authorname: app.globalData.userInfo.nickName
                })
                wx.showToast({
                  title: '发布成功',
                })
                console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
                this.setData({
                  searchinput: '',
                  images: [],
                  radioItems: [{
                      name: '摄影师',
                      value: '摄影师',
                      checked: false
                    },
                    {
                      name: '模 特',
                      value: '模 特',
                      checked: false
                    }
                  ],
                })
                this.onLoad;
              },
              fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '作品名已存在'
                })
                console.error('[数据库] [新增记录] 失败：', err)
              }
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '请选择身份'
            })
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: '请选择图片'
          })
        }
      } else {
        wx.showToast({
          icon: 'none',
          title: '请输入作品名'
        })
      }
    } else {
      wx.showToast({
        icon: 'none',
        title: '请先进行登录'
      })
    }
  }
})