var startDot = { x: 0, y: 0 };//触摸时的原点
var endDot = { x: 0, y: 0 };

// 触摸开始事件
function touchStart(e) {
  startDot.x = e.touches[0].pageX // 获取触摸时的原点
  startDot.y = e.touches[0].pageY // 获取触摸时的原点
  endDot.x = e.touches[0].pageX // 获取触摸时的原点
  endDot.y = e.touches[0].pageY // 获取触摸时的原点
}

function touchMove(e) {
  endDot.x = e.touches[0].pageX // 获取触摸时的原点
  endDot.y = e.touches[0].pageY // 获取触摸时的原点
}

// 触摸结束事件
function touchEnd(e, that, next) {
  var diffX = Math.abs(endDot.x - startDot.x)
  var diffY = Math.abs(endDot.y - startDot.y)
  if (diffX > 130 && diffY < 60) {
    if (endDot.x - startDot.x <= -100) {
      //向右滑动
      let iIndex = that.data.index
      if (iIndex == that.data.exerises.length - 2) {
        // wx.showToast({
        //     title: '加载中...',
        //     icon: 'loading',
        //     duration: 1000
        // })
        typeof next == "function" && next(that)
        iIndex += 1
        that.setData({
          index: iIndex,
          start_time: new Date()
        })
      } else {
        iIndex += 1
        that.setData({
          index: iIndex
        })
      }
    } else if (endDot.x - startDot.x >= 100) {
      //向左滑动
      let iIndex = that.data.index
      if (iIndex == 0) {
        wx.showToast({
          title: '已经是第一题',
          duration: 1000
        })
      } else {
        iIndex -= 1
        that.setData({
          index: iIndex
        })
      }
    }
  } else {
    if (endDot.y - startDot.y <= -100) {
      // 向下滑动
      wx.showNavigationBarLoading()
      setTimeout(function () {
        wx.hideNavigationBarLoading()
      }, 1000);
      let iIndex = that.data.index
      let sExe = that.data.exerises
      sExe[iIndex].show_item += 1
      that.setData({
        exerises: sExe
      })
    }
  }
}

//收藏题目
function collect(e, that, update) {
  let iIndex = that.data.index
  let sExe = that.data.exerises
  sExe[iIndex].is_coll = !sExe[iIndex].is_coll;
  typeof update == "function" && update(that, sExe[iIndex].qid)
  that.setData({
    exerises: sExe
  })
}


//评论
function comment(e, that, update) {
  let iIndex = that.data.index
  let sExe = that.data.exerises
  typeof update == "function" && update(that, sExe[iIndex].qid)
  that.setData({
    comm_text: '',
    comm_len: 0
  })
}

//点赞
function like(e, that, update) {
  let iIndex = that.data.index
  let sExe = that.data.exerises
  let iFeedIndex = e.currentTarget.dataset.idx
  if (sExe[iIndex].feeds[iFeedIndex].isAgreed) {
    sExe[iIndex].feeds[iFeedIndex].agree -= 1
  } else {
    sExe[iIndex].feeds[iFeedIndex].agree += 1
  }
  sExe[iIndex].feeds[iFeedIndex].isAgreed = !sExe[iIndex].feeds[iFeedIndex].isAgreed

  typeof update == "function" && update(that, sExe[iIndex].feeds[iFeedIndex].id)
  that.setData({
    exerises: sExe
  })
}

//多选提交答案
function submitMultiAnswer(e, that, update) {
  let iIndex = that.data.index
  let sExe = that.data.exerises
  if (!sExe[iIndex].is_answered) {
    let exAnswer = sExe[iIndex].answer
    let sVal = sExe[iIndex].u_answer
    // let iRight = that.data.right
    // let iError = that.data.error
    //未做答
    // if (!sExe[iIndex].is_answered) {
    //   if (sVal == exAnswer) {
    //     iRight += 1
    //   } else {
    //     iError += 1
    //   }
    // }
    sExe[iIndex].show_item = 1
    sExe[iIndex].is_answered = true
    that.setData({
      exerises: sExe
      // ,
      // right: iRight,
      // error: iError
    })
    typeof update == "function" && update(that, sExe[iIndex])
  }
}

//单选提交答案
function selectedOptions(e, that, update) {
  //当前答题时间
  var current_time = new Date()
  let start_time = that.data.start_time
  var mSec = current_time.getTime() - start_time.getTime()

  let iIndex = that.data.index
  let sExe = that.data.exerises
  let exType = sExe[iIndex].type
  let exAnswer = sExe[iIndex].answer
  let val = e.detail.value.toString().replace(new RegExp(/(,)/g), '')

  let sVal = ""
  let options = sExe[iIndex].options
  for (var i = 0; i < options.length; i++) {
    if (val.includes(options[i].op)) {
      sVal += options[i].op
      sExe[iIndex].options[i].check = true
    } else {
      sExe[iIndex].options[i].check = false
    }
  }
  sExe[iIndex].u_answer = sVal
  sExe[iIndex].u_second = Math.round(mSec / 1000)
  if (exType == "0" && !sExe[iIndex].is_answered) {
    // let iRight = that.data.right
    // let iError = that.data.error
    //未做答
    // if (!sExe[iIndex].is_answered) {
    //   if (sVal == exAnswer) {
    //     iRight += 1
    //   } else {
    //     iError += 1
    //   }
    // }
    sExe[iIndex].show_item = 1
    sExe[iIndex].is_answered = true
    that.setData({
      exerises: sExe
      // ,
      // right: iRight,
      // error: iError
    })
    //单项选择回调
    typeof update == "function" && update(that, sExe[iIndex])
  } else {
    that.setData({
      exerises: sExe
    })
  }
}

module.exports = {
  touchStart: touchStart,
  touchMove: touchMove,
  touchEnd: touchEnd,
  collect: collect,
  comment: comment,
  like: like,
  selectedOptions: selectedOptions,
  submitMultiAnswer: submitMultiAnswer
}
