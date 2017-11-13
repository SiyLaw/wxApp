// pages/study/study.js
var app = getApp();
Page({
  data: {
    headinfo: {},
    Items: [
      [{
        id: "t1",
        open: false,
        bkImg: "../../../image/Trademark.png",
        selectBkImg: "../../../image/Trademark.png",
        text: "历年真题",
        page: "real"
      }, {
        id: "t2",
        open: false,
        bkImg: "../../../image/SheriffSelected.png",
        selectBkImg: "../../../image/SheriffSelected.png",
        text: "随机练习",
        page: "random"
      }, {
        id: "t3",
        open: false,
        bkImg: "../../../image/real.png",
        selectBkImg: "../../../image/real.png",
        text: "全真模拟",
        page: "realsimulate"
      }], [{
        id: "t4",
        open: false,
        bkImg: "../../../image/External.png",
        selectBkImg: "../../../image/External.png",
        text: "专项训练",
        page: "special"
      }, {
        id: "t5",
        open: false,
        bkImg: "../../../image/Amnesty.png",
        selectBkImg: "../../../image/Amnesty.png",
        text: "支付测试", //我的收藏
        page: "favorite"
      }, {
        id: "t6",
        open: false,
        bkImg: "../../../image/Rules.png",
        selectBkImg: "../../../image/Rules.png",
        text: "学习评估",
        page: "evaluation"
      }]
    ]
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    //调用应用实例的方法获取全局数据
  },
  selectedTap: function (e) {
    var id = e.currentTarget.id, list = this.data.Items;
    for (var i = 0, len = list.length; i < len; ++i) {
      var subList = list[i];
      for (var j = 0, jLen = subList.length; j < jLen; ++j) {
        if (subList[j].id != id) {
          subList[j].open = false
        } else {
          subList[j].open = true
        }
      }
    }
    this.setData({
      Items: list
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
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }
})