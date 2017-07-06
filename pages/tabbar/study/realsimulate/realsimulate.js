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
   // Post.call(this, this, "LOAD")
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
  var jsPost = data || new util.jsonRow()
  jsPost.AddCell("PAGE", that.data.PAGE)
  jsPost.AddCell("ACTION", action)
  util._post(app.globalData.url, jsPost, function (res) {
    if (res && res.data && res.data.data) {
      //更新数据
      if (jsPost.arrjson.ACTION == "LOAD") {
        let objbatches = res.data.data.batches
        for (var i = 0; i < objbatches.length; i++) {
          objbatches[i].EXAM_USER_DT = util.formatString(objbatches[i].EXAM_USER_DT)
        }
        that.setData({
          batches: objbatches
        })
        wx.hideLoading()
      } else if (jsPost.arrjson.ACTION == "ADD") {
        let objbatches = res.data.data.batches
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
