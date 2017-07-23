// pages/news/news.js
var util = require('../../../utils/util.js')
var app = getApp();
Page({
  data: {
    PAGE: "NEWS_LIST",
    HOTS: []
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh()
  },
  onLoad: function (options) {
    //调用应用实例的方法获取全局数据
    var that = this
    Post.call(this, this, "LOAD", null, function (that, data) {
      that.setData({
        HOTS: data.HOTS
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
