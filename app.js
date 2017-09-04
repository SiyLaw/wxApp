//app.js
var util = require('/utils/util.js');
App({
  onLaunch: function () {
    wx.checkSession({
      success: function (e) {   //登录态未过期
      },
      fail: function () {   //登录态过期了
        wx.setStorageSync('openkey', null);
        wx.setStorageSync('code', '');
      }
    })
  },
  getOpenInfo: function (doAfter) {
    var that = this
    var openkey = wx.getStorageSync('openkey') || {};
    var rescode = wx.getStorageSync('code') || '';
    if (!openkey.OPEN_KEY && rescode != '') {
      util.getOpenId(that.globalData.url, rescode, function (res) {
        that.globalData.openData = res.data
        wx.setStorageSync('openkey', res.data);//存储openid
        typeof doAfter == "function" && doAfter()
      })
    } else if (rescode == '') {
      that.getUserInfo(function(){
        that.getOpenInfo(doAfter)
      })
    }
    if (openkey && openkey.OPEN_KEY) {
      if (!that.globalData.openData || openkey.OPEN_KEY != that.globalData.openData.OPEN_KEY) {
        that.globalData.openData = openkey
      }
    }
    if (openkey.OPEN_KEY && rescode != '') {
      typeof doAfter == "function" && doAfter()
    }
  },
  getUserInfo: function (doAfter,doGetUser) {
    var that = this
    var user = wx.getStorageSync('user') || {};
    var code = wx.getStorageSync('code') || '';
    if (!user.nickName || code == '') {
      //调用登录接口
      wx.login({
        success: function (res) {
          if (res.code) {
            that.globalData.code = res.code;
            wx.setStorageSync('code', res.code);//userInfo
            typeof doAfter == "function" && doAfter()
            wx.getUserInfo({
              success: function (res2) {
                that.globalData.userInfo = res2.userInfo;
                wx.setStorageSync('user', res2.userInfo);//userInfo
                typeof doGetUser == "function" && doGetUser(res2.userInfo)
              }
            })
          }
          else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
        , fail: function (res){
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      })
    } else {
      that.globalData.userInfo = user;
      that.globalData.code = code;
      typeof doAfter == "function" && doAfter()
      typeof doGetUser == "function" && doGetUser(user)
    }
  },
  globalData: {
    userInfo: null,
    openData: null,
    code: '',
    url: 'https://www.yondo.cc/wx/wxget.axd',
    uploadurl: 'https://www.yondo.cc/wx/wxupload.axd',
    bseurl: 'https://www.yondo.cc/'
  }
})