// lawItem.js// pages/profile/profile.js
var util = require('../../utils/util.js')

var app = getApp()
var menuanim = wx.createAnimation({
  duration: 600,
  timingFunction: 'ease'
})
function timer(that) {
  if (that.data.second > 0 && !that.data.finished)
    var time = setTimeout(function () {
      that.setData({
        second: that.data.second - 1
      })
      timer(that)
    }, 1000)
}
Page({
  data: {
    height: 0,
    width: 0,
    PAGE: "LAWITEM",
    second: 5,
    finished: true,
    searchval:"",
    menuanim: {},
    menuhide: false,
    menu: []
  },
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success(res) {
        that.setData({
          height: res.screenHeight,
          width: res.screenWidth
        })
      }
    })
    Post.call(this, this, "LOAD");
  },
  menucontrol: function (e) {
    var that = this
    if (that.data.menuhide) {
      menuanim.translateX(0).step()
    } else {
      menuanim.translateX(-that.data.width * 0.8 - 4).step()
    }
    this.setData({
      menuanim: menuanim.export(),
      menuhide: !that.data.menuhide
    })
  },
  subitemcontrol: function (e) {
    let iIndex = e.currentTarget.dataset.idx
    let menu = this.data.menu
    menu[iIndex].expand = !menu[iIndex].expand
    this.setData({
      menu: menu
    })
  },
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
  endRecord: function (e) {
    wx.stopRecord()
    this.setData({
      second: 0,
      finished: true
    });
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
        that.setData({
          menu: res.data.data.menu
        })
      }
    }
    else {
      // console.log('error')
    }
  })
}
