//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
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
    }]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  }, navtolaw: function (e) {
    wx.navigateTo({
      url: '/pages/lawArticles/lawItem'//?id=RID0H4A0NTXAT63J&nme=中华人民共和国刑法&tid=RID0H6U0XVRB63S4'
    })
  }, navtointeract: function (e) {
    wx.navigateTo({
      url: '/pages/InterAct/InterAct',
    })
  },
  onLoad: function () {
  }
});

