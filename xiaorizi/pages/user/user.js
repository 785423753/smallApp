const app = getApp()
const QR = require('../../utils/qrcode.js');
var time;
Page({
  data: {
    user_id:'',
    user:{},
    loading:false,
    show:0
  },
  userTap: function(){
    wx.navigateTo({
      url: '../like/like?userid=' + this.data.user_id
    })
  },
  onLoad: function () {
    if (this.data.user_id){
      wx.showLoading({
        title: '加载中',
      })
    }  
  },
  onShow:function(){
    var _this = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getStorage({
            key: 'userId',
            success: function (res) {
              console.log(res.data)
              _this.setData({ user_id: res.data });
              _this.getOrder();
            }
          });
        } else {
          _this.setData({
            user_id: ''
          })
        }
      }
    })
    
    if (this.data.imagePath){
      time = setInterval(this.check, 1000);
      setTimeout(function(){
        clearInterval(time);
      },10000)
    }
  },
  bindGetUserInfo: function (e) {
    this.login()
  },
  login: function () {
    var _this = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          _this.setData({ loading: true })
          wx.login({
            success: function (res) {
              console.log(res)
              var code = res.code;

              wx.getUserInfo({
                success: function (res) {
                  console.log(res)

                  wx.request({
                    url: 'https://xcv.xiaorizi.me/user/login',
                    data: {
                      iv: res.iv,
                      encryptedData: res.encryptedData,
                      js_code: code,
                    },
                    // method:'POST',
                    complete: function () {
                      _this.setData({ loading: false })
                    },
                    success: function (res) {
                      console.log(res)
                      if (res.statusCode == 200) {
                        wx.setStorage({
                          key: "userId",
                          data: res.data.data.user_id
                        });
                        _this.setData({
                          user_id: res.data.data.user_id,
                        });
                        _this.getOrder();
                      } else {
                        wx.showToast({
                          title: '服务器开小差啦',
                          icon: 'none',
                          duration: 2000
                        })
                      }
                    },
                    fail: function () {
                      wx.showToast({
                        title: '服务器开小差啦',
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  });

                },
                fail: function (res) {
                  console.log(res)
                }
              });

            }
          })
        }
      }
    })
  },
  getOrder: function () {
    var _this = this;
   
    wx.request({
      url: 'https://xcv.xiaorizi.me/order/',
      data: { user_id: _this.data.user_id ,ticket:1},
      success: function (res) {
        console.log(res.data)
        wx.hideLoading()
        if (res.data.code == 1) {
          _this.setData({ list: res.data.list, load: 1 })
        }
      }
    })
  },
  preview: function (e) {
    wx.showLoading({
      title: '正在生成图片',
    })
    var i = e.target.dataset.id;
    var size = { w: 200, h: 200 }
    var initUrl = this.data.list[i].id;
    this.setData({ id: initUrl})
    console.log(initUrl)
    this.createQrCode(JSON.stringify(initUrl), "canvas", size.w, size.h);
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    console.log(url)
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => { this.canvasToTempImage(); }, 1000);
  },
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath: tempFilePath,
          // canvasHidden:true
        });
        wx.hideLoading()
        wx.previewImage({
          current: tempFilePath, // 当前显示图片的http链接
          urls: [tempFilePath] // 需要预览的图片http链接列表
        })
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  check:function(){
    var _this=this;
    wx.request({
      url: 'https://xcv.xiaorizi.me/order/check_verify_flag/?order_id='+this.data.id,
      success:function(res){
        console.log(res)
        if(res.data.flag){
            clearInterval(time);
            _this.getOrder()
        }
      }
    })
  }
})