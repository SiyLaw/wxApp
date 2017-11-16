// pages/lawArticles/lawList.js
var util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PAGE: "LAWITEM",
    COLOR: ['#6699cc', '#778899', '#99cc66', '#5F9EA0', '#8FBC8F', '#BDB76B'],
    quickmenu: ["全部"],
    menu: [],//菜单内容
    date: 0
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var SysInfo = wx.getSystemInfoSync()
    //获取缓存数据
    util.Post(this, "LOAD", null, function (that, data) {
      if (data) {
        var quickmenu = that.data.quickmenu
        for (var i = 0; i < data.menu.length; i++) {
          if (quickmenu.indexOf(data.menu[i].txt) == -1) {
            quickmenu.push(data.menu[i].txt)
          }
        }
        that.setData({
          height: SysInfo.windowHeight,
          width: SysInfo.screenWidth,
          rpxrate: Math.floor(SysInfo.screenWidth / 750 * 100) / 100,
          //menu: data.menu,
          quickmenu: quickmenu
        })
      }
      else {
        // console.log('error')
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
    util.Post(this, "LOAD", null, function (that, data) {
      if (data) {
        var quickmenu = that.data.quickmenu
        for (var i = 0; i < data.menu.length; i++) {
          if (quickmenu.indexOf(data.menu[i].txt) == -1) {
            quickmenu.push(data.menu[i].txt)
          }
        }
        that.setData({
          menu: data.menu,
          quickmenu: quickmenu
        })
      }
      else {
        // console.log('error')
      }
      wx.hideNavigationBarLoading();
    })
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

  }
})