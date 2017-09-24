// InterAct.js
var util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PAGE: "INTERACT",
    COLOR: ['#6699cc', '#778899', '#99cc66', '#5F9EA0', '#8FBC8F', '#BDB76B'],
    TOPIC: [],
    RCNT: 1,
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
    util.Post(this, "LOAD", jsPost, function (that, data) {
      if (data.lt.length > 0) {
        that.setData({
          TOPIC: data.lt,
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
      util.Post(this, "MORE", jsPost, function (that, data) {
        let loadComplete = false;
        if (data.lt.length < 1)
          loadComplete = true;
        that.setData({
          TOPIC: util.updateArr(that.data.TOPIC, data.lt, "qid"),
          moreLoading: false,
          moreLoadingComplete: true
        })
      })
    }
  },
  createAct:function(e){
    wx.navigateTo({
      url: '/pages/InterAct/InterAct_add'
    })
  },
  navtoview: function (e) {
    wx.navigateTo({
      url: '/pages/InterAct/InterAct_view?qid=' + e.currentTarget.dataset.qid
    })
  },
  onPullDownRefresh() {
    var jsPost = new util.jsonRow()
    jsPost.AddCell("RCNT", this.data.TOPIC.length < 10 ? 10 : this.data.TOPIC.length)
    jsPost.AddCell("CCNT", 0)
    util.Post(this, "LOAD", jsPost, function (that, data) {
      that.setData({
        TOPIC: util.updateArr(that.data.TOPIC, data.lt,"qid"),
        moreLoading: false,
        moreLoadingComplete: false
      })
    });
    wx.stopPullDownRefresh()
  }
})
