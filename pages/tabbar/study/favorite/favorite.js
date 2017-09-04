// pages/tabbar/study/favorite/favorite.js
var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    PAGE: "FAVORITE",
    batches: [],
    iheight: 0,
    hidden: true,
    page: 1,
    size: 20,
    hasMore: true,
    hasRefesh: false
  },
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success(res) {
        that.setData({
          iheight: res.screenHeight * 2
        })
        console.log(res.screenHeight * 2)
      }
    })
  },
  onShow: function () {
    // wx.showLoading({
    //   title: '加载中...',
    //   mask: true
    // })
    //Post.call(this, this, "LOAD")
  },
  onPullDownRefresh() {
    Post.call(this, this, "LOAD")
    wx.stopPullDownRefresh()
  }, onReachBottom() {
    this.setData({
      hasMore: !this.data.hasMore,
      hidden: !this.data.hidden
    })
  },
  loadMore() {
    console.log('loadMore')
    //Post.call(this, this, "ADD")
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
      }
    }
  })
}
