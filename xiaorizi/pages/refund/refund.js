// pages/refund/refund.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ['1001 1004','1001 1005'],
    reason:[
      '去过了，不太满意',
      '看网上评价不好',
      '买多了/买错了',
      '计划有变，没时间消费',
      '后悔了，不想要了'
    ],
    index_0:[],
    index_1:0,
    ticket_ids:[]
  },
  onLoad: function (options) {
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    this.setData({order_id:options.id})
    wx.request({
      url: 'https://xcv.xiaorizi.me/order/',
      data: { order_id: options.id },
      success: function (res) {
        wx.hideLoading()
        console.log(res.data)
        if (res.data.code == 1) {
          _this.setData({ data: res.data.data })
        };
        var index = [];
        for (var i = 0; i < res.data.data.tickets.length; i++) {
          index.push('')
        };
        _this.setData({ index_0: index });
      }
    })
  },
  choose:function(e){
    var index = e.target.dataset.index;
    this.setData({
      index_1:index
    })
  },
  add:function(e){
    var index = e.target.dataset.index,index_0=this.data.index_0,id=[];
    if (index_0[index] === ''){
      index_0[index]=index;
    }else{
      index_0[index] = '';
    };
    for (var i = 0; i < index_0.length; i++) {
      if (index_0[i] !== '') { id.push(this.data.data.tickets[index_0[i]].id) }
    }
    this.setData({
      index_0: index_0,
      ticket_ids:id
    });
    
  },
  refund:function(){
    var _this=this;
    if (this.data.ticket_ids.length <= 0){
      wx.showToast({
        title: '请选择需要退款的消费码',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    wx.request({
      url: 'https://xcv.xiaorizi.me/order',
      data:{
        order_id: parseFloat(_this.data.order_id),
        order_status:8,
        reason: _this.data.index_1,
        ticket_ids: _this.data.ticket_ids.join(',')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method:'POST',
      success:function(res){
          console.log(res)
          if(res.data.data){
            wx.showModal({
              title: '提示',
              content: '退款申请成功，7个工作日内将退款到原支付账户，请耐心等待',
              showCancel:false,
              success: function (res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../user/user',
                  })
                } 
              }
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 4000
            })
          }
      }
    })
  },
 
})