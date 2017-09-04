// pages/tabbar/study/real/real.js
var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    PAGE: "REAL_SIMULATE",
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
  },
  onShow: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    Post.call(this, this, "LOAD")
  },
  onPullDownRefresh() {
    Post.call(this, this, "LOAD")
    wx.stopPullDownRefresh()
  },
  addbatch() {
    Post.call(this, this, "ADD")
  },
  exebatch() {
    wx.navigateTo({
      url: 'realsimulate_exe?id=' + this.data.batches[0].EXAM_BATCH_ID + '&txt=' + this.data.batches[0].BATCH_NO,
    })
  }
})

function Post(that, action, data) {
  //数据请求执行方法
  util.Post(that,action, data, function (that,res) {
    if (res) {
      //更新数据
      if (action == "LOAD") {
        let objbatches = res.batches
        for (var i = 0; i < objbatches.length; i++) {
          objbatches[i].EXAM_USER_DT = util.formatString(objbatches[i].EXAM_USER_DT)
        }
        that.setData({
          batches: objbatches
        })
        wx.hideLoading()
      } else if (action == "ADD") {
        let objbatches = res.batches
        for (var i = 0; i < objbatches.length; i++) {
          objbatches[i].EXAM_USER_DT = util.formatString(objbatches[i].EXAM_USER_DT)
        }
        that.setData({
          batches: objbatches
        })
      }
    }
  })
}
