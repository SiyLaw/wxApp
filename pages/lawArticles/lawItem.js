// lawItem.js
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    height: 0,
    width: 0,
    rpxrate: 0.0, //rpx-px比率
    PAGE: "LAWITEM",
    second: 5,//录音秒
    finished: true,//是否完成录音
    searchval: "",//搜索内容
    menuhide: false,//是否折叠菜单
    menu: [],//菜单内容
    alllcts: [],//法典内容
    Index: -1,//当前法律原文序号ID
    seqbar: [],//包含侧边章内容ID,侧边节内容ID
    seqbartype: '0',//索搜条类型，按章、条
    scrollviewid: '',//滚动到指定法条ID
    scrolltop: 0,
    scurrentid: '',//当前法律ID
    termtitle: '',
    tid:''
  },
  //页面加载
  onLoad: function (options) {
    var SysInfo = wx.getSystemInfoSync()
    //获取缓存数据
    var lawItem = wx.getStorageSync('LAWITEMS') || [];
    Post.call(this, this, "LOAD", null, function (that, data) {
      that.setData({
        height: SysInfo.windowHeight,
        width: SysInfo.screenWidth,
        rpxrate: Math.floor(SysInfo.screenWidth / 750 * 100) / 100,
        alllcts: lawItem,
        menu: data.menu,
        scurrentid: options.id || '',
        tid: options.tid || '',
        termtitle: options.nme || ''
      })
      if (that.data.scurrentid != '') {
        ShowContent.call(that, that, that.data.scurrentid, that.data.termtitle,true)
      }
    });
  },
  onReachBottom: function (e) { },
  //展开或隐藏菜单
  menucontrol: function (e) {
    this.setData({
      menuhide: !this.data.menuhide
    })
  },
  refreshcurrentclass: function (e) {
    let sCid = this.data.scurrentid
    var jsPost = new util.jsonRow()
    jsPost.AddCell("CID", sCid)
    Post.call(this, this, "GETTERM", jsPost, function (that, cdata) {
      var sCid = cdata.clid
      let alllcts = that.data.alllcts
      let iIndex = that.data.Index
      var objResult = isExist(alllcts, sCid)
      if (objResult.exist) {
        alllcts[objResult.index] = cdata
        iIndex = objResult.index
      } else {
        alllcts.push(cdata)
        iIndex = alllcts.length - 1
      }
      let seqBar = getSeqBar(alllcts[iIndex].lcts)
      seqBar.barTscale = parseInt(Math.ceil(seqBar.seqTBar.length / 30))
      seqBar.barSscale = parseInt(Math.ceil(seqBar.seqSBar.length / 30))
      that.setData({
        alllcts: alllcts,
        Index: iIndex,
        seqbar: seqBar,
        scrolltop: 0,
        scrollviewid: ''
      })
      //存至缓存
      wx.setStorageSync('LAWITEMS', alllcts)
    })
  },
  //展开或折叠菜单的内容项
  subitemcontrol: function (e) {
    let iIndex = e.currentTarget.dataset.idx
    let menu = this.data.menu
    menu[iIndex].expand = !menu[iIndex].expand
    this.setData({
      menu: menu
    })
  },
  //显示法条内容
  showcontent: function (e) {
    let sCid = e.currentTarget.dataset.cid
    let sCnme = e.currentTarget.dataset.cnme
    ShowContent.call(this, this, sCid, sCnme,false)
  },
  //条跳转
  onTsearchbarmove: function (e) {
    this.setData({
      scrollviewid: e.currentTarget.dataset.trid
    })
  },
  //章跳转
  onSsearchbarmove: function (e) {
    this.setData({
      scrollviewid: e.currentTarget.dataset.chid
    })
  },
  changeBarType: function (e) {
    let seqbartype = this.data.seqbartype == '0' ? '1' : '0'
    this.setData({
      seqbartype: seqbartype
    })
  },
  //开始录音
  startRecord: function (e) {
    var that = this
    this.setData({
      second: 5,
      finished: false
    });
    timer(that)
    wx.startRecord({
      success: function (res) {
        var user = wx.getStorageSync('user')
        var tempFilePath = res.tempFilePath
        wx.uploadFile({
          url: app.globalData.uploadurl, //仅为示例，非真实的接口地址
          filePath: tempFilePath,
          name: 'file',
          formData: {
            'OPEN_ID': user.openid
            , 'F_UPLOAD': 'sss'
            , 's': '2'
          },
          success: function (res) {
            that.setData({
              searchval: res.data
            })
          }
        })
      },
      fail: function (res) {
        //录音失败
      }
    })
    setTimeout(function () {
      //结束录音  
      wx.stopRecord()
      that.setData({
        second: 0,
        finished: true
      })
    }, 5000)
  },
  //结束录音
  endRecord: function (e) {
    wx.stopRecord()
    this.setData({
      second: 0,
      finished: true
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this
    return {
      title: that.data.termtitle,
      desc: '',
      path: '/pages/lawArticles/lawItem?id=' + that.data.scurrentid + '&nme=' + that.data.termtitle + '&tid=' + that.data.scrollviewid
    }
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
//录音计时器
function timer(that) {
  if (that.data.second > 0 && !that.data.finished)
    var time = setTimeout(function () {
      that.setData({
        second: that.data.second - 1
      })
      timer(that)
    }, 1000)
}
//当前是否加载法条内容
function isExist(alllcts, sId) {
  let iIndex = 0
  let isExist = false;
  for (var i = 0; i < alllcts.length; i++) {
    if (sId == alllcts[i].clid) {
      isExist = true
      iIndex = i
      break;
    }
  }
  return { "exist": isExist, "index": iIndex };
}

//当前法律，转换侧边快速定位列表，stype：0，条；1，章
function getSeqBar(lcts) {
  let seqSBar = []
  let seqTBar = []
  let sno = 0
  let tno = 0
  for (var i = 0; i < lcts.length; i++) {
    if (sno != lcts[i].seqno) {
      let seqSItem = {}
      sno = lcts[i].seqno
      seqSItem.sno = lcts[i].seqno
      seqSItem.chid = lcts[i].chid
      seqSBar.push(seqSItem)
    }
    for (var j = 0; j < lcts[i].item.length; j++) {
      if (tno != lcts[i].item[j].seqno) {
        tno = lcts[i].item[j].seqno
        let seqItem = {}
        seqItem.tno = tno
        seqItem.trid = lcts[i].item[j].trid
        seqTBar.push(seqItem)
      }
    }
  }
  return { "seqSBar": seqSBar, "seqTBar": seqTBar }
}

function ShowContent(that, sCid, sCnme,isLinked) {
  wx.setNavigationBarTitle({
    title: sCnme,
  })
  var objResult = isExist(that.data.alllcts, sCid)
  if (objResult.exist) {
    let seqBar = getSeqBar(that.data.alllcts[objResult.index].lcts)
    seqBar.barTscale = parseInt(Math.ceil(seqBar.seqTBar.length / 30))
    seqBar.barSscale = parseInt(Math.ceil(seqBar.seqSBar.length / 30))
    that.setData({
      Index: objResult.index,
      termtitle: sCnme,
      seqbar: seqBar,
      menuhide: !that.data.menuhide,
      scrolltop: 0,
      scrollviewid: isLinked ? that.data.tid : '',
      scurrentid: sCid
    })
  } else {
    var jsPost = new util.jsonRow()
    jsPost.AddCell("CID", sCid)
    //jsPost.AddCell("CNME", sCnme)
    Post(that, "GETTERM", jsPost, function (that1, cdata) {
      var sCid = cdata.clid
      let alllcts = that1.data.alllcts
      let iIndex = that1.data.Index
      var objResult = isExist(alllcts, sCid)
      if (objResult.exist) {
        alllcts[objResult.index] = cdata
        iIndex = objResult.index
      } else {
        alllcts.push(cdata)
        iIndex = alllcts.length - 1
      }
      let seqBar = getSeqBar(alllcts[iIndex].lcts)
      seqBar.barTscale = parseInt(Math.ceil(seqBar.seqTBar.length / 30))
      seqBar.barSscale = parseInt(Math.ceil(seqBar.seqSBar.length / 30))
      that1.setData({
        alllcts: alllcts,
        Index: iIndex,
        termtitle: sCnme,//jsPost.arrjson.CNME,
        seqbar: seqBar,
        menuhide: !that1.data.menuhide,
        scrolltop: 0,
        scrollviewid: isLinked ? that.data.tid : '',
        scurrentid: sCid
      })
      //存至缓存
      wx.setStorageSync('LAWITEMS', alllcts)
    })
  }
}