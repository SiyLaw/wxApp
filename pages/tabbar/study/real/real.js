// pages/tabbar/study/real/real.js
var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    PAGE: "REAL",
    batches: [],
    height: 0
  },
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success(res) {
        that.setData({
          height: res.screenHeight * 2
        })
      }
    })
    Post.call(this, this, "LOAD")
  },
  onPullDownRefresh() {
    Post.call(this, this, "LOAD")
  }
})

function Post(that, action, data) {
  //数据请求执行方法
  var jsPost = data || new util.jsonRow()
  jsPost.AddCell("PAGE", that.data.PAGE)
  jsPost.AddCell("ACTION", action)
  util._post(app.globalData.url, jsPost, function (res) {
    if (res && res.data && res.data.data) {
      //更新数据
      if (jsPost.arrjson.ACTION == "LOAD") {
        that.setData({
          batches: res.data.data.batches
        })
      }
    }
    else {
      // console.log('error')
    }
  })
}
