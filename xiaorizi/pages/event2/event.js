// pages/detail/detail.js
const app = getApp();
Page({
  data: {
    imgUrls: [
      "http://pic.huodongjia.com/event/2016-01-09/event164204.jpg",
      'http://pic.huodongjia.com/event/2016-01-09/event164447.jpg',
      'http://pic.huodongjia.com/event/2016-01-09/event164420.jpg'
    ],
    height: '',
    event: {},
    current: 0,
    choose:0,

  },
  onLoad: function (options) {
    var _this = this;
    // options.id = 3765;
    wx.request({
      url: 'https://xcv.xiaorizi.me/event/detail/?id=' + options.id,
      success: function (res) {
        if (res.statusCode == 200) {
          _this.setData({
            event: res.data.data
          });
          wx.setNavigationBarTitle({
            title: res.data.data.title,
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
  onShow: function () {
    var _this = this;
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        console.log(res)
        _this.setData({ userId: res.data });
      }
    });
    _this.login() 
    // wx.checkSession({
    //   success: function () {
    //     console.log('没有过期')
    //   },
    //   fail: function () {
    //     console.log('已过期')
    //   }
    // });
  },
  openMap: function () {
    var position = this.data.event.position;
    var latitude = parseFloat(position.split(',')[1])
    var longitude = parseFloat(position.split(',')[0])
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 28
    })
  },
  tab: function (e) {
    this.setData({ current: e.target.dataset.index })
  },
  choosetkt:function(e){
      var index=e.target.dataset.index;
      this.setData({
        choose: index
      })
  },
  login: function () {
    var _this = this;
    wx.getSetting({
      success: function (res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          
        }else{
          _this.setData({
            userId:''
          })
        }
      }
    })
  },
  tel:function(){
    wx.makePhoneCall({
      phoneNumber: '18123392995' 
    })
  },
  onShareAppMessage: function () {
      return{
        title:this.data.event.title,
        url:'pages/event/event'
      }
  }
})