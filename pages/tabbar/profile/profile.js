// pages/services/services.js
var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    userInfo: {},
    HEAD_IMG: "",
    PAGE: "PROFILE",
    items: [{
      txt: "学习进度",
      color: "#cd853f",
      img: "/image/Reading.png",
      url: ".."
    }, {
      txt: "消息中心",
      color: "#008B8B",
      img: "/image/message.png",
      url: ".."
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
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        HEAD_IMG: userInfo.avatarUrl
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
  var jsPost = data || new util.jsonRow()
  jsPost.AddCell("PAGE", that.data.PAGE)
  jsPost.AddCell("ACTION", action)
  util._post(app.globalData.url, jsPost, function (res) {
    if (res && res.data && res.data.data) {
      //回调
      typeof doAfter == "function" && doAfter(that, res.data.data)
    }
    else {
      // console.log('error')
    }
  })
}