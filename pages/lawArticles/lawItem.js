// lawItem.js// pages/profile/profile.js
var util = require('../../utils/util.js')

var app = getApp()
var menuanim = wx.createAnimation({
  duration: 600,
  timingFunction: 'ease'
})

Page({
  data: {
    userInfo: {},
    height: 0,
    width: 0,
    HEAD_IMG: '',
    PAGE: "LAWITEM",
    menuanim: {},
    menuhide: false,
    menu: [{
      txt: "民法",
      id: "001",
      expand: true,
      item: [{ id: "1-1", txt: "中华人民共和国民法总则和国民法总则和国民法总则" }, { id: "1-2", txt: "中华人民共和国物权法" }, { id: "1-3", txt: "中华人民共和国合同法" }
        , { id: "1-4", txt: "中华人民共和国担保法" }, { id: "1-5", txt: "中华人民共和国商标法" }
        , { id: "1-6", txt: "中华人民共和国专利法" }, { id: "1-7", txt: "中华人民共和国著作权法" }
        , { id: "1-8", txt: "中华人民共和国婚姻法" }, { id: "1-9", txt: "中华人民共和国继承法" }
        , { id: "1-10", txt: "中华人民共和国收养法" }]
    }, {
      txt: "行政法",
      id: "003"
    }, {
      txt: "行政法",
      id: "003"
    }, {
      txt: "行政法",
      id: "003"
    }, {
      txt: "刑法",
      id: "002",
      item: [{
        id: "2-1",
        txt: "中华人民共和国刑法"
      }, {
        id: "2-2",
        txt: "中华人民共和国刑事诉讼法"
      }, {
        id: "2-2",
        txt: "中华人民共和国刑事诉讼法"
      }, {
        id: "2-2",
        txt: "中华人民共和国刑事诉讼法"
      }, {
        id: "2-2",
        txt: "中华人民共和国刑事诉讼法"
      }, {
        id: "2-2",
        txt: "中华人民共和国刑事诉讼法"
      }]
    }, {
      txt: "行政法",
      id: "003",
      item: [{
        id: "3-1",
        txt: "中华人民共和国行政许可法"
      }, {
        id: "3-2",
        txt: "中华人民共和国行政复议法"
      }, {
        id: "3-2",
        txt: "中华人民共和国行政诉讼法"
      }]
    }]
  },
  onLoad: function (options) {
    var that = this

    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        HEAD_IMG: userInfo.avatarUrl
      })
    })
    wx.getSystemInfo({
      success(res) {
        that.setData({
          height: res.screenHeight,
          width: res.screenWidth
        })
      }
    })
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
      }
    }
    else {
      // console.log('error')
    }
  })
}
