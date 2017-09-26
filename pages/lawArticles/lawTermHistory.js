// pages/lawArticles/lawTermHistory.js
var util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PAGE: "INTERACT",
    REF_CONTENT_ID: '',
    REF_CONTENT_TYPE: '',
    REF_A: '',
    REF_B: '',
    REF_C: '',
    btnable: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (options.id != "" && options.t != "") {
      var jsPost = new util.jsonRow()
      jsPost.AddCell("REF_CONTENT_ID", options.id)
      jsPost.AddCell("REF_CONTENT_TYPE", options.t)
      util.Post(that, "GET_REFER_CONTENT", jsPost, function (that, res) {
        if (res.REF_CONT.length > 0)
          that.setData({
            REF_A: res.REF_CONT[0].REF_A,
            REF_B: res.REF_CONT[0].REF_B,
            REF_C: res.REF_CONT[0].REF_C,
            REF_CONTENT_ID: options.id,
            REF_CONTENT_TYPE: options.t
          })
      })
    }
  }
})
