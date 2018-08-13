//index.js
//获取应用实例
const app = getApp()
var QR = require('../../utils/util.js');
Page({
  data: {
    list: [],
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getData();

  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getData: function () {
    var _this = this;
    wx.request({
      url: 'https://xcv.xiaorizi.me/event/event_list/',
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          _this.setData({
            list: res.data.data.current_objects
          })
        } else {
          wx.showToast({
            title: '服务器开小差啦',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

})
