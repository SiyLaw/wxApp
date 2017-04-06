// pages/tabbar/study/random/random.js
var util = require('../../../../utils/util.js')
var sUtil = require('../sutil.js')
var app = getApp()
Page({
  data: {
    userInfo: {},
    PAGE: "RANDOM",
    exerises: [{
      ID: 'ID_TITLE1'
      , type: 'single'
      , title: '下列有关公民权利能力的表述，有哪一项是错误的？'
      , option: [{ op: 'A', text: '权利能力是公民构成法律关系主体的一种资格' }
        , { op: 'B', text: '所有公民的权利能力都是相同的' }
        , { op: 'C', text: '公民具有权利能力，并不必然具有行为能力' }
        , { op: 'D', text: '权利能力也包括公民承担义务的能力或资格' }]
      //题目答案
      , answer: 'B'
      //用户选择
      , u_answer: ''
      , isAnswered: false
      //标签、关键字
      , tag: [{ op: '2016真题' }, { op: '卷一内容' }, { op: '宪法' }]
      //当前显示项
      , showItem: 0
      //解析
      , analTxt: '首先要明确什么是公民。我国《宪法》第33条第一款对公民的内涵作了明确的规定：“凡具有中华人民共和国国籍的人都是中华人民共和国的公民。”这就是说，在我国，公民资格是与国籍分不开的。 由于我国罪犯受到刑罚制裁并不导致其丧失我国国籍的法律后果，因此他们仍然具有我国的国籍，是我国的公民。 其次又应当看到，罪犯作为公民，依法享有公民的权利，但由于他们受到刑罚制裁，其权利状况因此发生明显改变，即罪犯不能享有法律规定的全部公民权利，因为任何一种刑罚方法都是对犯罪人某种权利的剥夺或限制，因此其法律地位又区别于其他公民。而他们的某些未被剥夺或限制的权利因无法以自己的行为实现而在实际上处于中止的状态，比如罪犯不可能行使受全日制高等教育权、正常夫妻生活权、对未成年子女抚养权，不可能进行经商、炒股、旅游等活动，而未被剥夺政治权利的罪犯也不可能实施集会、结社、游行、示威等行为。'
      //评论
      , feeds: [{ id: '1', user: 'Lucy', head_img: '/image/Female50.png', feed_txt: '不小心选错了... ', isAgreed: false, agree: 2, comments: 4, time: '1天前' },
      { id: '2', user: 'Jack', head_img: '/image/Male50.png', feed_txt: '不小心选错了... ', isAgreed: true, agree: 2, comments: 4, time: '2个星期前' },
      { id: '3', user: 'Jim', head_img: '/image/Male50.png', feed_txt: '不小心选错了... ', isAgreed: false, agree: 2, comments: 4, time: '1个月前' }]
      //是否收藏
      , is_coll: false
    }, {
      ID: 'ID_TITLE2'
      , type: 'multi'
      , title: '学者们认为，法律不是万能的，其作用是有限的，其理由在于：①法律重视程序，不讲效率；②法律调整外在行为，不干预人的思想观念；③法律强调稳定性，避免灵活性；④法律反映客观规律，不体现人的意志。下列哪些选项是正确的？'
      , option: [{ op: 'A', text: '④③①' }
        , { op: 'B', text: '①④②' }
        , { op: 'C', text: '②' }
        , { op: 'D', text: '③' }]
      , answer: 'CD'
      , u_answer: ''
      , tag: [{ op: '2015真题' }, { op: '卷一内容' }]
      , showItem: 0
      , analTxt: '。'
      , feeds: [{ id: '1', user: 'Lucy', head_img: '/image/Female50.png', feed_txt: '........ ', isAgreed: true, agree: 2, comments: 4, time: '1天前' },
      { id: '2', user: 'Jack', head_img: '/image/Male50.png', feed_txt: '....... ', isAgreed: false, agree: 2, comments: 4, time: '2个星期前' },
      { id: '3', user: 'Jim', head_img: '/image/Male50.png', feed_txt: '....... ', isAgreed: false, agree: 2, comments: 4, time: '1个月前' }]
      , is_coll: true
    }, {
      ID: 'ID_TITLE3'
      , type: 'multi'
      , title: '我国市辖区的人大常委会是由本级人民代表大会在代表中选举出的哪些人组成？'
      , option: [{ op: 'A', text: '主任' }
        , { op: 'B', text: '副主任若干人' }
        , { op: 'C', text: '秘书长' }
        , { op: 'D', text: '委员若干人' }]
      , answer: 'ABD'
      , u_answer: ''
      , tag: [{ op: '2013真题' }, { op: '卷一内容' }]
      , showItem: 0
      , analTxt: '。.......sdfsadf.......'
      , feeds: [{ id: '1', user: 'Lucy', head_img: '/image/Female50.png', feed_txt: '.哈哈....... ', isAgreed: true, agree: 2, comments: 4, time: '1天前' },
      { id: '2', user: 'Jack', head_img: '/image/Male50.png', feed_txt: '....哈哈... ', isAgreed: false, agree: 2, comments: 4, time: '2个星期前' },
      { id: '3', user: 'Jim', head_img: '/image/Male50.png', feed_txt: '..哈哈..... ', isAgreed: true, agree: 2, comments: 4, time: '1个月前' }]
      , is_coll: false
    }, {
      ID: 'ID_TITLE4'
      , type: 'multi'
      , title: '我国市辖区的人大常委会是由本级人民代表大会在代表中选举出的哪些人组成2？'
      , option: [{ op: 'A', text: '主任' }
        , { op: 'B', text: '副主任若干人' }
        , { op: 'C', text: '秘书长' }
        , { op: 'D', text: '委员若干人2' }]
      , answer: 'ABD'
      , u_answer: ''
      , tag: [{ op: '2013真题' }, { op: '卷一内容' }]
      , showItem: 0
      , analTxt: '。..............'
      , feeds: [{ id: '1', user: 'Lucy', head_img: '/image/Female50.png', feed_txt: '.哈哈....... ', isAgreed: true, agree: 2, comments: 4, time: '1天前' },
      { id: '2', user: 'Jack', head_img: '/image/Male50.png', feed_txt: '....哈哈... ', isAgreed: false, agree: 2, comments: 4, time: '2个星期前' },
      { id: '3', user: 'Jim', head_img: '/image/Male50.png', feed_txt: '..哈哈..... ', isAgreed: true, agree: 2, comments: 4, time: '1个月前' }]
      , is_coll: false
    }],
    index: 0,
    right: 0,
    error: 0,
    comm_text: '',
    comm_len: 0,
    showModalStatus: false
  },
  selected: function (e) {
    sUtil.selectedOptions(e, this)
  },
  submitMultiVal: function (e) {
    sUtil.submitMultiAnswer(e, this)
  },
  touchStart: function (e) {
    sUtil.touchStart(e);
  },
  touchMove: function (e) {
    sUtil.touchMove(e);
  },
  touchEnd: function (e) {
    sUtil.touchEnd(e, this)
  },
  doLike: function (e) {
    sUtil.like(e, this)
  },
  doColl: function (e) {
    sUtil.collect(e, this)
  },
  InputComm: function (e) {
    this.setData({
      comm_text: e.detail.value,
      comm_len: e.detail.value.length
    })
  },
  doComments: function (e) {
    this.showModal()
  },
  SubmitComm: function (e) {
    this.hideModal()
  },
  CloseComm: function (e) {
    this.hideModal()
  },
  onLoad: function (options) {
  },
  showModal: function () {
    // 显示遮罩层
    this.setData({
      showModalStatus: true
    })
  },
  hideModal: function () {
    // 隐藏遮罩层
    this.setData({
      showModalStatus: false
    })
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
    util._post(app.globalData.url, jsPost, function (res) {
      if (res && res.data && res.data.data[0]) {
        //更新数据
        // that.setData({
        // })
        console.log(res.data.data[0])
      }
      else {
        console.log('error')
        // that.setData({
        //   MODE: "ADD",
        //   BTN_STATUS: false
        // })
      }
    })
  }
})
