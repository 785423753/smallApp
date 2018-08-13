const app = getApp();
Page({
  data: {
    img:'../images/gray.jpg',
    title:'',
    name:'',
    tag:'',
    open_time:'',
    address:'',
    tel:'',
    position:'',
    comment:{},
    input:'',
    _input: '',
    text:'提交评论',
    user:{},
    root_id:'',
    user_id:'',
    top:0,
    s_top:0,
    isQB: app.globalData.isQB
  },
  openMap:function(event){
    var position = event.target.dataset.position;
    console.log(event.target)
    var latitude = parseFloat(position.split(',')[1])
    var longitude = parseFloat(position.split(',')[0])
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 28
    })
  },
  share:function(){
    this.onShareAppMessage();
  },
  phone:function(event){
    var tel = event.target.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel 
    })
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    var id = this.options.id, _this = this;
    this.setData({ id: id, root_id: id });
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        console.log(res.data)
        if (res.data){
          _this.setData({ user_id: res.data });
        };
        _this.getData();
        _this.getComment(); 
      },
      fail:function(){
        _this.getData();
        _this.getComment(); 
      }
    });
    
    wx.getUserInfo({
      success:function(res){
          console.log(res)
          _this.setData({
            user: res.userInfo
          })
      }
    })    

    wx.showShareMenu({
      withShareTicket: true
    })
  },
  isLogin:function(){
    //判断是否登录
    var _this=this;
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        if (!res.data) {
          _this.login();
        }else{
          _this.setData({
            user_id: res.data
          });
          _this.getData();
        }
      },
      fail: function () {
        _this.login();
      }
    }) 
  },
  login: function () {
    var _this = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        wx.getUserInfo({
          success: function (res) {
            wx.request({
              url: 'https://xcv.xiaorizi.me/user/login/',
              data: {
                iv: res.iv,
                encryptedData: res.encryptedData,
                js_code: code
              },
              success: function (res) {
                console.log(res)
                if(res.statusCode == 200){
                  if (res.data.code == 1) {
                    wx.setStorage({
                      key: "userId",
                      data: res.data.data.user_id
                    });
                    wx.setStorage({
                      key: "vip_info",
                      data: res.data.data.vip_info
                    });
                    _this.setData({
                      user_id: res.data.data.user_id
                    });
                    _this.getData();
                  };
                }else{
                  wx.showModal({
                    content: '登录失败',
                    showCancel: false
                  });
                  _this.getData();
                };             
              }
            })
          }
        });
      }
    });

  },
  getData:function(){
    var _this=this;
    wx.request({
      url: 'https://xcv.xiaorizi.me/shopdetail/',
      data: {
        shop_id: _this.data.id,
        user_id: _this.data.user_id
      },
      success: function (res) {
      
        wx.hideLoading();
        if (res.statusCode == 200) {
          _this.setData({
            img: res.data.data.img,
            title: res.data.data.title,
            name: res.data.data.name,
            tag: res.data.data.space.name,
            open_time: res.data.data.open_time,
            address: res.data.data.address,
            tel: res.data.data.phone,
            position: res.data.data.location,
            content: res.data.data.content,
            vip: res.data.data.for_vip,
            has_liked: res.data.data.has_liked
          })
        } else {
          wx.showModal({
            content: '服务器开小差啦',
            showCancel: false
          });
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showModal({
          content: '服务器开小差啦',
          showCancel: false
        });
      }
    });
  },
//评论
  sendCom:function(e){
    var _this=this,root_id=this.data.root_id,root_type=0,input=this.data.input;
    var index=e.target.dataset.index;
    if (typeof index =='number') {
      root_type = 10;
      input = this.data._input
    }
  
    if (input != ''){
      wx.request({
        url: 'https://xcv.xiaorizi.me/addcomment/',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          root_id: _this.data.root_id,
          user_id: _this.data.user_id,
          root_type: root_type,
          content: input
        },
        method: 'POST',
        success: function (res) {
          var comment = _this.data.comment;
          var new_com = {
            content: input,
            avatar: _this.data.user.avatarUrl,
            name: _this.data.user.nickName,
          }
          if (root_id == _this.data.id) {
            //小店评论
            comment.current_objects.splice(0, 0, new_com);
            _this.setData({
              comment: comment,
              input: '',
              _input: ''
            })
            _this.getComment()
          } else {
            comment.current_objects[index].son_commonts.push(new_com);
            _this.setData({
              comment: comment,
              input: '',
              _input: '',
              root_id: _this.data.id
            })
          }
        },
        fail: function () {
          wx.showModal({
            content: '服务器开小差啦',
            showCancel: false
          });
        }
      });
    }else{
      wx.showModal({
        content: '请填写评论',
        showCancel: false
      });
    }
  },
  getComment:function(){
    var _this=this;
    wx.request({
      url: 'https://xcv.xiaorizi.me/getcomment?root_id=' + _this.data.id,
      success: function (res) {
        _this.setData({
          comment: res.data.commentdata
        })
      }
    })
  },
  inputChange:function(e){
    this.setData({
      input: e.detail.value
    })
  },
  _inputChange: function (e) {
    this.setData({
      _input: e.detail.value
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: this.data.title,
      path: 'pages/shop/shop?id='+this.data.id,
    }
  },
  reply:function(e){
    this.setData({
      root_id:e.target.dataset.id
    })
  },
  cancle:function(){
    this.setData({
      root_id: this.data.id
    })
  },
  backTop:function(){
    this.setData({
      top:0
    })
  },
  scroll:function(e){
    this.setData({
      s_top: e.detail.scrollTop
    })
  },
  collect:function(e){
    if (!this.data.user_id){
          wx.switchTab({
            url: '../user/user',
          })
    }
    var type = e.target.dataset.type,_this=this;
    (type == 0) ? _this.setData({ has_liked: true }) : _this.setData({ has_liked: false })  
    wx.request({
      url: 'https://xcv.xiaorizi.me/userlike',
      data:{
        root_type:0,
        root_id:_this.data.id,
        user_id:_this.data.user_id,
        cancle:type
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method:'POST',
      success:function(res){
        console.log(res)
        if(res.data.code == 1){
          (type == 0) ? _this.setData({ has_liked: true }) : _this.setData({ has_liked: false })  
        }
      }
    })
  }
})