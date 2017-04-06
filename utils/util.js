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
    console.log("----_post--start-------");
    wx.showToast({
        title: "正在加载...",
        icon: "loading",
        duration: 5000
    })
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
            wx.hideToast()
            if (res.data.msg == "err") {
                console.log(res.data.data);
            } else {
                wx.showToast({
                    title: res.data.msg || "错误"
                })
                success(res);
            }
        },
        fail: function (res) {
            console.log(res);
        }
    });

    console.log("----end----_post-----");
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
    _get: _get,
    _post: _post_json,
    jsonRow: jsonRow,
    exerisesNext: exerisesNext
}
