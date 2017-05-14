// pages/services/services.js
var util = require('../../../utils/util.js')

var app = getApp()
Page({
  data: {
    userInfo: {},
    HEAD_IMG: "",
    items: [{
      txt: "学习进度",
      color: "#cd853f",
      img: "../../../image/Reading.png",
      url: ".."
    }, {
      txt: "消息中心",
      color: "#008B8B",
      img: "../../../image/sms.png",
      url: ".."
    }, {
      txt: "帐号",
      color: "#3CB371",
      img: "../../../image/user.png",
      url: "/pages/profile/profile"
    }]
  },
  checkUser: function (e) {
    console.log(e)
  },
  onLoad: function (options) {
    var that = this

    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        HEAD_IMG: userInfo.avatarUrl
      })
    })
  }
})