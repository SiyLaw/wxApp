// pages/tabbar/study/evaluation/evaluation.js
var util = require('../../../../utils/util.js')
var app = getApp()
function timer(that) {
  if (that.data.second > 0 && !that.data.finished)
    var time = setTimeout(function () {
      that.setData({
        second: that.data.second - 1
      })
      timer(that)
    }, 1000)
}
Page({
  data: {
    vt: '',
    second: 5,
    finished: true
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  startRecord: function (e) {
    var that = this
    this.setData({
      second: 5,
      finished: false
    });
    timer(that)
    wx.startRecord({
      success: function (res) {
        var user = wx.getStorageSync('user')
        var tempFilePath = res.tempFilePath
        wx.uploadFile({
          url: app.globalData.uploadurl, //仅为示例，非真实的接口地址
          filePath: tempFilePath,
          name: 'file',
          formData: {
            'OPEN_ID': user.openid
            , 'F_UPLOAD': 'sss'
            , 's': '2'
          },
          success: function (res) {
            that.setData({
              vt: res.data
            })
          }
        })
      },
      fail: function (res) {
        //录音失败
      }
    })
    setTimeout(function () {
      //结束录音  
      wx.stopRecord()
      that.setData({
        second: 0,
        finished: true
      })
    }, 5000)
  },
  endRecord: function (e) {
    wx.stopRecord()
    this.setData({
      second: 0,
      finished: true
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})