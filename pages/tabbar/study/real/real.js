// pages/tabbar/study/real/real.js
var util = require('../../../../utils/util.js')
Page({
  data: {
    navTab: ["题目", "析题", "讨论", "收藏"],
    currentNavtab: "0",
    exerises: [{
      ID: 'ID_TITLE'
      , type: 'multi'
      , seq: '1'
      , title: '下列有关公民权利能力的表述，有哪一项是错误的？'
      , option: [{ op: 'A', text: '权利能力是公民构成法律关系主体的一种资格' }
        , { op: 'B', text: '所有公民的权利能力都是相同的' }
        , { op: 'C', text: '公民具有权利能力，并不必然具有行为能力' }
        , { op: 'D', text: '权利能力也包括公民承担义务的能力或资格' }]
      , answer: 'B'
    }],
    index: 0,
    refreshAnimation:{},
    loading:false,
    words:[{}]
  },
  ctrlChange: function (e) {
    console.log(e)
    // var items = this.data.items;
    // for (var i = 0, len = items.length; i < len; ++i) {
    //   items[i].checked = items[i].value == e.detail.value
    // }
  },
  switchTab: function (e) {
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
  },
  upper: function () {
    wx.showNavigationBarLoading()
    this.refresh();
    console.log("upper");
    setTimeout(function () { wx.hideNavigationBarLoading(); wx.stopPullDownRefresh(); }, 2000);
  },
  lower: function (e) {
    wx.showNavigationBarLoading();
    var that = this;
    setTimeout(function () { wx.hideNavigationBarLoading(); that.nextLoad(); }, 1000);
    console.log("lower")
  },
  //网络请求数据, 实现刷新
  refresh0: function () {
    var index_api = '';
    util.getData(index_api)
      .then(function (data) {
        //this.setData({
        //
        //});
        console.log(data);
      });
  },
  //使用本地 fake 数据实现刷新效果
  refresh: function () {
    var feed = util.exerisesNext();
    console.log("loaddata");
    var feed_data = feed.data;
    this.setData({
      feed: feed_data,
      feed_length: feed_data.length
    });
  },

  //使用本地 fake 数据实现继续加载效果
  nextLoad: function () {
    var next = util.exerisesNext();
    console.log("continueload");
    var next_data = next.data;
    this.setData({
      feed: this.data.feed.concat(next_data),
      feed_length: this.data.feed_length + next_data.length
    });
  },

  onLoad: function (options) {
    //var gHeight = 
    // 页面初始化 options为页面跳转所带来的参数
  },
  onPullDownRefresh: function () {
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    console.log('onPullDownRefresh', new Date())
  },
  onReachBottom: function () {
    console.log('hi')
    if (this.data.loading) return;
    this.setData({ loading: true });
    updateRefreshIcon.call(this);
    var words = this.data.words.concat([{ message: '土生土长', viewid: '0', time: util.formatTime(new Date), greeting: 'hello' }]);
    setTimeout(() => {
      this.setData({
        loading: false,
        words: words
      })
    }, 2000)
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


/**
  * 旋转刷新图标
  */
  function updateRefreshIcon () {
    var deg = 0;
    console.log('旋转开始了.....')
    var animation = wx.createAnimation({
      duration: 1000
    });

    var timer = setInterval(() => {
      if (!this.data.loading)
        clearInterval(timer);
      animation.rotateZ(deg).step();//在Z轴旋转一个deg角度
      deg += 360;
      this.setData({
        refreshAnimation: animation.export()
      })
    }, 2000);
  }
