// lawItem.js// pages/profile/profile.js
var util = require('../../utils/util.js')

var app = getApp()
var menuanim = wx.createAnimation({
  duration: 600,
  timingFunction: 'ease'
})

Page({
  data: {
    height: 0,
    width: 0,
    rpxrate: 0.0,
    PAGE: "LAWITEM",
    second: 5,
    finished: true,
    searchval: "",
    menuanim: {},
    menuhide: false,
    menu: [],
    alllcts: [],
    Index: -1,
    seqbar: [],//索搜条显示
    barscale: 1,
    scrollviewid: '',
    x: 0,
    y: 0
  },
  //页面加载
  onLoad: function (options) {
    var that = this
    var height = 0;
    var width = 0;
    var SysInfo = wx.getSystemInfoSync()
    var lawItem = wx.getStorageSync('LAWITEMS') || [];
    that.setData({
      height: SysInfo.windowHeight,
      width: SysInfo.screenWidth,
      rpxrate: Math.floor(SysInfo.screenWidth / 750 * 100) / 100,
      alllcts: lawItem
    })
    Post.call(this, this, "LOAD");
  }, onReachBottom: function (e) { },
  //展开或隐藏菜单
  menucontrol: function (e) {
    setMenuStatus(this)
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
    var objResult = isExist(this, sCid)
    if (objResult.exist) {
      let seqBar = getSeqBar(this.data.alllcts[objResult.index].lcts)
      this.setData({
        Index: objResult.index,
        termtitle: sCnme,
        seqbar: seqBar,
        barscale: parseInt(Math.ceil(seqBar.length / 30))
      })
    } else {
      var jsPost = new util.jsonRow()
      jsPost.AddCell("CID", sCid)
      jsPost.AddCell("CNME", sCnme)
      Post.call(this, this, "GETTERM", jsPost)
    }
    setMenuStatus(this)
  },
  onsearchbarmove: function (e) {
    this.setData({
      scrollviewid: e.currentTarget.dataset.trid
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
  }
})
//服务器请求数据
function Post(that, action, data) {
  //数据请求执行方法
  var jsPost = data || new util.jsonRow()
  jsPost.AddCell("PAGE", that.data.PAGE)
  jsPost.AddCell("ACTION", action)
  util._post(app.globalData.url, jsPost, function (res) {
    if (res && res.data && res.data.data) {
      //更新数据
      if (jsPost.arrjson.ACTION == "LOAD") {
        that.setData({
          menu: res.data.data.menu
        })
      } else if (jsPost.arrjson.ACTION == "GETTERM") {
        var sCid = res.data.data.clid
        let alllcts = that.data.alllcts
        let iIndex = that.data.Index
        var objResult = isExist(that, sCid)
        if (objResult.exist) {
          alllcts[objResult.index] = res.data.data
          iIndex = objResult.index
        } else {
          alllcts.push(res.data.data)
          iIndex = alllcts.length - 1
        }
        let seqBar = getSeqBar(alllcts[iIndex].lcts)
        that.setData({
          alllcts: alllcts,
          Index: iIndex,
          termtitle: jsPost.arrjson.CNME,
          seqbar: seqBar,
          barscale: parseInt(Math.ceil(seqBar.length / 30))
        })
      }
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
function isExist(that, sId) {
  let alllcts = that.data.alllcts
  let iIndex = that.data.Index
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

//隐藏、显示菜单
function setMenuStatus(that) {
  if (that.data.menuhide) {
    menuanim.translateX(0).step()
  } else {
    menuanim.translateX(-that.data.width * 0.8 - 4).step()
  }
  that.setData({
    menuanim: menuanim.export(),
    menuhide: !that.data.menuhide
  })
}

function getSeqBar(lcts) {
  let seqBar = []
  for (var i = 0; i < lcts.length; i++) {
    for (var j = 0; j < lcts[i].item.length; j++) {
      let seqItem = {}
      seqItem.clid = lcts[i].chid
      seqItem.chno = lcts[i].chno
      seqItem.trid = lcts[i].item[j].trid
      seqItem.trno = lcts[i].item[j].trno
      seqBar.push(seqItem)
    }
  }
  return seqBar
}
