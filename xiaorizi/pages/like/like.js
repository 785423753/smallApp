const app = getApp();
Page({
  data: {
    shopList:[],
    page_index:1,
    not:0
  },
  onLoad: function (options) {
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://xcv.xiaorizi.me/userlike',
      data: {
        user_id: options.userid,
        pageindex: _this.data.page_index,
        limit: 100,
        root_type: 0
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.likedata.current_objects.length > 0) {
          _this.setData({
            shopList: res.data.likedata.current_objects,
            pageindex: res.data.likedata.nextpage
          })
        } else {
          _this.setData({
            not: 1
          })
        }

      }
    }) 
  }
})