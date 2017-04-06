// pages/profile/profile.js
var util = require('../../utils/util.js')

var app = getApp()
Page({
  data: {
    userInfo: {},
    PAGE: "PROFILE",
    MODE: "VIEW",
    USER_CDE: "",
    USER_SEX: "",
    USER_SCORE: "",
    TEL: "",
    E_MAIL: "",
    BTN_STATUS: true
  },
  bindKeyInput: function (e) {
    if (e.target.id == "USER_CDE") {
      this.setData({
        USER_CDE: e.detail.value
      })
    } else if (e.target.id == "USER_SEX") {
      this.setData({
        USER_SEX: e.detail.value
      })
    }
    else if (e.target.id == "TEL") {
      this.setData({
        TEL: e.detail.value
      })
    }
    else if (e.target.id == "E_MAIL") {
      this.setData({
        E_MAIL: e.detail.value
      })
    }
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
      jsPost.AddCell("PAGE", this.data.PAGE)
      jsPost.AddCell("ACTION", e.detail.target.id)
      jsPost.AddCell("USER_NME", this.data.userInfo.nickName)
      for (var m in e.detail.value) {
        jsPost.AddCell(m, e.detail.value[m])
      }
      util._post(app.globalData.url, jsPost, function (res) {
        that.setData({
          MODE: res.data.mod,
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
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })

    var jsPost = new util.jsonRow()
    jsPost.AddCell("PAGE", that.data.PAGE)
    jsPost.AddCell("ACTION", "VIEW")
    util._post(app.globalData.url, jsPost, function (res) {
      if (res.data.data[0]) {
        //更新数据
        that.setData({
          USER_CDE: res.data.data[0].USER_CDE,
          USER_SEX: res.data.data[0].USER_SEX,
          USER_SCORE: res.data.data[0].USER_SCORE,
          TEL: res.data.data[0].TEL,
          E_MAIL: res.data.data[0].E_MAIL,
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