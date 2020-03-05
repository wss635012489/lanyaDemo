// pages/testingHistory/testingHistory.js
import { getInTimeRetDate, token} from '../../assets/js/public.js'
import { routerFillter} from '../../assets/js/router.js'
import { getUserDetectionData } from '../../assets/js/api.js'
routerFillter({
  /**
   * 页面的初始数据
   */
  data: {
    testingOption: [
      { text: '血糖测量', value: 1, testingTypeVal: 2, unit: "mmol/L" },
      { text: '血脂测量', value: 2, testingTypeVal: 12, unit: "mmol/L" },
    ],
    testingType: 1,
    testingTypeVal:2,
    unit:'mmol/L',
    list:[],
    loading:false,
    selectDate: new Date().getTime(),
    maxDate: new Date().getTime(),
    showPop:false,
    myDate: (getInTimeRetDate(new Date()).split('-'))[0] + '年' + parseInt((getInTimeRetDate(new Date()).split('-'))[1]) + '月',
    detection_time: getInTimeRetDate(new Date()),
    heightNumber: 0,
    normalNumber: 0,
    lowNumber: 0,
    totalNumber:0,
    measuringOptions: ['凌晨血糖', '空腹血糖', '早餐后血糖', '午餐前血糖', '午餐后血糖', '晚餐前血糖', '晚餐后血糖', '睡前血糖']
  },
  watch:{
    testingType(newVal){
      for (var i = 0;i <  this.data.testingOption.length; i++){
        if (this.data.testingOption[i].value == newVal){
          this.init(this.data.testingOption[i].testingTypeVal);
          this.setData({
            testingTypeVal: this.data.testingOption[i].testingTypeVal
          })
          break;
        }
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type){
      if (options.type == 1) {
        this.setData({
          testingType: parseInt(options.type),
          testingTypeVal: 2
        })
      } else {
        this.setData({
          testingType: parseInt(options.type),
          testingTypeVal: 12
        })
      }
    }
    getApp().setWatcher(this);
    this.init(this.data.testingTypeVal)
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

  },
  closePop(){
    this.setData({
      showPop:false
    })
  },
  onConfirm(event){
    var arr = (getInTimeRetDate(event.detail)).split('-');
    this.closePop();
    this.setData({
      myDate: arr[0] + '年' + parseInt(arr[1]) + '月',
      detection_time: getInTimeRetDate(event.detail)
    })
    this.init(this.data.testingTypeVal)
  },
  openPop(){
    this.setData({
      showPop: true
    })
  },
  menuChange(event){
    this.setData({
      testingType: event.detail
    })
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  init(type) {
    console.log(type)
    var postData = {
      "token": token,
      "u_id": wx.getStorageSync('userId'), // 当前测量的用户id
      "detection_type": type, // 检测类型 
      "detection_time": this.data.detection_time,
      //"血压", 1; "血糖", 2; "血氧", 3; "心率", 4; "心电", 5; "体温", 6; "体重", 7; "尿酸", 8; "肺功能", 9; "胆固醇", 10;"尿常规", 11;
      "show_type": 1, // 展示类型， 1列表，2图表
    };
    getUserDetectionData(postData).then(res => {
      //console.log(res)
      if (res.data.code == 200) {
        var arr = res.data.object;
        if (this.data.testingType == 1) {
          for (var i in arr) {
            arr[i].detection_time = this.getInTimeRetDate(arr[i].detection_time)
            arr[i].evaluationResultNumber = this.getColor(arr[i].detection_result)
          }
          this.setData({
            list: arr
          })
        }else {
          for(var i in arr){
            var item = this.xz_testing_result(arr[i]);
            arr[i].list = item;
          }
          this.setData({
            list: arr
          })
          console.log(this.data.list)
        }
        var lowNumber = 0;
        var normalNumber = 0;
        var heightNumber = 0;
        for (var i in arr) {
          if (arr[i].detection_result.indexOf('偏高') != -1 ) {
            heightNumber += 1;
          } else if (arr[i].detection_result.indexOf('偏低') == -1) {
            lowNumber += 1;
          } else if (arr[i].detection_result.indexOf('正常') != -1) {
            normalNumber += 1;
          }
        }
        this.setData({
          heightNumber,
          lowNumber,
          normalNumber,
          totalNumber: arr.length
        })
      }
    })
  },
  getInTimeRetDate(time) {
    var data = time.split(':')
    return data[0] + ':' + data[1]
  },
  getColor(str){
    console.log(str)
    if (str.indexOf('偏高') != -1){
      return 2
    } else if(str.indexOf('偏低') != -1){
      return 3
    } else if (str.indexOf('正常') != -1) {
      return 1
    }
  },
  xz_testing_result(data) {
    // "tc": "",//总胆固醇TC参考值：2.85～5.69mmol/L(110～220mg/dl)
    // "hdl": "",//高密度脂蛋白胆固醇HDL参考值：1.04～1.55mmol/L(45～60mg/dl)
    // "ldl": "",//低密度脂蛋白胆固醇LDL参考值：≤3.10mmol/L(≤120mg/dl)
    // "tg": "",//甘油三酯TG参考值:≤2.3mmol/l(≤200mg/dl)
    console.log(data)
    var arr = [];
    var arr = [];
    var tcObj = {
      val: data.tc,
      name: '总胆固醇(TC)',
    }
    if (data.tc < 2.85 || data.tc == 'LO' || data.tc == 'lo') {
      tcObj.result = '偏低'
    } else if (data.tc > 5.69 || data.tc == 'HI' || data.tc == 'hi') {
      tcObj.result = '偏高'
    } else {
      tcObj.result = '正常'
    }
    arr.push(tcObj)

    var tgObj = {
      val: data.tg,
      name: '甘油三酯(TG)',
    }
    if (data.tg <= 2.3) {
      tgObj.result = '正常'
    } else {
      tgObj.result = '偏高'
    }
    arr.push(tgObj)

    var hdlObj = {
      val: data.hdl,
      name: '高密度脂蛋白胆固醇(HDL)',
    }
    if (data.hdl < 1.04 || data.hdl == 'LO' || data.hdl == 'lo') {
      hdlObj.result = '偏低'
    } else if (data.hdl > 1.55 || data.hdl == 'HI' || data.hdl == 'hi') {
      hdlObj.result = '偏高'
    } else {
      hdlObj.result = '正常'
    }
    arr.push(hdlObj)

    var ldlObj = {
      val: data.ldl,
      name: '低密度脂蛋白胆固醇(LDL)',
    }
    if (data.ldl.indexOf('--') != -1) {
      ldlObj.result = '不正常'
    } else {
      if (data.ldl <= 3.1) {
        ldlObj.result = '正常'
      } else {
        ldlObj.result = '偏高'
      }
    }
    arr.push(ldlObj)
    return arr
  },
})