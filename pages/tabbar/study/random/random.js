// pages/tabbar/study/random/random.js
var util = require('../../../../utils/util.js')
var sUtil = require('../sutil.js')
var app = getApp()
Page({
  data: {
    userInfo: {},
    week: ["", "", ""],
    summaryValues: [],
    summaryItems: [{
      txt: "练习量",
      color: "#cd853f",
      val: "BATCH_COUNT",
      img: "/image/exam.png"
    }, {
      txt: "覆盖率",
      color: "#008B8B",
      val: "RATE",
      img: "/image/crate.png"
    }, {
      txt: "总用时",
      color: "#3CB371",
      val: "USE_SECOND",
      img: "/image/time.png"
    }],
    PAGE: "RANDOM",
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
    show_comment_module: false,
    show_start_module: true
  },
  setautonext: function (e) {
    var that = this
    that.setData({
      auto_next: !that.data.auto_next
    })
  },
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
  touchStart: function (e) {
    sUtil.touchStart(e)
  },
  touchMove: function (e) {
    sUtil.touchMove(e)
  },
  touchEnd: function (e) {
    sUtil.touchEnd(e, this, function (that, objExamItem) {
      var jsPost = new util.jsonRow()
      jsPost.AddCell("BID", objExamItem.bid)
      Post.call(this, that, "NEXT", jsPost)
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
  doLike: function (e) {
    //评论点赞
    sUtil.like(e, this, function (that, sId) {
      var jsPost = new util.jsonRow()
      jsPost.AddCell("DID", sId)
      Post.call(this, that, "LIKE", jsPost)
    })
  },
  doColl: function (e) {
    //收藏
    sUtil.collect(e, this, function (that, sId) {
      var jsPost = new util.jsonRow()
      jsPost.AddCell("QID", sId)
      Post.call(this, that, "COLL", jsPost)
    })
  },
  InputComm: function (e) {
    //输入评论时执行，显示长度
    this.setData({
      comm_text: e.detail.value,
      comm_len: e.detail.value.length
    })
  },
  doComments: function (e) {
    //显示评论窗口
    this.setData({
      r_id: '',
      show_comment_module: true
    })
  },
  startTran: function (e) {
    //开始练习
    this.setData({
      show_start_module: false,
      start_time: new Date()
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
  onLoad: function (options) {
    //加载时执行
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
        , week: util.currentWeekInfo()
      })
    })
    Post.call(this, this, "LOAD")
  }
})

function Post(that, action, data) {
  //数据请求执行方法
  var jsPost = data || new util.jsonRow()
  jsPost.AddCell("PAGE", that.data.PAGE)
  jsPost.AddCell("ACTION", action)
  util._post(app.globalData.url, jsPost, function (res) {
    if (res && res.data && res.data.data) {
      //更新数据
      if (jsPost.arrjson.ACTION == "LOAD") {
        let iIndex = that.data.index
        if (res.data.data.exerises.length > 5) {
          iIndex = 2
        }
        //格式化练习时间
        let objSummaries = res.data.data.summaries
        objSummaries[0].USE_SECOND = util.formatString(objSummaries[0].USE_SECOND)

        that.setData({
          exerises: that.data.exerises.concat(res.data.data.exerises)
          , summaryValues: objSummaries
          , ecnt: res.data.data.ecnt
          , index: iIndex
        })
      }
      else if (jsPost.arrjson.ACTION == "NEXT") {
        that.setData({
          exerises: that.data.exerises.concat(res.data.data.exerises)
        })
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
    else {
      // console.log('error')
    }
  })
}
