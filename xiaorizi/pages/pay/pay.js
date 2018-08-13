// pages/order/order.js
var md5 = require('../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    min: 1,
    max: 10,
    amount: 1,
    data: {},
    price: '',
    tel: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var _this = this;
    this.setData({
      data: options,
      price: options.price
    });
    
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        console.log(res.data)
        _this.setData({ user_id: res.data });
      }
    });
    
  },
  onShow:function(){
    var _this = this;
  },
  bindKeyInput: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  change: function (e) {
    var amount = this.data.amount, type = e.target.dataset.type;
    if (type == -1) {
      this.setData({
        amount: amount - 1
      })
    } else {
      this.setData({
        amount: amount + 1
      })
    }
    var price = this.data.data.price * this.data.amount;
    this.setData({
      price: price
    })

  },
  post: function () {
    var _this = this;
    wx.showLoading({
      title: '',
    })
    if (!(/^1+\d{10}$/).test(this.data.tel)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      });
      return false
    };
    wx.login({
      success: function (res) {
        _this.setData({ code: res.code })
        wx.getUserInfo({
          success: function (res) {
            console.log(res)
            wx.request({
              url: 'https://xcv.xiaorizi.me/order/',
              data: {
                iv: res.iv,
                encryptedData: res.encryptedData,
                js_code: _this.data.code,
                // user_id: _this.data.user_id,
                items: _this.data.data.item + ',' + _this.data.amount,
                pay_type: 9,
                price: _this.data.price,
                user_phone: _this.data.tel,
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
                    wx.switchTab({
                      url: '../user/user',
                    })
                  },
                  'fail': function (res) {
                    wx.showToast({
                      title: '支付失败',
                      icon: 'none',
                      duration: 3000
                    });
                  }
                })
              },
              fail: function () {
                wx.hideLoading()
              }
            })
          },
        });
        
      }
    });

  },
  
})