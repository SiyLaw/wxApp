function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatString(n) {
  var leave = n % (12 * 30 * 24 * 3600)
  var months = Math.floor(leave / (30 * 24 * 3600))
  // //计算出相差天数
  var leave0 = leave % (30 * 24 * 3600)
  var days = Math.floor(leave0 / (24 * 3600))
  // //计算出小时数
  var leave1 = leave0 % (24 * 3600)     //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600))
  // //计算相差分钟数
  var leave2 = leave1 % (3600)         //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60))
  // //计算相差秒数
  var leave3 = leave2 % (60)    //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3)
  var strFormat = ""
  if (months > 0) { strFormat += months.toString() + "个月" }
  if (days > 0) { strFormat += days.toString() + "天" }
  if (hours > 0) { strFormat += hours.toString() + "小时" }
  if (minutes > 0) { strFormat += minutes.toString() + "分" }
  if (seconds > 0) { strFormat += seconds.toString() + "秒" }
  return strFormat
}

function currentWeekInfo() {
  var now = new Date()
  var nowDayOfWeek = now.getDay() //今天本周的第几天
  var nowDay = now.getDate() //当前日
  var nowMonth = now.getMonth() //当前月
  var nowYear = now.getYear() //当前年
  var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)
  var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek))
  var sweek = formatNumber(weekStartDate.getMonth() + 1) + '月' + formatNumber(weekStartDate.getDate()) + '日'
  var eweek = formatNumber(weekEndDate.getMonth() + 1) + '月' + formatNumber(weekEndDate.getDate()) + '日'

  var num = Math.ceil((nowDay + 6 - nowDayOfWeek) / 7).toString();

  return [sweek + ' ～ ' + eweek, (nowMonth + 1).toString(), num]
}

/**
 * url 请求地址
 * success 成功的回调
 * fail 失败的回调
 */
function _get(url, success, fail) {

  console.log("------start---_get----");
  wx.request({
    url: url,
    header: {
      // 'Content-Type': 'application/json'
    },
    success: function (res) {
      success(res);
    },
    fail: function (res) {
      fail(res);
    }
  });

  console.log("----end-----_get----");
}

/**
* url 请求地址
* success 成功的回调
* fail 失败的回调
*/
function _post_json(url, jsPost, success, fail) {
  //console.log("----_post--start-------");
  // wx.showToast({
  //     title: "正在加载...",
  //     icon: "loading",
  //     duration: 5000
  // })
  wx.showNavigationBarLoading()
  var user = wx.getStorageSync('user')
  if (jsPost == null) jsPost = new jsonRow();
  jsPost.AddCell("OPEN_ID", user.openid)
  wx.request({
    url: url,
    header: {
      'content-type': 'application/json',
    },
    method: 'POST',
    data: jsPost.GetStr(),
    success: function (res) {
      //wx.hideToast()
      wx.hideNavigationBarLoading()
      if (res.data.msg == "err") {
        console.log(res.data.data);
      } else {
        if (res.data.msg != "") {
          wx.showToast({
            title: res.data.msg || "错误"
          })
        }
        success(res);
      }
    },
    fail: function (res) {
      console.log(res);
    }
  });
  //console.log("----end----_post-----");
}

function jsonRow() { this.arrjson = {}; }
jsonRow.prototype = {
  AddCell: function (sName, sValue) {
    if (!sName) return; this.arrjson[sName] = sValue;
  },
  GetStr: function () {
    var _strjson = "";
    for (var m in this.arrjson) {
      if (_strjson == "") { _strjson = "\"" + m + "\":\"" + this.arrjson[m] + "\""; } else { _strjson += ",\"" + m + "\":\"" + encodeURIComponent(this.arrjson[m]) + "\""; }
    }
    if (_strjson == "") return ""; else return "{" + _strjson + "}";
  }
};


function exerisesNext() {
  //return exerises_next.next;
  var next = {
    "id": 2,
    "data": [
      {
        "question_id": 9,
        "answer_id": 61,
        "feed_source_id": 25,
        "feed_source_name": "George",
        "feed_source_txt": "赞了回答9",
        "feed_source_img": "../../images/icon9.jpeg",
        "question": "气象铁塔的辐射大吗？",
        "answer_ctnt": "我不知道那个铁塔的情况，不过气象铁塔上会有一些测太阳辐射的设备，如果说辐射的话，太阳辐射那么多，大家赶紧躲进地底下呀~~~~~要不然辐射量这么大，会变异的呀~~~~",
        "good_num": "112",
        "comment_num": "18"
      }]
  }
  return next
}

/**
  * 旋转刷新图标
  */
function updateRefreshIcon() {
  var deg = 0;
  console.log('旋转开始了.....')
  var animation = wx.createAnimation({
    duration: 1000
  });

  var timer = setInterval(() => {
    if (!this.data.loading)
      clearInterval(timer);
    animation.rotateZ(deg).step();//在Z轴旋转一个deg角度
    deg += 360;
    this.setData({
      refreshAnimation: animation.export()
    })
  }, 2000);
}

module.exports = {
  formatTime: formatTime,
  formatString: formatString,
  currentWeekInfo: currentWeekInfo,
  _get: _get,
  _post: _post_json,
  jsonRow: jsonRow,
  exerisesNext: exerisesNext
}
