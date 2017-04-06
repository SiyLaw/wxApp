// pages/services/services.js
var app = getApp();
Page({
  data: {
    headinfo: {}
  },
  onLoad: function (options) {
    //调用应用实例的方法获取全局数据
    var that = this
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        headinfo: {
          score: 88,
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          province: userInfo.province,
          city: userInfo.city
        }
      })
    })
  }
})