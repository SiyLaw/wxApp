// InterAct_view.js
var util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PAGE: "INTERACT_VIEW",
    COLOR: ['#6699cc', '#778899', '#99cc66', '#5F9EA0', '#8FBC8F', '#BDB76B'],
    QID: '', //话题ID
    content: [],//话题内容
    refer: [],//话题引用内容
    feeds: [],//话题讨论内容
    q_type: ["题目","法条","课堂","教材","资讯","其它"],
    index: 0,
    isLoad: false,
    hideLoad: true,
    r_id: '',
    comm_len: 0,
    comm_text: '',
    show_comment_module: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var jsPost = new util.jsonRow()
    jsPost.AddCell("ID", options.id)
    util.Post(this, "LOAD", jsPost, function (that, data) {
      if (data && data.lt.length > 0) {
        that.setData({
          QID: options.id,
          content: data.lt,
          refer: data.rlt,
          feeds: data.msgs.feeds,
          hideLoad: false
        })
      }
      wx.hideLoading()
    })
  },
  loadmore: function (e) {
    Post.call(this, this, "MORE", null, function (that, data) {
      if (data.lt.length > 0) {
        that.setData({
          TOPIC: that.data.TOPIC.concat(data.lt),
          QID: data.lt[data.lt.length - 1].qid
        })
      } else {
        wx.showToast({
          title: '无更多数据!',
        })
      }
    });
  },
  //------------------------START-----评论-------------------------
  doComments: function (e) {
    //评论题目窗口
    this.setData({
      r_id: '',
      show_comment_module: true
    })
  },
  doDisComm: function (e) {
    //评论-评论
    let iIndex = this.data.index
    let sExe = this.data.feeds
    let iFeedIndex = e.currentTarget.dataset.idx
    let rid = sExe[iFeedIndex].id
    this.setData({
      r_id: rid,
      show_comment_module: true
    })
  },
  InputComm: function (e) {
    //输入评论时，实时显示长度
    this.setData({
      comm_text: e.detail.value,
      comm_len: e.detail.value.length
    })
  },
  SubmitComm: function (e) {
    //提交评论
    let iIndex = this.data.index
    let sId = this.data.QID
    var jsPost = new util.jsonRow()
    jsPost.AddCell("QID", sId)
    jsPost.AddCell("RID", this.data.r_id)
    jsPost.AddCell("TEXT", this.data.comm_text)
    Post.call(this, this, "COMMENT", jsPost, function (that, data) {
      //题目评论
      that.setData({
        feeds: data.feeds,
        comm_text: '',
        comm_len: 0,
        r_id: '',
        show_comment_module: false
      })
    })
  },
  CloseComm: function (e) {
    //关闭评论
    this.setData({
      r_id: '',
      show_comment_module: false
    })
  },
  doLike: function (e) {
    //评论点赞

    let iIndex = this.data.index
    let sExe = this.data.feeds
    let iFeedIndex = e.currentTarget.dataset.idx
    if (sExe[iFeedIndex].is_agreed) {
      sExe[iFeedIndex].agree -= 1
    } else {
      sExe[iFeedIndex].agree += 1
    }
    sExe[iFeedIndex].is_agreed = !sExe[iFeedIndex].is_agreed
    this.setData({
      feeds: sExe
    })
    var jsPost = new util.jsonRow()
    jsPost.AddCell("DID", sExe[iFeedIndex].id)
    Post.call(this, this, "LIKE", jsPost)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this
    return {
      title: '试题互动',
      desc: '',
      path: '/pages/InterAct/InterAct_view?qid=' + that.data.QID
    }
  }
})


//服务器请求数据
function Post(that, action, data, doAfter) {
  //数据请求执行方法
  util.Post(that, action, data, function (that, res) {
    if (res) {
      //回调
      typeof doAfter == "function" && doAfter(that, res)
    }
    else {
      // console.log('error')
    }
  })
}