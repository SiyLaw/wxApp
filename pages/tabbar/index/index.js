//index.js
//获取应用实例
var app = getApp();
var wxCharts = require('../../../common/wxcharts.js');

Page({
  data: {
    background: [{
      id: "item-1",
      text: "item-1"
    }, {
      id: "item-2",
      text: "item-2"
    }, {
      id: "item-3",
      text: "item-3"
    }],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
    headinfo: {}
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var vwith = 0;
    //调用应用实例的方法获取全局数据
    var that = this
    app.getUserInfo(function (userInfo) {
      //更新数据
      if (userInfo) {
        that.setData({
          headinfo: {
            score: 88,
            avatarUrl: userInfo.avatarUrl,
            nickName: userInfo.nickName,
            province: userInfo.province,
            city: userInfo.city
          }
        })
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        vwith = res.windowWidth;
      }
    });
    new wxCharts({
      canvasId: 'areaCanvas',
      type: 'area',
      categories: ['2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016'],
      series: [{
        name: '参考人数',
        data: [35.3, 32.6, 34.7, 33.2, 33.5, 35.3, 37.5, 43.8],
        format: function (val) {
          return val + '';
        }
      }, {
        name: '通过人数',
        data: [9.02, 8.58, 6.64, 4.8, 4.796, 4.994, 4.88, 6],
        format: function (val) {
          if (val == 6) {
            return '6 ?';
          } else {
            return val;
          }
        }
      }],
      yAxis: {
        format: function (val) {
          return val + '万';
        }
      },
      width: vwith,
      height: 210
    });
  }
});

