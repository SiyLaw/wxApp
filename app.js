//app.js
App({
  onLaunch: function () {
  },
  getUserInfo: function (cb) {
    var that = this
    var user = wx.getStorageSync('user') || {};
    if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) && (!this.globalData.userInfo)) {
      //调用登录接口
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.getUserInfo({
              success: function (res) {
                var objz = {};
                objz.avatarUrl = res.userInfo.avatarUrl;
                objz.nickName = res.userInfo.nickName;
                objz.province = res.userInfo.province;
                objz.city = res.userInfo.city;
                that.globalData.userInfo = objz;
                typeof cb == "function" && cb(that.globalData.userInfo)
              }
            });
            var d = that.globalData;//这里存储了appid、secret、token串  
            var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appid + '&secret=' + d.secret + '&js_code=' + res.code + '&grant_type=authorization_code';
            wx.request({
              url: l,
              data: {},
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
              // header: {}, // 设置请求的 header  
              success: function (res) {
                var obj = {};
                obj.openid = res.data.openid;
                obj.expires_in = Date.now() + res.data.expires_in;
                wx.setStorageSync('user', obj);//存储openid  
              }
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }
    else {
      typeof cb == "function" && cb(that.globalData.userInfo)
    }
  },
  globalData: {
    userInfo: null,
    appid: 'wx802cd0a3c07e95ce',//appid
    secret: '90a714b70aa14c9a10c05a08d9a3aca8',//secret
    url :'https://www.mssco.net/wx/wxget.axd'
  }
})