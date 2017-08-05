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
    msgs: [],//话题讨论内容
    exerises: [],
    q_type: ["单选题", "多选题", "不定项题", "判断题", "主观题", "其他"],
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
    jsPost.AddCell("QID", options.qid)
    Post.call(this, this, "LOAD", jsPost, function (that, data) {
      if (data.exerises.length > 0) {
        that.setData({
          QID: options.qid,
          exerises: data.exerises,
          hideLoad: false
        })
        wx.setNavigationBarTitle({
          title: data.exerises[0].title,
        })
      }
      wx.hideLoading()
    });
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
    let sExe = this.data.exerises
    let iFeedIndex = e.currentTarget.dataset.idx
    let rid = sExe[iIndex].feeds[iFeedIndex].id
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
    let sExe = this.data.exerises
    let sId = sExe[iIndex].qid
    var jsPost = new util.jsonRow()
    jsPost.AddCell("QID", sId)
    jsPost.AddCell("RID", this.data.r_id)
    jsPost.AddCell("TEXT", this.data.comm_text)
    Post.call(this, this, "COMMENT", jsPost, function (that, data) {
      //题目评论
      let cExes = that.data.exerises
      cExes[that.data.index].feeds = data.feeds
      that.setData({
        exerises: cExes,
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
    let sExe = this.data.exerises
    let iFeedIndex = e.currentTarget.dataset.idx
    if (sExe[iIndex].feeds[iFeedIndex].is_agreed) {
      sExe[iIndex].feeds[iFeedIndex].agree -= 1
    } else {
      sExe[iIndex].feeds[iFeedIndex].agree += 1
    }
    sExe[iIndex].feeds[iFeedIndex].is_agreed = !sExe[iIndex].feeds[iFeedIndex].is_agreed
    this.setData({
      exerises: sExe
    })
    var jsPost = new util.jsonRow()
    jsPost.AddCell("DID", sExe[iIndex].feeds[iFeedIndex].id)
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
    console.log('1112221')
  },
  onShare: function (e) {
    console.log('1111')
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