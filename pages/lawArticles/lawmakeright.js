// pages/lawArticles/lawmakeright.js
var util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PAGE: "LAWITEM",
    TERM_PROFILE_ID: '',
    TERM_NO: '',
    TERM_CONTENT: '',
    btnable: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (options.id != "" && options.t != "") {
      var jsPost = new util.jsonRow()
      jsPost.AddCell("TID", options.id)
      util.Post(that, "GET_CONTENT", jsPost, function (that, res) {
        if (res.lt.length > 0)
          that.setData({
            TERM_NO: res.lt[0].TERM_NO,
            TERM_CONTENT: res.lt[0].TERM_CONTENT,
            TERM_PROFILE_ID: options.id
          })
      })
    }
  },
  formSubmit: function (e) {
    var that = this
    that.setData({
      btnable: true
    })
    var jsPost = new util.jsonRow()
    for (var m in e.detail.value) {
      if (e.detail.value[m] == "") {
        wx.showToast({
          image: '/image/error.png',
          title: '数据项不能为空'
        })
        that.setData({
          btnable: false
        })
        return;
      }
      jsPost.AddCell(m, e.detail.value[m])
    }
    jsPost.AddCell("TID", that.data.TERM_PROFILE_ID)
    util.Post(that, "ADD_ERR_ITEM", jsPost, function (that, res) {
      if (res == "1") {
        wx.showToast({
          title: '已提交...',
          duration: 1500
        })
        setTimeout(
          function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500
        )
      } else {
        that.setData({
          btnable: false
        })
      }
    })
  }
})
