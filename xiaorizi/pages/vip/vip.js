// pages/vip/vip.js
var md5 = require('md5.js');
var app = getApp();
Page({
  data: {
    index:0,
    list:{},
    phone:'',
    name:'',

  },
  onShareAppMessage: function (res) {
    return {
      title: "小日子会员卡",
      path: 'pages/vip/vip',
    }
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    var _this=this;
    wx.request({
      url: 'https://xcv.xiaorizi.me/event/vip/info/',
      success:function(res){
        wx.hideLoading();
        _this.setData({
          list:res.data.list
        });
      }
    });
    
    
  },
  onShow: function () {
    var _this = this;
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        console.log(res.data)
        _this.setData({ user_id: res.data });
        wx.request({
          url: 'https://xcv.xiaorizi.me/myvip?userid=' + res.data,
          success: function (res) {
            _this.setData({
              vip_info: res.data.list
            })
          }
        })
      }
    });
  
    
  },
  inputChange:function(e){
      if(e.target.dataset.name == "name"){
          this.setData({
            name:e.detail.value
          })
      };
      if (e.target.dataset.name == "phone") {
        this.setData({
          phone: e.detail.value
        })
      };
  },
 
})