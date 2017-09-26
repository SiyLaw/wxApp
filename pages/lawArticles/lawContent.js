// pages/lawArticles/lawContent.js
var util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    width: 0,
    rpxrate: 0.0, //rpx-px比率
    PAGE: "LAWITEM",
    alllcts: [],//法典内容
    Index: -1,//当前法律原文序号ID
    seqbar: [],//包含侧边章内容ID,侧边节内容ID
    seqbartype: '0',//索搜条类型，按章、条
    scrollviewid: '',//滚动到指定法条ID
    scrolltop: 0,
    scurrentid: '',//当前法律ID
    termtitle: '',
    tid: '',
    color: '#ddd'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var SysInfo = wx.getSystemInfoSync()
    //获取缓存数据
    var lawItem = wx.getStorageSync('LAWITEMS') || [];
    this.setData({
      height: SysInfo.windowHeight,
      width: SysInfo.screenWidth,
      rpxrate: Math.floor(SysInfo.screenWidth / 750 * 100) / 100,
      alllcts: lawItem,
      scurrentid: options.id || '',
      tid: options.tid || '',
      termtitle: options.nme || ''
    })
    if (this.data.scurrentid != '') {
      ShowContent(this, this.data.scurrentid, this.data.termtitle, true)
    }
  },
  refreshcurrentclass: function (e) {
    let sCid = this.data.scurrentid
    var jsPost = new util.jsonRow()
    jsPost.AddCell("CID", sCid)
    util.Post(this, "GETTERM", jsPost, function (that, cdata) {
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
  //显示法条内容
  showcontent: function (e) {
    let sCid = e.currentTarget.dataset.cid
    let sCnme = e.currentTarget.dataset.cnme
    ShowContent.call(this, this, sCid, sCnme, false)
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
      scrollviewid: e.currentTarget.dataset.chidchid
    })
  },
  //设置当节前内容
  onTermTap: function (e) {
    this.data.scrollviewid = e.currentTarget.id
  },
  changeBarType: function (e) {
    let seqbartype = this.data.seqbartype == '0' ? '1' : '0'
    this.setData({
      seqbartype: seqbartype
    })
  },
  showlawitemAction: function (e) {
    var that = this
    wx.showActionSheet({
      itemList: ['创建互动', '复制法条', '纠错法条', '修订记录'],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '/pages/InterAct/InterAct_add?t=term&id=' + e.currentTarget.id
          })
        } else if (res.tapIndex == 1) {
          var objTxt = that.data.alllcts[that.data.Index].lcts[e.currentTarget.dataset.childno].item[e.currentTarget.dataset.termno]
          wx.setClipboardData({
            data: that.data.termtitle + ' ' + objTxt.trno + objTxt.txt,
            success: function (res) {
              wx.showToast({
                title: '复制成功',
              })
            }
          })
        } else if (res.tapIndex == 2) {
          wx.navigateTo({
            url: '/pages/lawArticles/lawmakeright?t=term&id=' + e.currentTarget.id
          })
        } else if (res.tapIndex == 3) {
          wx.navigateTo({
            url: '/pages/lawArticles/lawTermHistory?t=term&id=' + e.currentTarget.id
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
    var that = this
    return {
      title: that.data.termtitle,
      desc: '',
      path: '/pages/lawArticles/lawContent?id=' + that.data.scurrentid + '&nme=' + that.data.termtitle + '&tid=' + that.data.scrollviewid
    }
  }
})


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

function ShowContent(that, sCid, sCnme, isLinked) {
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
    util.Post(that, "GETTERM", jsPost, function (that1, cdata) {
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