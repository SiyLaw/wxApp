// pages/news/news.js
var util = require('../../../utils/util.js')
var app = getApp();
Page({
  data: {
    height: 0,
    width: 0,
    rpxrate: 0.0, //rpx-px比率
    PAGE: "NEWS_LIST",
    HOTS: [],
    second: 5,//录音秒
    finished: true,//是否完成录音
    searchval: "",//搜索内容
    menuhide: true,//是否折叠菜单
    menu: []//菜单内容
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh()
  },
  onLoad: function (options) {
    //调用应用实例的方法获取全局数据
    var that = this
    var height = 0;
    var width = 0;
    var SysInfo = wx.getSystemInfoSync()
    Post.call(this, this, "LOAD", null, function (that, data) {
      that.setData({
        height: SysInfo.windowHeight,
        width: SysInfo.screenWidth,
        rpxrate: Math.floor(SysInfo.screenWidth / 750 * 100) / 100,
        HOTS: data.HOTS
      })
    });
  },
  //展开或隐藏菜单
  menucontrol: function (e) {
    this.setData({
      menuhide: !this.data.menuhide
    })
  },
})
//服务器请求数据
function Post(that, action, data, doAfter) {
  //数据请求执行方法
  var jsPost = data || new util.jsonRow()
  jsPost.AddCell("PAGE", that.data.PAGE)
  jsPost.AddCell("ACTION", action)
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
