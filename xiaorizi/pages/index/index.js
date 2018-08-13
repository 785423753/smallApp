//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    scrollLeft:0,
    height:"",
    city_current: 'chengdu',
    tag_current: '',
    city_index:0,
    shop_index: 1,
    tag_index: 0,
    city_arry:[],
    shop_arry: [
      { name: '距离最近',id:0},
      { name: '热门好店', id: 1 },
      { name: '最新发布', id: 2 },
      { name: '小店优惠', id: 3 }
    ],
    shopList: [],
    tagList: [],
    banners:[],
    lon:'',
    lat:'',
    next_page:1,
    _page:0,
    knock:false,
    error:0,
    top: 0,
    s_top: 0,
    keyword:''
  },
  onShareAppMessage: function (res) {
    return {
      title: "小日子app特色小店",
      path: 'pages/index/index',
    }
  },
  //城市切换
  cityChange: function (e) {
    var city = this.data.city_arry;
    this.setData({
      shopList:[],
      city_index: e.detail.value,
      city_current: city[e.detail.value].pinyin,
      next_page: 1,
      _page: 0
    });
    this.getData();
  },

  //热门切换
  shopChange: function (e) {
    this.setData({
      shopList: [],
      shop_index: e.detail.value,
      next_page: 1,
      _page: 0,
      error: 0
    });
    this.getData();
  },

  //选择分类
  changTag: function(e) {
    this.setData({
      shopList: [],
      tag_current:e.target.dataset.id,
      tag_index: e.target.dataset.index,
      next_page: 1,
      _page: 0,
      scrollLeft: 50 * e.target.dataset.index,
      error: 0
    });
    this.getData();
  },
  toTag:function(e){
    this.setData({
      shopList: [],
      tag_current: e.target.dataset.id
    });
    var tag = this.data.tagList;
    for (var i = 0; i < tag.length; i++) {
      if (tag[i].id == e.target.dataset.id) {
        this.setData({
          tag_index: i,
          next_page: 1,
          _page: 0,
          scrollLeft: 50 * i,
          error: 0
        })
      };
    };
    this.getData();
  },
  //跳转到详情
  toDetail:function(e){
    var id = e.target.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: '../shop/shop?id='+id,
    })
  },
  cancle:function(){
    this.setData({
      error:0,
      shopList: [],
      keyword:''
    });
    this.getData();
  },
  onLoad: function () {

    



    var res = wx.getSystemInfoSync();
    console.log(res.windowWidth-20);
    this.setData({
      height: res.windowHeight-80,
      banner_height: (res.windowWidth - 20)/1.99
    });
    this.getCity()
    this.getData();
    var _this = this;
    // 获取经纬
    // wx.getLocation({
    //   type: 'wgs84',
    //   success: function (res) { 
    //     _this.setData({
    //       lon: res.longitude,
    //       lat: res.latitude
    //     }); 
    //     wx.request({
    //       url: 'https://xcv.xiaorizi.me/citybycoo/',
    //       data:{
    //         lat: res.latitude,
    //         lng: res.longitude
    //       },
    //       success:function(res){
    //         if (res.statusCode == 200){
    //           _this.setData({
    //             city_current: res.data.data.citydata.pinyin,
    //             shopList:[],
    //             next_page: 1,
    //             _page: 0
    //           });
    //           _this.getData();
    //         }  
    //         _this.getCity();
    //       },
    //       fail:function(){
    //         _this.getCity();
    //       }
    //     })     
    //   }
    // });
    // 获取经纬  
  },
  getData:function(){
    if(this.data.next_page){
      var _this = this, data = {},tag;
      if (_this.data.tag_current){
        tag = _this.data.tag_current
      }else{
        tag = ""
      };
      data = {
        tag_id: tag,
        city: _this.data.city_current,
        pageindex: _this.data.next_page,
        filt_code: _this.data.shop_index
      }
      if (_this.data.shop_index == 0) {
        // data.lat = _this.data.lat;
        // data.lng = _this.data.lon;
      }
      wx.request({
        url: 'https://xcv.xiaorizi.me/index/',
        data: data,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
          wx.hideLoading();
          if (res.statusCode == 200) {
            var shop = _this.data.shopList, next_page;
            if (_this.data.next_page == 1){
              shop=[]
            };
            for (var i = 0; i < res.data.shopdata.current_objects.length; i++) {
              shop.push(res.data.shopdata.current_objects[i]);
            };
            if (_this.data.tagList.length <= 0){
              _this.setData({
                tagList: res.data.commondata.tagdata,
                banners: res.data.commondata.banners
              })
            };
            if (res.data.shopdata.nextpage){
              next_page = res.data.shopdata.nextpage;
            }else{
              next_page=""
            }
            _this.setData({
              shopList: shop,
              next_page: next_page,
              _page: res.data.shopdata.cupage,
              banners: res.data.commondata.banners
            });
          } else {
            wx.showModal({
              content: '服务器开小差啦',
              showCancel: false
            });
            _this.setData({
              _page: 0,
              error: 1
            });
          };
        },
        fail: function () {
          wx.showModal({
            content: '服务器开小差啦',
            showCancel: false
          });
          _this.setData({
            _page: 0,
            error:1
          });
        }
      });
    }
    
  },
  getCity: function () {
    var _this = this;
    wx.request({
      url: 'https://xcv.xiaorizi.me/citylist/',
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200){
          var arry = res.data.citydata;
          _this.setData({
            city_arry: res.data.citydata
          });
          for (var i = 0; i < arry.length; i++) {
            if (arry[i].pinyin == _this.data.city_current) {
              _this.setData({
                city_index: i,
              })
            };
          };
        }else{
          x.showModal({
            content: '服务器开小差啦',
            showCancel: false
          });
        }; 
      }
    })
  },
  scrollNext:function(e){
    if (this.data.next_page != this.data._page){
      this.data._page = this.data.next_page
        this.getData();
    }
  },
  backTop: function () {
    this.setData({
      top: 0
    })
  },
  scroll: function (e) {
    this.setData({
      s_top: e.detail.scrollTop
    })
  },
  inputChange: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  search:function(){
    var _this=this;
    _this.setData({
      shopList:[]
    });
    if (_this.data.keyword != ""){
      wx.request({
        url: 'https://xcv.xiaorizi.me/search/?keyword=hostel&city=chengdu',
        data:{
          keyword: _this.data.keyword,
          city: _this.data.city_current,
          lat: _this.data.lat,
          lng: _this.data.lon,
          limit:999,
          pageindex:1
        },
        success:function(res){
          console.log(res)
          var shop =[];
          for (var i = 0; i < res.data.shopdata.current_objects.length; i++) {
            shop.push(res.data.shopdata.current_objects[i]);
          };
          if (shop.length == 0){
            wx.showModal({
              content: '很抱歉，没有找到相关小店',
              showCancel: false
            });
          }
          _this.setData({
            shopList: shop,
            error:2
          })
        }
      })
    }else{
      wx.showModal({
        content: '请输入关键字',
        showCancel: false
      });
    }
  }
})
