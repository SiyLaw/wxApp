// pages/news/news.js
var app = getApp();
Page({
  data: {
    headinfo: {},
    exerises: [{
      id: 'ID_TITLE1'
      //评论
      , feeds: [{ id: '1', user: 'Lucy', head_img: '/image/Collaboration.png', feed_title: '公民权利', feed_txt: '关于公民权利的问题1... ', time: '1天前' }
      ,{ id: '2', user: 'Lucy', head_img: '/image/Crown.png', feed_title: '法律重视程序，不讲效率？', feed_txt: '关于公民权利的问题1... ', time: '1天前' }
      ,{ id: '3', user: 'Lucy', head_img: '/image/StarSelected.png', feed_title: '法律不是万能的？', feed_txt: '法律不是万能的，其作用是有限的？ ', time: '3天前' }
      ,{ id: '4', user: 'Lucy', head_img: '/image/Law.png', feed_title: '法律强调稳定性', feed_txt: '法律强调稳定性，避免灵活性... ', time: '1个月前' }
      ,{ id: '5', user: 'Lucy', head_img: '/image/Peptide.png', feed_title: '法律反映客观规律', feed_txt: '法律反映客观规律，不体现人的意志... ', time: '5天前' },]
    }],
    index: 0
  },
  onLoad: function (options) {
    //调用应用实例的方法获取全局数据
    var that = this
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        headinfo: {
          score: 88,
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          province: userInfo.province,
          city: userInfo.city
        }
      })
    })
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