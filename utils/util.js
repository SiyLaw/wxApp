var app = getApp();
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
  if (months > 0) { strFormat += formatNumber(months) + "个月" }
  if (days > 0) { strFormat += formatNumber(days) + "天" }
  if (hours > 0) { strFormat += formatNumber(hours) + "小时" }
  if (minutes > 0) { strFormat += formatNumber(minutes) + "分" }
  if (seconds > 0) { strFormat += formatNumber(seconds) + "秒" }
  if (strFormat == "") { strFormat = "0秒" }
  return strFormat
}

function formatTimeString(n) {
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
  if (months > 0) { strFormat = months.toString() + "个月前" }
  else if (days > 0) { strFormat = days.toString() + "天前" }
  else if (hours > 0) { strFormat = hours.toString() + "小时前" }
  else if (minutes > 0) { strFormat = minutes.toString() + "分钟前" }
  else if (seconds > 0 || strFormat == "") { strFormat = "刚刚" }
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

function imageUtil(e) {
  var imageSize = {};
  var originalWidth = e.detail.width;//图片原始宽 
  var originalHeight = e.detail.height;//图片原始高 
  var originalScale = originalHeight / originalWidth;//图片高宽比 
  console.log('originalWidth: ' + originalWidth)
  console.log('originalHeight: ' + originalHeight)
  //获取屏幕宽高 
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = res.windowWidth;
      var windowHeight = res.windowHeight;
      var windowscale = windowHeight / windowWidth;//屏幕高宽比 
      console.log('windowWidth: ' + windowWidth)
      console.log('windowHeight: ' + windowHeight)
      if (originalScale < windowscale) {//图片高宽比小于屏幕高宽比 
        //图片缩放后的宽为屏幕宽 
        imageSize.imageWidth = windowWidth;
        imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
      } else {//图片高宽比大于屏幕高宽比 
        //图片缩放后的高为屏幕高 
        imageSize.imageHeight = windowHeight;
        imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
      }

    }
  })
  console.log('缩放后的宽: ' + imageSize.imageWidth)
  console.log('缩放后的高: ' + imageSize.imageHeight)
  return imageSize;
} 

//高亮转换
function HighlightTransform(data) {
  let newList = [];
  for (let i = 0; i < data.length; i++) {
    let texts = data[i].text.split(data[i].key);
    let t = '';
    for (let j = 0; j < texts.length; j++) {
      if (j < texts.length - 1) {
        t += texts[j] + '@' + data[i].key + '@';
      } else {
        t += texts[j]
      }
    }
    let arr = t.split('@');
    let list = [];
    for (let k = 0; k < arr.length; k++) {
      list.push({
        text: arr[k],
        isgl: (arr[k] == data[i].key)
      });
    }
    newList.push(list);
  }
  return newList;
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
  if (user == "") {
    app.getUserInfo(null, function (openData) {
      user = openData
    })
  }
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
          if (res.data.msg == "NO_USER") {
            wx.navigateTo({
              url: '/pages/profile/profile'
            })
          } else {
            wx.showToast({
              title: res.data.msg || "错误"
            })
          }
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


//服务器请求数据
function Post(that, action, data, doAfter) {
  //数据请求执行方法
  var jsPost = data || new jsonRow()
  jsPost.AddCell("PAGE", that.data.PAGE)
  jsPost.AddCell("ACTION", action)
  _post_json(app.globalData.url, jsPost, function (res) {
    if (res && res.data && res.data.data) {
      //回调
      typeof doAfter == "function" && doAfter(that, res.data.data)
    }
    else {
      // console.log('error')
    }
  })
}

module.exports = {
  formatTime: formatTime,
  formatTimeString: formatTimeString,
  formatString: formatString,
  currentWeekInfo: currentWeekInfo,
  imageUtil: imageUtil,
  _get: _get,
  _post: _post_json,
  Post: Post,
  jsonRow: jsonRow
}
