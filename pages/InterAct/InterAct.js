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
    QID: '',
    DID: '',
    isLoad: false,
    hideLoad: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    Post.call(this, this, "LOAD", null, function (that, data) {
      if (data.lt.length > 0) {
        that.setData({
          TOPIC: data.lt,
          QID: data.lt[data.lt.length - 1].qid,
          DID: data.lt[data.lt.length - 1].did,
          hideLoad: false
        })
      }
      wx.hideLoading()
    });
  },
  loadmore: function (e) {
    Post.call(this, this, "MORE", null, function (that, data) {
      if (data.lt.length > 0) {
        let vTopic = that.data.TOPIC.concat(data.lt)
        that.setData({
          TOPIC: vTopic,
          QID: vTopic[vTopic.length - 1].qid,
          DID: vTopic[vTopic.length - 1].did
        })
      } else {
        wx.showToast({
          title: '无更多数据!',
        })
      }
    });
  },
  navtoview: function (e) {
    wx.navigateTo({
      url: '/pages/InterAct/InterAct_view?qid=' + e.currentTarget.dataset.qid
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})

//服务器请求数据
function Post(that, action, data, doAfter) {
  //数据请求执行方法
  var jsPost = data || new util.jsonRow()
  jsPost.AddCell("PAGE", that.data.PAGE)
  jsPost.AddCell("ACTION", action)
  jsPost.AddCell("QID", that.data.QID)
  jsPost.AddCell("DID", that.data.DID)
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