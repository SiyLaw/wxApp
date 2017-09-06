// pages/tabbar/study/favorite/favorite.js
var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    PAGE: "CREATE_ORDER",
    total_fee: "0.00",
    PL: [{
      id: "id1",
      checked: false,
      body: "司煜宝-真题购买",
      attach: "在线支付",
      goods_tag: "2017年真题卷一",
      fee: 0.10
    }, {
      id: "id2",
      checked: false,
      body: "司煜宝-真题购买",
      attach: "在线支付",
      goods_tag: "2017年真题卷二",
      fee: 0.25
    }, {
      id: "id3",
      checked: false,
      body: "司煜宝-真题购买",
      attach: "在线支付",
      goods_tag: "2017年真题卷三",
      fee: 0.08
    }]
  },
  onLoad: function (options) {
  },
  onSelected: function (e) {
    var idx = e.currentTarget.dataset.idx
    this.data.PL[idx].checked = !this.data.PL[idx].checked;
    let total_fee = parseFloat(this.data.total_fee);
    if (this.data.PL[idx].checked) {
      total_fee = (total_fee + this.data.PL[idx].fee).toFixed(2);
    } else {
      total_fee = (total_fee - this.data.PL[idx].fee).toFixed(2);
    }
    this.setData({
      PL: this.data.PL,
      total_fee: total_fee
    });
  },
  onPurchase:function(e){
    let total_fee = parseFloat(this.data.total_fee);
    if (total_fee - 0.0 > 0){
      var jsPost = new util.jsonRow()
      jsPost.AddCell("TOTAL_FEE", total_fee)
      util.Post(this, "CREATE_ORDER", jsPost, function (that, data) {
        console.log(data)
        wx.requestPayment({
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign,
          success:function(res){
            console.log(res)
          },
          fail:function(res){
            console.log(res)
          },
          complete:function(res){
            console.log(res)
          }
        })
      });
    }else{
      wx.showToast({
        title: '请选择购买项',
        duration: 1000
      })
    }
  }
})

function Post(that, action, data) {
  //数据请求执行方法
  util.Post(that, action, data, function (that, res) {
    if (res) {
      //更新数据
      if (action == "LOAD") {
        let objbatches = res.batches
        for (var i = 0; i < objbatches.length; i++) {
          objbatches[i].EXAM_USER_DT = util.formatString(objbatches[i].EXAM_USER_DT)
        }
        that.setData({
          batches: objbatches
        })
        wx.hideLoading()
      }
    }
  })
}
