//logs.js
// const util = require('../../utils/util.js')

Page({
  data: {
    list:[],
    loading:false,
    load:0,
    userId:''
  },
  onLoad: function (options) {
    this.setData({
      userId:options.userid
    })
    this.getOrder();
  },
  onShow:function(){
    if (this.data.userId){
      this.getOrder();
      }
  },
  getOrder:function(){
      var _this=this;
      wx.request({
        url: 'https://xcv.xiaorizi.me/order/',
        data: { user_id: _this.data.userId},
        success:function(res){
          console.log(res.data)
          wx.hideLoading()
          if(res.data.code == 1){
            _this.setData({ list: res.data.list,load:1})
          }
        }
      })
  },
  preview:function(){
    wx.previewImage({
      current: 'https://pic.huodongjia.com/static/images/app-hdj.png', // 当前显示图片的http链接
      urls: ['https://pic.huodongjia.com/static/images/app-hdj.png'] // 需要预览的图片http链接列表
    })
    var size = { w: 200, h: 200 }
    var initUrl = "1220156322";
      // this.createQrCode(initUrl, "canvas", size.w, size.h);
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
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
})
