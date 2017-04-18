// pages/news/news.js
var app = getApp();
Page({
  data: {
    headinfo: {},
    exerises: [{
      id: 'ID_TITLE1'
      //评论
      , feeds: [{ id: '1', user: 'Lucy', head_img: '/image/Female50.png', feed_txt: '关于公民权利的问题1... ', isAgreed: false, agree: 2, comments: 4, time: '1天前' },
      { id: '2', user: 'Jack', head_img: '/image/Male50.png', feed_txt: '关于公民权利的问题2... ', isAgreed: true, agree: 2, comments: 4, time: '2个星期前' },
      { id: '3', user: 'Jim', head_img: '/image/Male50.png', feed_txt: '关于公民权利的问题3... ', isAgreed: false, agree: 2, comments: 4, time: '1个月前' },
      { id: '4', user: 'Jim', head_img: '/image/Male50.png', feed_txt: '关于公民权利的问题4... ', isAgreed: false, agree: 2, comments: 4, time: '1个月前' },
      { id: '5', user: 'Jim', head_img: '/image/Male50.png', feed_txt: '关于公民权利的问题5... ', isAgreed: false, agree: 2, comments: 4, time: '1个月前' },
      { id: '6', user: 'Jim', head_img: '/image/Male50.png', feed_txt: '关于公民权利的问题6... ', isAgreed: false, agree: 2, comments: 4, time: '1个月前' }]
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