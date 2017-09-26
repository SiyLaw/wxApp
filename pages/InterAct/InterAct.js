// InterAct.js
var util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PAGE: "INTERACT",
    COLOR: ['#BDB76B', '#8FBC8F', '#778899','#E9967A'],
    TOPIC: [],
    RCNT: 10,
    IDX: 1,
    moreLoading: false,
    moreLoadingComplete: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var jsPost = new util.jsonRow()
    jsPost.AddCell("RCNT", that.data.RCNT)
    jsPost.AddCell("IDX", that.data.IDX)
    util.Post(this, "LOAD", jsPost, function (that, data) {
      if (data.lt.length > 0) {
        that.setData({
          TOPIC: data.lt,
          IDX: that.data.IDX + 1,
          hideLoad: false
        })
      }
      wx.hideLoading()
    });
  },
  onReachBottom: function (e) {
    if (!this.data.moreLoadingComplete) {
      this.setData({
        moreLoading: true
      })
      var jsPost = new util.jsonRow()
      jsPost.AddCell("RCNT", this.data.RCNT)
      jsPost.AddCell("IDX", this.data.IDX)
      util.Post(this, "LOAD", jsPost, function (that, data) {
        let loadComplete = false;
        if (data.lt.length < 1)
          loadComplete = true;
        that.setData({
          TOPIC: util.updateArr(that.data.TOPIC, data.lt, "INTERACT_ID"),
          moreLoading: false,
          moreLoadingComplete: true
        })
      })
    }
  },
  createAct: function (e) {
    wx.navigateTo({
      url: '/pages/InterAct/InterAct_add'
    })
  },
  navtoview: function (e) {
    wx.navigateTo({
      url: '/pages/InterAct/InterAct_view?id=' + e.currentTarget.dataset.INTERACT_ID
    })
  },
  onPullDownRefresh() {
    var jsPost = new util.jsonRow()
    jsPost.AddCell("RCNT", this.data.TOPIC.length < 10 ? 10 : this.data.TOPIC.length)
    jsPost.AddCell("IDX", 1)
    util.Post(this, "LOAD", jsPost, function (that, data) {
      that.setData({
        TOPIC: util.updateArr(that.data.TOPIC, data.lt, "INTERACT_ID"),
        moreLoading: false,
        moreLoadingComplete: false
      })
    });
    wx.stopPullDownRefresh()
  }
})
