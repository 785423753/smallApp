// pages/openshop/openshop.js
var md5 = require('../../utils/md5.js');
const app = getApp()
Page({
  data: {
    display:'none',
    tagdata:[],
    tag:'',
    value:['',''],
    arry_1:[
      [
        '男',
        '女'
      ], [
        '80后',
        '90后',
        '00后'
      ]
    ],
   way:[
     {name:'独立',value:'0'},
     { name: '众筹', value: '1' },
     { name: '参股', value: '2' }
   ],
   
   des:[
     "独立开店：参与系统化的培训学习后，独立运营店铺。",
     "众筹开店：有资金没有时间不参与管理，由专业团队共同维护。",
     "参股开店：有资金有资源，与团队一起参与管理。",
   ],
   page:0,
  info:{
    contactor: '',
    address: '',
    wechat:'',
    phone:'',
    entrust:1
  }
  },
  onLoad: function (options) {
    var _this=this;
    wx.request({
      url: 'https://xcv.xiaorizi.me/index/',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
        _this.setData({
          tagdata: res.data.commondata.tagdata
        })
      },
    });
    wx.request({
      url: 'https://xcv.xiaorizi.me/event/detail?id=3741',
      success: function (res) {
        wx.hideLoading();
        _this.setData({
          price: res.data.data.tickets[0].price,
          id: res.data.data.tickets[0].id
        })
      }
    });
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
    });
  },
  onShareAppMessage: function (res) {
    return {
      title: "开间小店，过理想生活",
      path: 'pages/openshop/openshop',
    }
  },
  post:function(){
    var info = this.data.info;
     info.user_id = app.globalData.user_id;
     this.setData({
       info: info
     });
     if (info.contactor == ''){
       wx.showModal({
         content: '请留下您的姓名哦',
         showCancel: false
       });
     }  else if (info.wechat == '') {
       wx.showModal({
         content: '请填写微信号',
         showCancel: false
       });
     } else if (!(/^1+\d{10}$/).test(info.phone)) {
       wx.showModal({
         content: '请填写正确的手机号',
         showCancel: false
       });
     } else if (info.address == '') {
       wx.showModal({
         content: '请填写寄送地址',
         showCancel: false
       });
     } else{
       wx.showLoading({
         title: '正在提交...',
       });
       var _this=this;
       wx.request({
         url: "https://xcv.xiaorizi.me/shop/apply/crowdshop/",
         method:'POST',
         data:_this.data.info,
         header: {
           "Content-Type": "application/x-www-form-urlencoded"
         },
         success:function(res){
           console.log(res)   
           wx.hideLoading();

           if(res.data.code){           
             wx.request({
               url: 'https://xcv.xiaorizi.me/order/',
               data: {
                 iv: _this.data.iv,
                 encryptedData: _this.data.encryptedData,
                 js_code: _this.data.code,
                 items: _this.data.id + ',1',
                 pay_type: 9,
                 price: _this.data.price,
                crowd_id:res.data.data.id
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
                     _this.setData({
                       display:'block'
                     })
                   },
                   'fail': function (res) {
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
         fail:function(){
           wx.hideLoading();
         }
       })
     }
  },
  close:function(){
    this.setData({page:0})
  },
  close_1:function(){
    this.setData({ display: 'none' })
  },
  open: function () {
    this.setData({ page: 1 })
  },
  picker:function(e){
    var info = this.data.info;
    var shopname = this.data.tagdata[e.detail.value].name
    info.shopname = shopname
    this.setData({
      tag: e.detail.value,
      info: info
    });
  },
  picker_way:function(e){
    var info = this.data.info;
    info.shoptype = e.detail.value;
    this.setData({
      info: info
    });
  },
  pickerSex:function(e){
    var info = this.data.info;
    info.identity = this.data.arry_1[0][e.detail.value[0]] + "," + this.data.arry_1[1][e.detail.value[1]];
      this.setData({
        value: e.detail.value,
        info: info
      })
  },
  bindKeyInput: function (e) {
    var info = this.data.info;
    info[e.target.id] = e.detail.value;
    this.setData({
      info: info
    })
  },
})