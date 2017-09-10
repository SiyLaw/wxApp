// pages/tabbar/study/real/real.js
var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    PAGE: "REAL",
    batches: [],
    height: 0
  },
  onShow: function () {
    Post.call(this, this, "LOAD")
  },
  onLoad: function (options) {
    //Post.call(this, this, "LOAD")
  },
  onPullDownRefresh() {
    Post.call(this, this, "LOAD")
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () { }
})

function Post(that, action, data) {
  //数据请求执行方法
  util.Post(that, action, data, function (that,res) {
    if (res) {
      //更新数据
      wx.getSystemInfo({
        success(res) {
          that.setData({
            height: res.screenHeight * 2
          })
        }
      })
      if (action == "LOAD") {
        that.setData({
          batches: res.batches
        })

      }
    }
    else {
      // console.log('error')
    }
  })
}
