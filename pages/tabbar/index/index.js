//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    background: [{
      id: "item-1",
      text: "法律学习有何难点?",
      color:"#800000",
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
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    headinfo: {}
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  }, navtolaw:function(e){
    wx.navigateTo({
      url: '/pages/lawArticles/lawItem',
    })
  },
  onLoad: function () {
    var vwith = 0;
    //调用应用实例的方法获取全局数据
    var that = this
    app.getUserInfo(function (userInfo) {
      //更新数据
      if (userInfo) {
        that.setData({
          headinfo: {
            score: 88,
            avatarUrl: userInfo.avatarUrl,
            nickName: userInfo.nickName,
            province: userInfo.province,
            city: userInfo.city
          }
        })
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        vwith = res.windowWidth;
      }
    });
  }
});

