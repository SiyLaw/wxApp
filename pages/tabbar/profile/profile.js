// pages/services/services.js
var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    userInfo: { avatarUrl: '/image/log60.png', nickName: '' },
    PAGE: "PROFILE",
    items: [{
      txt: "学习进度",
      color: "#cd853f",
      img: "/image/Reading.png",
      url: "/"
    }, {
      txt: "消息中心",
      color: "#008B8B",
      img: "/image/message.png",
      url: "/"
    }, {
      txt: "帐号",
      color: "#3CB371",
      img: "/image/user.png",
      url: "/pages/profile/profile"
    }],
    info: [{ RATE: '-', DT: '-', US: '-' }]
  },
  onLoad: function (options) {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(null, function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    Post.call(this, this, "LOAD", null, function (that, data) {
      if (data.info.length > 0) {
        data.info[0].US = util.formatString(data.info[0].US)
      }
      that.setData({
        info: data.info
      })
    });
  }
})

//服务器请求数据
function Post(that, action, data, doAfter) {
  //数据请求执行方法
  util.Post(that, action, data, function (that, res) {
    if (res) {
      //回调
      typeof doAfter == "function" && doAfter(that, res)
    }
    else {
      // console.log('error')
    }
  })
}