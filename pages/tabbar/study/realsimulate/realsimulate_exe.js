// real_exe.js
var util = require('../../../../utils/util.js')
var sUtil = require('../sutil.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    RSID: '',
    TXT: '',
    PAGE: "REAL_SIMULATE_EXE",
    q_type: ["单选题", "多选题", "不定项题", "判断题", "主观题", "其他"],
    exerises: [],
    ecnt: 0,//有效答题数
    start_time: null,
    index: 0,//当前答题数量
    auto_next: true,//自动下一题
    // right: 0,
    // error: 0,
    comm_text: '',
    comm_len: 0,
    r_id: '',//评论ID
    show_comment_module: false
  },
  setautonext: function (e) {
    var that = this
    that.setData({
      auto_next: !that.data.auto_next
    })
  },
  //------------------------START-----答题---------------------------
  selected: function (e) {
    //选择项确定
    sUtil.selectedOptions(e, this, function (that, objExamItem) {
      //单项选择时回调有效
      var jsPost = new util.jsonRow()
      jsPost.AddCell("ID", objExamItem.id)
      jsPost.AddCell("QID", objExamItem.qid)
      jsPost.AddCell("BID", objExamItem.bid)
      jsPost.AddCell("SEQ", objExamItem.seq)
      jsPost.AddCell("u_answer", objExamItem.u_answer)
      jsPost.AddCell("u_second", objExamItem.u_second)
      Post.call(this, that, "ANSWERED", jsPost)
    })
  },
  submitMultiVal: function (e) {
    //多选、不定项提交答案
    sUtil.submitMultiAnswer(e, this, function (that, objExamItem) {
      //非单项选择时回调
      var jsPost = new util.jsonRow()
      jsPost.AddCell("ID", objExamItem.id)
      jsPost.AddCell("QID", objExamItem.qid)
      jsPost.AddCell("BID", objExamItem.bid)
      jsPost.AddCell("SEQ", objExamItem.seq)
      jsPost.AddCell("u_answer", objExamItem.u_answer)
      jsPost.AddCell("u_second", objExamItem.u_second)
      Post.call(this, that, "ANSWERED", jsPost)
    })
  },
  //------------------------END-----答题---------------------------

  //------------------------START-----左右滑动控制------------------
  touchStart: function (e) {
    sUtil.touchStart(e)
  },
  touchMove: function (e) {
    sUtil.touchMove(e)
  },
  touchEnd: function (e) {
    sUtil.touchEnd(e, this, function (that, objExamItem) {
      // var jsPost = new util.jsonRow()
      // jsPost.AddCell("BID", objExamItem.bid)
      // Post.call(this, that, "NEXT", jsPost)
    })
  },
  //------------------------END-----左右滑动控制--------------------

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
    sUtil.comment(e, this, function (that, sId) {
      var jsPost = new util.jsonRow()
      jsPost.AddCell("QID", sId)
      jsPost.AddCell("RID", that.data.r_id)
      jsPost.AddCell("TEXT", that.data.comm_text)
      Post.call(this, that, "COMMENT", jsPost)
    })
    this.setData({
      r_id: '',
      show_comment_module: false
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
    sUtil.like(e, this, function (that, sId) {
      var jsPost = new util.jsonRow()
      jsPost.AddCell("DID", sId)
      Post.call(this, that, "LIKE", jsPost)
    })
  },
  //------------------------END-----评论---------------------------
  doColl: function (e) {
    //收藏
    sUtil.collect(e, this, function (that, sId) {
      var jsPost = new util.jsonRow()
      jsPost.AddCell("QID", sId)
      Post.call(this, that, "COLL", jsPost)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.setNavigationBarTitle({
      title: options.txt + '全真模拟'
    })
    //加载时执行
    var that = this
    //调用应用实例的方法获取全局数据
    that.setData({
      RSID: options.id
      , TXT: options.txt
      , start_time: new Date()
    })
    var exerises = wx.getStorageSync('REAL_SIMULATE_' + options.id) || [];
    if (exerises.length > 0) {
      let iIndex = 0
      for (var i = 0; i < exerises.length; i++) {
        if (!exerises[i].is_answered) {
          iIndex = i;
          break;
        }
      }
      that.setData({
        exerises: exerises
        , ecnt: exerises.length
        , index: iIndex
      })
    } else {
      Post.call(this, this, "LOAD")
    }
  },

})

function Post(that, action, data) {
  //数据请求执行方法
  var jsPost = data || new util.jsonRow()
  jsPost.AddCell("PAGE", that.data.PAGE)
  jsPost.AddCell("RSID", that.data.RSID)
  jsPost.AddCell("ACTION", action)
  util._post(app.globalData.url, jsPost, function (res) {
    if (res && res.data && res.data.data) {
      //更新数据
      if (jsPost.arrjson.ACTION == "LOAD") {
        let iIndex = that.data.index
        for (var i = 0; i < res.data.data.exerises.length; i++) {
          if (!res.data.data.exerises[i].is_answered) {
            iIndex = i;
            break;
          }
        }
        //格式化练习时间
        // let objSummaries = res.data.data.summaries
        // objSummaries[0].USE_SECOND = util.formatString(objSummaries[0].USE_SECOND)

        that.setData({
          exerises: that.data.exerises.concat(res.data.data.exerises)
          // , summaryValues: objSummaries
          , ecnt: res.data.data.ecnt
          , index: iIndex
        })
        wx.hideLoading()
      }
      else if (jsPost.arrjson.ACTION == "COMMENT") {
        //题目评论
        let cExes = that.data.exerises
        cExes[that.data.index].feeds = res.data.data.feeds
        that.setData({
          exerises: cExes
        })
      }
    }
    else if (jsPost.arrjson.ACTION == "ANSWERED" && that.data.auto_next) {
      //答题后，自动下一题的情况下处理
      var iIndex = that.data.index
      if (iIndex == that.data.exerises.length - 2) {
        var jsPost1 = new util.jsonRow()
        jsPost1.AddCell("BID", that.data.exerises[iIndex].bid)
        Post.call(this, that, "NEXT", jsPost1)
      }
      that.setData({
        index: ++iIndex
        , start_time: new Date()
      })
    }
    wx.setStorageSync('REAL_SIMULATE_' + that.data.RSID, that.data.exerises);//缓存
  })
}
