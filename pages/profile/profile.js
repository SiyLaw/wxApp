// pages/profile/profile.js
var util = require('../../utils/util.js')

var app = getApp()
Page({
  data: {
    userInfo: { avatarUrl: '/image/log60.png', nickName: '' },
    PAGE: "PROFILE",
    MODE: "VIEW",
    USER_CDE: "",
    USER_SEX: "",
    USER_SCORE: "",
    TEL: "",
    E_MAIL: "",
    HEAD_IMG: "",
    BTN_STATUS: true
  },
  checkUser: function (e) {
    console.log(e)
  },
  formSubmit: function (e) {
    var that = this
    that.setData({
      BTN_STATUS: true
    })
    var sMode = "VIEW"
    if (e.detail.target.id == "UPDATE" || e.detail.target.id == "ADD") {
      var jsPost = new util.jsonRow()
      jsPost.AddCell("USER_NME", this.data.userInfo.nickName)
      for (var m in e.detail.value) {
        jsPost.AddCell(m, e.detail.value[m])
      }
      util.Post(that,e.detail.target.id, jsPost, function (that,res,mod) {
        that.setData({
          MODE: mod,
          BTN_STATUS: false
        })
      })
    } else {
      sMode = "EDIT"
      that.setData({
        MODE: sMode,
        BTN_STATUS: false
      })
    }
  },
  onLoad: function (options) {
    var that = this

    //调用应用实例的方法获取全局数据
    app.getUserInfo(null,function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        HEAD_IMG: userInfo.avatarUrl
      })
    })

    util.Post(that,"VIEW", null, function (that,res) {
      if (res) {
        //更新数据
        that.setData({
          USER_CDE: res[0].USER_CDE,
          USER_SEX: res[0].USER_SEX,
          USER_SCORE: res[0].USER_SCORE,
          TEL: res[0].TEL,
          E_MAIL: res[0].E_MAIL,
          MODE: "VIEW",
          BTN_STATUS: false
        })
      }
      else {
        that.setData({
          MODE: "ADD",
          BTN_STATUS: false
        })
      }
    });
  }
})