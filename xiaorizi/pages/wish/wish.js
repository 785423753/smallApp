// pages/wish/wish.js
var md5 = require('../../utils/md5.js');
Page({
  data: {
      info:{
        head: '',
        footer: '',
        content: '',
        wechat: '',
        phone: '',
      },
      price:'',
      display:'none'
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    var _this=this;
    //获取code和用户信息
    wx.login({
      success: function (res) {
        _this.setData({ code: res.code })
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
    //获取价格
    wx.request({
      url: 'https://xcv.xiaorizi.me/event/detail?id=3740',
      success: function (res) {
        wx.hideLoading();
        _this.setData({
          price:res.data.data.tickets[0].price,
          id: res.data.data.tickets[0].id
        })
      }
    })
  },
  bindKeyInput: function (e) {
    var info=this.data.info;
      info[e.target.id] = e.detail.value;
      this.setData({
        info:info
      })
  },
  post: function () {
    var _this = this, code = this.data.code;
    if(_this.data.info.wechat == ''){
      wx.showModal({
        content: '微信号不能为空哦',
        showCancel: false
      });
    } else if (!(/^1+\d{10}$/).test(_this.data.info.phone)){
      wx.showModal({
        content: '请输入正确的手机号',
        showCancel: false
      });
    }else{
      wx.showLoading({
        title: '正在提交...',
      })
      wx.request({
        url: 'https://xcv.xiaorizi.me/order/',
        data: {
          iv: _this.data.iv,
          encryptedData: _this.data.encryptedData,
          js_code: code,
          items: _this.data.id + ',1',
          pay_type: 9,
          price: _this.data.price,
          wechat: _this.data.info.wechat,
          message: 'To'+_this.data.info.head + '\r\n' + _this.data.info.content + '\r\n' +'From'+ _this.data.info.footer
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
              _this.setData({
                display:'block'
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
  },
  close_1: function () {
    this.setData({ display: 'none' })
  },
  onShareAppMessage: function () {
  
  }
})