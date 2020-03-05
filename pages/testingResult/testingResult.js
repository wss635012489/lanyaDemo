// pages/testingResult/testingResult.js
import { routerFillter } from '../../assets/js/router.js'
import { token, hr_branch} from '../../assets/js/public.js'
import { uploadDetectionData, getUserNewDetection} from '../../assets/js/api.js'
import { getBranchPersonalityCustom } from '../../assets/js/publicRequest.js'
routerFillter({

  /**
   * 页面的初始数据
   */
  data: {
    showPop:false,
    testingData:'',
    detectionType:'',
    inputVal:'',
    evaluationResult:'',
    evaluationResultNumber:1, // 1 正常  2 偏高  3 偏低
    suggestText:'',
    bloodSugarStandard: [
      [4.4, 6.1],//凌晨
      [3.89, 6.1],//空腹
      [6.7, 9.4],//早餐后
      [3.89, 6.1],//午餐前
      [6.7, 9.4],//午餐后
      [3.89, 6.1],//晚餐前
      [6.7, 9.4],//晚餐后
      [6.7, 8.0],//睡前
    ],
    measuringOptions: ['凌晨血糖', '空腹血糖', '早餐后血糖', '午餐前血糖', '午餐后血糖', '晚餐前血糖', '晚餐后血糖', '睡前血糖'],
    measuring_text:'',
    check_sens_num:0,
    curMeResult:'',
    lastEvaluationResultNumber:1,// 1 正常  2 偏高  3 偏低
    integral_name:'积分',
    showStandard:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data = JSON.parse(wx.getStorageSync('testingData'))
    console.log(data)
    if (data){
      if (data.testingType == 2){
        this.setData({
          testingData: data,
          detectionType: data.testingType,
          inputVal: data.inputValue,
          measuring_text: this.data.measuringOptions[parseInt(data.status)]
        })
      } else if (data.testingType == 12){
        this.setData({
          testingData: data,
          detectionType: data.testingType,
          inputVal: data.inputTgValue
        })
      }
    }else {
      wx.showToast({
        title: '没有录入测量数据',
        icon: 'none',
        duration: 2000
      })
    }
    this.getLastMeasure();
    getBranchPersonalityCustom(data => {
      this.setData({
        integral_name: data.integral_name ? data.integral_name : '积分'
      })
    })
  },
  back(){
    wx.navigateBack();
  },
  closePop(){
    this.setData({
      showPop:false
    })
  },
  myToFixed(number) {
    return Number(number).toFixed(1)
  },
  evaluation_result() {
    if (this.data.detectionType == 2) {
      if (this.data.inputVal < this.data.bloodSugarStandard[parseInt(this.data.testingData.status)][0]) {
        this.setData({
          evaluationResult: "血糖偏低",
          evaluationResultNumber:3,
          suggestText: '您的血糖偏低，如果同时伴有出汗、饥饿、心悸、紧张、焦虑、面色苍白、心率加快、四肢冰冷等，及时补充糖果、饼干等含糖食品以缓解不适症状并请及时就医'
        })
      } else if (this.data.inputVal > this.data.bloodSugarStandard[parseInt(this.data.testingData.status)][1]) {
        this.setData({
          evaluationResult: "血糖偏高",
          evaluationResultNumber:2,
          suggestText: '您的血糖偏高，如果同时伴有心跳快速、呼吸缓而深、厌食、虚弱无力、极度口渴、恶心、干呕、尿多等症状请及时就医'
        })
      } else {
        this.setData({
          evaluationResult: "血糖正常",
          evaluationResultNumber:1,
          suggestText: '您的血糖属于正常范围，请继续定期监测血糖，坚持少食多餐、过晚不食、少食精制米面和含糖食物，保持适量的运动，预防糖尿病并发症'
        })
      }
    } else if (this.data.detectionType == 12) {//判断以mmol/L且以甘油三酯单位判断的
      this.setData({
        showStandard: '该结果是以甘油三酯测量数据为判断依据'
      })
      if (this.data.testingData.inputTgValue <= 2.3) {//甘油三酯TG参考值: ≤2.3mmol / l(≤200mg / dl)
        this.setData({
          evaluationResult: "血脂正常",
          evaluationResultNumber: 1,
          suggestText: '您的甘油三酯含量正常！保持良好的饮食、生活、锻炼习惯；保持良好心态也很重要！'
        })
      }else {
        this.setData({
          evaluationResult: "血脂偏高",
          evaluationResultNumber: 2,
          suggestText: '您的甘油三酯含量偏高！1、低脂饮食：脂肪过多，会导致甘油三酯升高，黄油加工的烘焙食品、糕点、油炸食品等等，都应该尽量少吃或不吃。猪牛羊肉等红肉也要少吃，白肉如鸡肉、鱼肉可适量摄取。2、低糖饮食：过多的糖分摄入会在体内转化为甘油三酯，少吃甜食，用水果代替餐后甜点是个好办法。3、多吃富含膳食纤维的食物：各种蔬菜水果都是好选择，建议在主食中增加杂粮的比例，减少精米白面的摄入量，杂粮中也富含膳食纤维，且热量低，有利于体重的控制。4、戒烟限酒：烟草中的有害物质如焦油、尼古丁等，对血管壁有一定的损伤作用，也会影响甘油三酯的代谢。5、坚持运动锻炼：有效的锻炼能够有效的促进身体的脂质代谢，对降低甘油三酯很有效。上述的生活方式调整，甘油三酯仍然居高不下，请及时就医！'
        })
      } 
    } 
    this.post_result();
  },
  post_result(){
    var postData = {
      "token": token,
      "u_id": wx.getStorageSync('userId'), // 当前测量的用户id
      "detection_result": this.data.evaluationResult,// 检测结果
      "detection_type": this.data.detectionType, // 检测类型 //"血压", 1; "血糖", 2; "血氧", 3; "心率", 4; "心电", 5; "体温", 6; "体重", 7; "尿酸", 8; "肺功能", 9; "胆固醇", 10;"尿常规", 11;
      //"device_id":"", // 检测设备id 1.体温计、2.血压计、3.心电仪、4.拉雅(血糖、尿酸、胆固醇)、5.体重秤、6.呼吸家(肺功能)、7.血氧仪
      "detection_time": this.data.testingData.testingTime + ':00', // 检测时间yyyy-MM-dd HH:mm:ss
      "cj_id": wx.getStorageSync('cj_id'),//门店id
      "hr_branch": hr_branch
    }
    if (this.data.detectionType == 1) {
      Object.assign(postData, {
        "systolic_pressure": this.myToFixed(this.pressure), // 收缩压
        "diastolic_pressure": this.myToFixed(this.diastolic), // 舒张压
        "heart_rate": this.myToFixed(this.heartrate),// 心率
      });
    } else if (this.data.detectionType == 2) {
      Object.assign(postData, {
        "blood_sugar": this.myToFixed(this.data.inputVal), // 血糖
        "status": this.data.testingData.status, //时间类型 0.凌晨 1.空腹、2.早餐后、3.午餐前、4.午餐后、5.晚餐前、6.晚餐后、7.睡前
      });
    } else if (this.data.detectionType == 8) {
      Object.assign(postData, {
        "uric_acid": this.myToFixed(this.data.inputVal), // 尿酸
      });
    } else if (this.data.detectionType == 10) {
      Object.assign(postData, {
        "cholesterol": this.myToFixed(this.data.inputVal),// 胆固醇
      });
    } else if (this.data.detectionType == 3) {
      Object.assign(postData, {
        "oxygen": this.myToFixed(this.data.inputVal), // 血氧
      });
    } else if (this.data.detectionType == 4) {
      Object.assign(postData, {
        "heart_rate": this.myToFixed(this.data.inputVal),// 心率
      });
    } else if (this.data.detectionType == 7) {
      Object.assign(postData, {
        "weight": this.myToFixed(this.weight),// 体重
        "height": this.myToFixed(this.height),// 身高
      });
    } else if (this.data.detectionType == 12){//血脂
      Object.assign(postData, {
        tc: this.data.testingData.inputTcValue,
        hdl: this.data.testingData.inputHdlValue,
        ldl: this.data.testingData.inputLdlValue,
        tg: this.data.testingData.inputTgValue,
        detection_unit: this.data.testingData.unit
      });
    }
    //console.log(postData)
    uploadDetectionData(postData).then(res => {
      //console.log(res);
      if (res.data.code == 200) {
        var data = res.data.object;
        if (data.check_sens_flag){//部是否需要送逗
          if (data.check_sens_num_send) {//0没送 1 送了
            this.setData({
              showPop: true,
              check_sens_num: data.check_sens_num
            })
          }
        }
      }
    })
  },
  getLastMeasure(){
    var postData = {
      "u_id": wx.getStorageSync('userId'),
      "show_type": this.data.detectionType,
    }
    console.log(postData)
    getUserNewDetection(postData).then(res => {
       //console.log(res)
      this.evaluation_result();
      if (res.data.code == 200) {
        var arr = res.data.object;
        var data = ''
        for(var i in arr){
          if (arr[i].detection_type == postData.show_type){
            data = arr[i];
            break;
          }
        }
        if (data) {
          if (this.data.detectionType == 2){
            data.detection_time = this.getInTimeRetDate(data.detection_time)
            if (data.detection_result.indexOf('偏高') != -1) {
              this.setData({
                lastEvaluationResultNumber: 2
              })
            } else if (data.detection_result.indexOf('偏低') != -1) {
              this.setData({
                lastEvaluationResultNumber: 3
              })
            } else if (data.detection_result.indexOf('正常') != -1) {
              this.setData({
                lastEvaluationResultNumber: 1
              })
            }
            this.setData({
              curMeResult: data
            })
          } else {
            this.xz_testing_result(data)
          }
        }
      }
    })
  },
  xz_testing_result(data){
    // "tc": "",//总胆固醇TC参考值：2.85～5.69mmol/L(110～220mg/dl)
    // "hdl": "",//高密度脂蛋白胆固醇HDL参考值：1.04～1.55mmol/L(45～60mg/dl)
    // "ldl": "",//低密度脂蛋白胆固醇LDL参考值：≤3.10mmol/L(≤120mg/dl)
    // "tg": "",//甘油三酯TG参考值:≤2.3mmol/l(≤200mg/dl)
    //console.log(data)
    var arr = [];
    var tcObj = {
      val:data.tc,
      name:'总胆固醇(TC)',
    }
    if (data.tc < 2.85 || data.tc == 'LO' || data.tc == 'lo'){
      tcObj.result = '偏低'
    } else if (data.tc > 5.69 || data.tc == 'HI' || data.tc == 'hi'){
      tcObj.result = '偏高'
    }else {
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
    }else {
      if (data.ldl <= 3.1) {
        ldlObj.result = '正常'
      } else {
        ldlObj.result = '偏高'
      }
    } 
     arr.push(ldlObj)

    data.list = arr;
    this.setData({
      curMeResult: data
    })
    //console.log(this.data.curMeResult)
  },
  getInTimeRetDate(time) {
    var data = time.split(':')
    return data[0] + ':' + data[1]
  }
})