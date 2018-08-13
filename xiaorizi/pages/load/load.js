// pages/load/load.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    wx.getSystemInfo({
      success: function (res) {
        if (res.isQB) {
          wx.redirectTo({
            url: '../shopList/shopList'
          })
        }else{
          wx.switchTab({
            url: '../index/index'
          })
        }
      }
    })
  }
})