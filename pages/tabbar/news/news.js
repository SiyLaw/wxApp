// pages/news/news.js
var util = require('../../../utils/util.js');
var app = getApp();
var startDot = { x: 0, y: 0 };//触摸时的原点
var endDot = { x: 0, y: 0 };
Page({
  data: {
    height: 0,
    width: 0,
    bseurl: '',
    rpxrate: 0.0, //rpx-px比率
    PAGE: "NEWS_LIST",
    RCNT: 10,//每次请求数量
    HOTS: [],
    second: 5,//录音秒
    finished: true,//是否完成录音
    searchval: "",//搜索内容
    menuhide: true,//是否折叠菜单
    menu: [],//菜单内容
    menuIndex: -1,
    menuKey: '', //内容分类浏览关键字
    moreLoading: false,
    moreLoadingComplete: false,
    currenttime: 0,
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

    var jsPost = new util.jsonRow()
    jsPost.AddCell("RCNT", that.data.RCNT)
    jsPost.AddCell("CCNT", that.data.HOTS.length)
    Post.call(this, this, "LOAD", jsPost, function (that, data) {
      that.setData({
        height: SysInfo.windowHeight,
        width: SysInfo.screenWidth,
        rpxrate: Math.floor(SysInfo.screenWidth / 750 * 100) / 100,
        HOTS: data.HOTS,
        menu: data.MENU,
        bseurl: app.globalData.bseurl
      })
    });
  },
  //展开或隐藏菜单
  menucontrol: function (e) {
    this.setData({
      menuhide: !this.data.menuhide
    })
  },
  subitemcontrol: function (e) {
    let key = ''
    if (e.currentTarget.dataset.idx != -1)
      key = this.data.menu[e.currentTarget.dataset.idx].id
    this.setData({
      menuIndex: e.currentTarget.dataset.idx
      , menuhide: !this.data.menuhide
      , menuKey: key
    });
  },
  onPullDownRefresh() {
    var jsPost = new util.jsonRow()
    jsPost.AddCell("RCNT", this.data.HOTS.length)
    jsPost.AddCell("CCNT", 0)
    Post.call(this, this, "LOAD", jsPost, function (that, data) {
      that.setData({
        HOTS: data.HOTS,
        moreLoadingComplete: false
      })
    });
    wx.stopPullDownRefresh()
  },
  onReachBottom: function (e) {
    if (!this.data.moreLoadingComplete) {
      this.setData({
        moreLoading: true
      })

      var jsPost = new util.jsonRow()
      jsPost.AddCell("RCNT", this.data.RCNT)
      jsPost.AddCell("CCNT", this.data.HOTS.length)
      Post.call(this, this, "MORE", jsPost, function (that, data) {
        let loadComplete = false;
        if (data.HOTS.length < 1)
          loadComplete = true;
        that.setData({
          HOTS: that.data.HOTS.concat(data.HOTS),
          moreLoading: false,
          moreLoadingComplete: true
        })
      })
    }
  }
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
