//app.js
App({
  onLaunch: function () {  
    var _this=this;
    wx.getSystemInfo({
      success: function (res) {
        if(res.isQB){
          _this.globalData.isQB=true
        }else{
          // _this.login();
        }
      }
    })
  },
  login: function () {
    console.log('2333')
    var _this = this;
    wx.login({
      success: function (res) {
       
        var code = res.code;
        wx.getUserInfo({
          success: function (res) {
            console.log(res)
            _this.globalData.userInfo = res.userInfo;
            wx.request({
              url: 'https://xcv.xiaorizi.me/user/login/',
              data: {
                iv: res.iv,
                encryptedData: res.encryptedData,
                js_code: code
              },
              success: function (res) {
                console.log(res)
                if (res.data.code == 1) {
                  _this.globalData.user_id = res.data.data.user_id
                };
                console.log(_this.globalData)
              }
            })
          }
        });
      }
    });
  },
  globalData: {
    userInfo: '',
    user_id:'',
    isQB:false
  }
})