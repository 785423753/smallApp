// pages/card/card.js
const app = getApp()
Page({
  data: {
    user_id:""
  },
  onLoad: function (options) {
    var _this=this;
    wx.request({
      url: 'https://xcv.xiaorizi.me/myvip?userid=' + options.userid,
      success: function (res) {
        _this.setData({
          vip_info: res.data.list
        })
      }
    })
  }
})