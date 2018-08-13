
const QR = require('../../utils/qrcode.js');
var time;
Page({
  data: {

  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      id: options.id
    });
    this.getOrder();
  },
  onShow:function(){
    if (this.data.data && this.data.data.status == 1 && this.data.data.status == 8) {
      time = setInterval(this.check, 1000);
      setTimeout(function () {
        clearInterval(time);
      }, 10000)
    }
  },
  getOrder:function(){
    var _this = this;
    wx.request({
      url: 'https://xcv.xiaorizi.me/order/',
      data: { order_id: _this.data.id },
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          _this.setData({ data: res.data.data });
          _this.preview()
        }
      }
    })
  },
  preview: function (e) {
    var size = { w: 200, h: 200 }
    var initUrl = this.data.data.id;
    this.createQrCode(JSON.stringify(initUrl), "canvas", size.w, size.h);
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
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
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  pre:function(){
       wx.previewImage({
         current: this.data.imagePath, // 当前显示图片的http链接
         urls: [this.data.imagePath] // 需要预览的图片http链接列表
        })
  },
  openMap: function () {
    var position = this.data.data.items[0].ware.position;
    var latitude = parseFloat(position.split(',')[1])
    var longitude = parseFloat(position.split(',')[0])
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 28
    })
  },
  check: function () {
    var _this = this;
    wx.request({
      url: 'https://xcv.xiaorizi.me/order/check_verify_flag/?order_id=' + this.data.id,
      success: function (res) {
        console.log(res)
        if (res.data.flag) {
          clearInterval(time);
          _this.getOrder()
        }
      }
    })
  }
})