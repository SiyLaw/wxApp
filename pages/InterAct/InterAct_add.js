// pages/InterAct/InterAct_add.js
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
    INTERACT_NME: '',
    INTERACT_CONTENT: '',
    INTERACT_SUBJECT: '',
    REF_A: '',
    REF_B: '',
    REF_C: '',
    btnable: false,
    q_type: ["题目", "法条", "课堂", "教材", "资讯", "其它"],
    date: 5
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
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
    jsPost.AddCell("REF_CONTENT_ID", that.data.REF_CONTENT_ID)
    jsPost.AddCell("REF_CONTENT_TYPE", that.data.REF_CONTENT_TYPE)
    util.Post(that, "ADD_INTERACT", jsPost, function (that, res) {
      if (res == "1") {
        wx.showToast({
          title: '创建成功！正在跳转...',
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
