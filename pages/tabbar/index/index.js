//index.js
//获取应用实例
var util = require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    PAGE: "INDEX",
    RCNT: 4,//每次请求数量
    HOTS: [],
    hothide: true,
    background: [{
      id: "item-1",
      text: "法律学习有何难点?",
      color: "#800000",
      url: "https://www.yondo.cc/wx/images/101.png"
    }, {
      id: "item-2",
      text: "法律考试应该注意的问题...",
      color: "#483D8B",
      url: "https://www.yondo.cc/wx/images/102.png"
    }, {
      id: "item-3",
      text: "刑事案件实例分析...",
      color: "#2F4F4F",
      url: "https://www.yondo.cc/wx/images/103.png"
    }],
    IMGLIST: ['one.png', 'two.png', 'three.png', 'four.png']
  },
  //事件处理函数
  navtohot: function (e) {
    wx.switchTab({
      url: '/pages/tabbar/news/news'
    })
  },
  navtolaw: function (e) {
    wx.navigateTo({
      url: '/pages/lawArticles/lawList'//?id=RID0H4A0NTXAT63J&nme=中华人民共和国刑法&tid=RID0H6U0XVRB63S4'
    })
  }, navtointeract: function (e) {
    wx.navigateTo({
      url: '/pages/InterAct/InterAct',
    })
  }, navtoclass: function (e) {
    wx.navigateTo({
      url: '/pages/class/classList',
    })
  }, navtobooks: function (e) {
    wx.navigateTo({
      url: '/pages/books/bookList',
    })
  }, navtosubject: function (e) {
    wx.showToast({
      title: '开发中',
    })
  },
  onPullDownRefresh() {
    var jsPost = new util.jsonRow()
    jsPost.AddCell("RCNT", this.data.RCNT)
    jsPost.AddCell("CCNT", 0)
    util.Post(this, "LOAD", jsPost, function (that, data) {
      if (data) {
        that.setData({
          HOTS: data.HOTS,
          bseurl: app.globalData.bseurl
        })
      }
      wx.stopPullDownRefresh()
    });
  },
  onLoad: function () {
    var jsPost = new util.jsonRow()
    jsPost.AddCell("RCNT", this.data.RCNT)
    jsPost.AddCell("CCNT", 0)
    util.Post(this, "LOAD", jsPost, function (that, data) {
      that.setData({
        HOTS: data.HOTS,
        hothide: false,
        bseurl: app.globalData.bseurl
      })
    });
  }
});


