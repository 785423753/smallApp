
var md5 = require('md5.js')
Page({
  data: {
  
  },
  onLoad: function (options) {
    var _this = this;
    this.setData({
      price: options.price,
      origin: options.origin
    })
    wx.login({
      success: function (res) {
        _this.setData({ code: res.code})
      }
    });
    wx.getUserInfo({
      success: function (res) {
        _this.setData({
          iv: res.iv,
          encryptedData: res.encryptedData,
        });
      },
      fail: function () {
        wx.showModal({
          content: '很抱歉，由于您未允许小日子获取您的公开信息，无法购买',
          showCancel: false
        });
      }
    });
  },
  post: function () {
    var _this = this, code=this.data.code;
    wx.showLoading({
      title: '正在提交...',
    })
    wx.request({
      url: 'https://xcv.xiaorizi.me/order/',
      data: {
        iv: _this.data.iv,
        encryptedData: _this.data.encryptedData,
        js_code: code,
        // user_name: _this.data.name,
        // user_phone: _this.data.phone,
        items: '3142,1',
        pay_type: 9,
        price: _this.data.price
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        wx.hideLoading();
        if (res.data.code != 1) {
          wx.showModal({
            content: '订单发生错误',
            showCancel: false
          });
          return false
        }
        var appId = "wx260fa9fb224592c8", parm = res.data.data.pay_params;
        var tmpStr = "appId=" + appId + "&nonceStr=" + parm.noncestr + "&package=prepay_id=" + parm.prepayid + "&signType=MD5&timeStamp=" + parm.timestamp;
        var signStr = tmpStr + "&key=449e7a1b7d09a49149dd55cc469841f0";
        var paySign = md5(signStr).toUpperCase();
        // var paySign = parm.sign
        wx.requestPayment({
          'timeStamp': parm.timestamp,
          'nonceStr': parm.noncestr,
          'package': 'prepay_id=' + parm.prepayid,
          'signType': 'MD5',
          'paySign': paySign,
          'success': function (res) {
            console.log(res)
            wx.setStorage({
              key: "userId",
              data: ""
            });
            wx.switchTab({
              url: '../user/user',
            })
          },
          'fail': function (res) {
            console.log(res)
            wx.showModal({
              content: '支付失败',
              showCancel: false
            });
          }
        })
      }
    })
    
  }
})