//app.js
App({
  onLaunch: function() {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    this.globalData = {}
    //设置tabBar的样式
    wx.setTabBarStyle({
      color: '#000000',
      selectedColor: '#000000',
      backgroundColor: '#008cc9',
    })

  },
  globalData: {
    userinfo: null,
    checkLogin: false,
  }
})