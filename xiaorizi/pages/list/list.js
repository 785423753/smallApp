Page({
  data: {
    current_city:"chengdu",
    current_tag:'',
    current_cbd:'',
    shop:[],
    type:3,
    height:0,
    next_page: 1,
    _page: 0,
    top: 0,
    s_top: 0
  },
  onShareAppMessage: function (res) {
    var city = this.data.current_city, cbd = this.data.current_cbd, tag = this.data.current_tag;
    return {
      title: "pass卡优惠小店",
      path: "pages/list/list?city=" + city + "&cbd=" + cbd + "&tag_id=" + tag,
    }
  },
  onLoad: function (options) {
    console.log(options)
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      current_city: options.city,
      current_tag: options.tag,
      current_cbd: options.cbd
    })
    var res = wx.getSystemInfoSync();
    this.setData({
      height: res.windowHeight - 110
    });
    this.city();
    
    this.event()
  },
  city:function(){
    var _this=this;
    wx.request({
      url: 'https://xcv.xiaorizi.me/event/vip/citylist/',
      success: function (res) {
        console.log(res)
        if(res.statusCode == 200 ){
          _this.setData({
            city: res.data.citylist
          });
        }else{
          wx.showModal({
            content: '服务器开小差啦',
            showCancel: false
          })
        };
        
      }
    })
  },
  event: function () {
    var _this = this;
    var city = '', cbd = '', tag = '', page = this.data.next_page;
    if (this.data.current_city) { city = this.data.current_city};
    if (this.data.current_cbd) { cbd = this.data.current_cbd };
    if (this.data.current_tag) { tag = this.data.current_tag };
    var url = "/event/vip/shoplist_v2/?city=" + city + "&cbd=" + cbd + "&tag_id=" + tag + "&pageindex=" + page;
    console.log('https://xcv.xiaorizi.me' + url)
    wx.request({
      url: 'https://xcv.xiaorizi.me'+url,
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          var page = '', shop = _this.data.shop;
          if (res.data.shops.nextpage){page = res.data.shops.nextpage};
          for (var i = 0; i < res.data.shops.current_objects.length;i++){
            shop.push(res.data.shops.current_objects[i])
          };
          if (res.data.shops.current_objects.length == 0){
            _this.setData({not:1})
          }else{
            _this.setData({ not: 0 })
          }
          _this.setData({
            shop: shop,
            tag: res.data.tag_id,
            cbd: res.data.cbd,
            next_page: page,
            _page: res.data.shops.cupage,
            tickets: res.data.tickets[0]
          });
        } else {
          wx.showModal({
            content: '服务器开小差啦',
            showCancel: false
          })
        };

      }
    })
  },
  filter:function(e){
    this.setData({
      type: e.target.dataset.type
    })
  },
  close:function(){
    this.setData({
      type: 3
    })
  },
  scroll: function (e) {
    this.setData({
      s_top: e.detail.scrollTop
    })
  },
  scrollNext: function (e) {
    if (this.data.next_page && this.data.next_page != this.data._page) {
      this.data._page = this.data.next_page
      this.event();
    }
  },
  backTop: function () {
    this.setData({
      top: 0
    })
  },
  tovip:function(){
    wx.navigateTo({
      url: '../order/order?price=' + this.data.tickets.price
    })
  }
})