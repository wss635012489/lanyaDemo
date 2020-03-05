// pages/healthyTesting/healthyTesting.js
import { routerFillter } from '../../../assets/js/router.js'
import Toast from '@vant/weapp/toast/toast';
import { getDateInDateAndtimes, token, hr_branch, getCurTime, isLogoin,isLogoin_02} from '../../../assets/js/public.js'
import { getUserNewDetection, getBodyVideoByType} from '../../../assets/js/api.js'
routerFillter({
  /**
   * 页面的初始数据
   */
  data: {
    queryType:'xt',
    //"血压", 1; "血糖", 2; "血氧", 3; "心率", 4; "心电", 5; "体温", 6; "体重", 7; "尿酸", 8; "肺功能", 9; "胆固醇", 10;"尿常规", 11;血脂 12
    testingOption: [
      { text: '血糖测量', value: 1 ,testingTypeVal:2,unit:"mmol/L" },
      { text: '血脂测量', value: 2, testingTypeVal: 12, unit: "" },
    ],
    testingType: 1,//这个值和testingOption对应
    testingTypeVal: 2,//这个值和testingOption对应
    unit:'mmol/L',
    dialogVisible:false,
    dialogTitleArr:['血糖测量','血脂测量'],
    showPop:false,
    selectDate: new Date().getTime(),
    timerTxt: getDateInDateAndtimes(new Date(),true),
    //0.凌晨 1.空腹 2.早餐后 3.午餐前 4.午餐后 5.晚餐前 6.晚餐后 7.睡前
    measuringOptions: ['凌晨血糖', '空腹血糖', '早餐后血糖', '午餐前血糖','午餐后血糖', '晚餐前血糖', '晚餐后血糖', '睡前血糖'],
    popType:'status',
    statusTxt:'选择测量状态',
    status:'',
    curMeResult:'',
    videoUrl:'',
    myVideo:'',
    evaluationResultNumber: 1, // 1 正常  2 偏高  3 偏低
    show_lanya_btn:false,
    lanya_tip:'',
    //血糖或者其他单项输入框的值
    inputValue: '',
    //血脂输入框的值
    inputTgValue:'',
    inputTcValue:'',
    inputLdlValue: '',
    inputHdlValue: '',
    //蓝牙的数据设置
    lan_btn_text:'连接蓝牙',
    //deviceName: 'BLE SPP',//血脂
    deviceName: 'BBK_BLOOD',//血糖
    deviceId: '',
    services: '',
    serviceId:'',
    notifyCharacteristicsId: '',//特征值
    connectedDeviceId: '',
    disabled_lanya:false,
    characteristicsId:'',//写入特征值
    xz_timer:'',
    xz_finsed:false,
    balanceData:'',
    isfirstDevLink: 1  //发起重新连接，不超过2次
  },
  watch:{
    dialogVisible(newVal){
      if(newVal){
        if (this.data.show_lanya_btn){
          this.init_lanya();
        }
      }else {
        if (this.data.show_lanya_btn) {
          this.closeConnect();
          setTimeout(() => {
            this.setData({
              show_lanya_btn: false
            })
          },1000)
        }
        setTimeout(() =>{
          this.restData();
        },500)
      }
    },
    lan_btn_text(newVal){
      if (newVal != '连接蓝牙'){
        this.setData({
          disabled_lanya: true
        })
      }else {
        this.setData({
          disabled_lanya: false
        })
      }
    },
    xz_finsed(newVal) {
      if (newVal) {
        if (this.data.balanceData){
          var dataarr = this.data.balanceData.split('-')
          var arr = [];
          for (var i in dataarr) {
            if (dataarr[i] != '-' && dataarr[i] != 'undefined' && dataarr[i]) {
              arr.push(dataarr[i])
            }
          } 
          console.log(arr)
          for(var i in arr){
            this.xz_transformation_val(arr[i])
          }
          Toast.success({
            message: '测量成功',
            duration: 3000
          });
          setTimeout(() => {
            this.writeSendLanya('020a32306e03')
          }, 500)
        }else {
          console.log('没有血脂数据')
        }
      }
    },
    testingType(newVal){
      this.setData({
        unit: 'mmol/L'
      })
      if (this.data.myVideo){
        this.data.myVideo.pause();
      }
      if(newVal == 1){
        this.setData({
          testingTypeVal:2
        })
        if (isLogoin_02()){
          this.init(2)
        }
        this.init_video(2)
      }else {
        this.setData({
          testingTypeVal: 12
        })
        if (isLogoin_02()) {
          this.init(12)
        }
        this.init_video(12)
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    getApp().setWatcher(this);
    // this.setData({
    //   queryType: option.type
    // })
    //this.init(this.data.testingTypeVal)
    this.init_video(2)
  },
  onUnload() {
    this.closeConnect();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShowCallBack () {
    this.init(this.data.testingTypeVal)
  },
  /**
     * 生命周期函数--监听页面隐藏
     */
  onHide: function () {
    if (this.data.myVideo) {
      this.data.myVideo.pause();
    }
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
  goHistory(){
    wx.navigateTo({
      url: '/pages/testingHistory/testingHistory?type=' + this.data.testingType,
    })
  },
  menuChange(event) {
    this.setData({
      testingType: parseInt(event.detail)
    })
  }, 
  swiperChange(event){
    this.setData({
      testingType: event.detail.current + 1
    })
  },
  onClose(){
    this.setData({
      dialogVisible: false
    })
  },
  onConfirm(){
    var postData = {};
    for (var i in this.data.testingOption) {
      if (this.data.testingType == this.data.testingOption[i].value) {
        postData = this.data.testingOption[i];
        break;
      }
    }
    if(this.data.testingType == 1){
      if (this.data.testingType == 1) {
        if (!this.data.status) {
          Toast('请选择测量状态');
          return;
        }
      }
      if (!this.data.inputValue) {
        Toast('请输入测量值');
        return;
      }
      wx.setStorageSync('testingData', JSON.stringify({
        testingType: postData.testingTypeVal,
        unit: postData.unit,
        name: postData.text,
        inputValue: this.data.inputValue,
        status: this.data.status,
        testingTime: this.data.timerTxt
      }))
    }else {
      if (!this.data.inputTcValue) {
        Toast('请输入TC总胆固醇测量数值');
        return;
      }
      if (!this.data.inputTgValue) {
        Toast('请输入TG甘油三酯测量数值');
        return;
      }
      if (!this.data.inputHdlValue) {
        Toast('请输入HDL低密度脂蛋白胆固醇测量数值');
        return;
      }
      if (!this.data.inputLdlValue) {
        Toast('请输入LDL高密度脂蛋白胆固醇测量数值');
        return;
      }
      wx.setStorageSync('testingData', JSON.stringify({
        testingType: postData.testingTypeVal,
        unit: this.data.unit,
        name: postData.text,
        inputTcValue: this.data.inputTcValue,
        inputTgValue: this.data.inputTgValue,
        inputHdlValue: this.data.inputHdlValue,
        inputLdlValue: this.data.inputLdlValue,
        testingTime: this.data.timerTxt
      }))
    }
    console.log(JSON.parse(wx.getStorageSync('testingData')))
    wx.navigateTo({
      url: '/pages/testingResult/testingResult'
    })
  },
  openDialog(){
    this.setData({
      dialogVisible:true
    })
    if (this.data.myVideo){
      this.data.myVideo.pause();
    }
  },
  openDialog_ly(){
    if (isLogoin()){
      if (!this.data.show_lanya_btn) {
        if (this.data.testingType == 1) {
          this.setData({
            deviceName: 'BBK_BLOOD'
          })
        } else {
          this.setData({
            deviceName: 'BLE SPP'
          })
        }
        this.setData({
          show_lanya_btn: true
        })
        this.openDialog();
      }
    }
  },
  openDialog_sd(){
    if(isLogoin()){
      this.setData({
        show_lanya_btn: false
      })
      this.openDialog();
    }
  },
  closeTimer(){
    this.setData({
      showPop:false
    })
  },
  onConfirmTimer(event){
    this.setData({
      timerTxt: getDateInDateAndtimes(event.detail, true),
      selectDate: event.detail
    })
    this.closeTimer();
  },
  openTimer(){
    this.setData({
      showPop: true,
      popType:'timer'
    })
  },
  closeStatus() {
    this.setData({
      showPop: false
    })
  },
  openStatus(){
    this.setData({
      showPop: true,
      popType:'status'
    })
  },
  onConfirmStatus(event){
    this.setData({
      statusTxt: event.detail.value,
      status: event.detail.index + ''
    })
    this.closeStatus();
  },
  restData(){
    this.setData({
      selectDate: new Date().getTime(),
      timerTxt: getDateInDateAndtimes(new Date(), true),
      popType: 'status',
      statusTxt: '选择测量状态',
      status: '',
      //蓝牙的数据设置
      lan_btn_text: '连接蓝牙',
      deviceId: '',
      services: '',
      notifyCharacteristicsId: '',//特征值
      connectedDeviceId: '',
      disabled_lanya: false,
      show_lanya_btn:false,
      lanya_tip:'',
      balanceData:'',
      isfirstDevLink: 1 //发起重新连接，不超过2次
    })    
    if (this.data.testingType == 2){
      this.setData({
        inputTcValue: '',
        inputTgValue: '',
        inputHdlValue: '',
        inputLdlValue: '',
        deviceName:'BLE SPP'
      })
    }else {
      this.setData({
        inputValue: '',
        deviceName: 'BBK_BLOOD',
      })
    }             
  },
  inputChange(event){
    if (event.currentTarget.dataset.type == 'xt'){
      this.setData({
        inputValue: event.detail
      })
    } else if (event.currentTarget.dataset.type == 'tc'){
      this.setData({
        inputTcValue: event.detail
      })
    } else if (event.currentTarget.dataset.type == 'tg') {
      this.setData({
        inputTgValue: event.detail
      })
    } else if (event.currentTarget.dataset.type == 'ldl') {
      this.setData({
        inputLdlValue: event.detail
      })
    } else if (event.currentTarget.dataset.type == 'hdl') {
      this.setData({
        inputHdlValue: event.detail
      })
    }
  },
  init(type){
    this.setData({
      curMeResult: ''
    })
    var postData = {
      "u_id": wx.getStorageSync('userId'),
      "show_type": type,
    }
    getUserNewDetection(postData).then(res => {
     //console.log(res)
      if(res.data.code == 200){
        var arr = res.data.object;
        var data = ''
        for (var i in arr) {
          if (arr[i].detection_type == postData.show_type) {
            data = arr[i];
            break;
          }
        }
        if(data){
          if(this.data.testingType == 1){
            if (getCurTime(true) == data.detection_time.split(' ')[0]) {
              data.detection_time = this.getInTimeRetDate(data.detection_time);
              if (data.detection_result.indexOf('偏高') != -1) {
                this.setData({
                  evaluationResultNumber: 2
                })
              } else if (data.detection_result.indexOf('偏低') != -1) {
                this.setData({
                  evaluationResultNumber: 3
                })
              } else if (data.detection_result.indexOf('正常') != -1) {
                this.setData({
                  evaluationResultNumber: 1
                })
              }
              this.setData({
                curMeResult: data
              })
            }
          }else {
            this.xz_testing_result(data)
          }
        }
      }
    }) 
  },
  init_video(type){
    var videoPost = { hr_branch, detection_type: type }
    //console.log(videoPost)
    getBodyVideoByType(videoPost).then(res => {
      console.log(res)
      if (res.data.code) {
        this.setData({
          videoUrl: res.data.object[0] ? res.data.object[0].video_url : '',
          myVideo: wx.createVideoContext('myVideo')
        },() => {
          if (this.data.myVideo){
            this.data.myVideo.seek(0);
          }
        })
      }
    })
  },
  getInTimeRetDate(time){
    var data = time.split(':')
    return data[0] + ':' + data[1]
  },

  //蓝牙
  reconnect() {
    this.init_lanya();
  },
  init_lanya() {
    var _this = this;
    if (wx.openBluetoothAdapter) {//初始化蓝牙
      wx.openBluetoothAdapter({
        success(res) {
          console.log('初始化成功')
          _this.setData({
            lanya_tip: '',
          })
          _this.getBluetoothAdapterState()
        },
        fail(err) {
          _this.setData({
            lanya_tip: '初始化失败，请打开蓝牙',
          })
        }
      })
    } else {
      _this.setData({
        lanya_tip: '当前手机不支持蓝牙',
      })
    }
  },
  getBluetoothAdapterState() {//检测本机蓝牙是否可用
    var _this = this;
    wx.getBluetoothAdapterState({
      success(res) {
        console.log('获取成功')
        console.log(res)
        if (res.available) {
          setTimeout(() => {
            _this.startBluetoothDevicesDiscovery()
          }, 1000)
          _this.setData({
            lanya_tip: '',
          })
        } else {
          _this.setData({
            lanya_tip: '本机蓝牙适配器不可用',
          })
        }
      },
      fail(err) {
        _this.setData({
          lanya_tip: '本机蓝牙适配器不可用',
        })
      }
    })
  },
  startBluetoothDevicesDiscovery() {//开始搜索蓝牙设备
    if (this.data.lan_btn_text == '连接蓝牙') {
      var _this = this;
      wx.startBluetoothDevicesDiscovery({
        success(res) {
          _this.setData({
            lan_btn_text: '搜索中',
            lanya_tip:''
          })
          console.log('开始搜索')
          //console.log(res)
          /* 获取蓝牙设备列表 */
          setTimeout(() => {
            _this.getBluetoothDevices()
          },1000)
        },
        fail(res) {
          _this.setData({
            lan_btn_text: '连接蓝牙',
            lanya_tip: '蓝牙搜索失败或未打开蓝牙,请打开蓝牙',
          })
        }
      })
    }
  },
  getBluetoothDevices() {//获取搜索到的蓝牙设备列表  
    var _this = this;
    _this.setData({
      lan_btn_text: '查询蓝牙列表中',
      lanya_tip: ''
    })
    console.log('deviceName'+_this.data.deviceName)
    wx.getBluetoothDevices({
      services: [],
      allowDuplicatesKey: false,
      interval: 0,
      success: function (res) {
        console.log('获取搜索结果')
        console.log(res)
        if (res.devices.length > 0) {
          if (JSON.stringify(res.devices).indexOf(_this.data.deviceName) !== -1) {
            for (let i = 0; i < res.devices.length; i++) {
              if (_this.data.deviceName === res.devices[i].name) {
                /* 根据指定的蓝牙设备名称匹配到deviceId */
                _this.data.deviceId = res.devices[i].deviceId;
                setTimeout(() => {
                  _this.connectTO();
                },1000)
                _this.setData({
                  lan_btn_text: '正在连接',
                  lanya_tip:''
                })
              };
            };
          } else {
            wx.stopBluetoothDevicesDiscovery()
            _this.setData({
              lan_btn_text: '连接蓝牙',
              lanya_tip: '没有搜索到蓝牙设备，请打开设备或关闭重新连接',
            })
          }
        } else {
          wx.stopBluetoothDevicesDiscovery()
          _this.setData({
            lan_btn_text: '连接蓝牙',
            lanya_tip: '没有搜索到蓝牙设备，请打开设备或关闭重新连接',
          })
        }
      },
      fail(res) {
        _this.setData({
          lan_btn_text: '连接蓝牙',
          lanya_tip: '蓝牙搜索失败或未打开蓝牙，请打开蓝牙'
        })
      }
    })
  },
  connectTO() {//连接设备
    var _this = this;
    wx.createBLEConnection({
      deviceId: _this.data.deviceId,
      success: function (res) {
        console.log('连接成功')
        //console.log(res)
        _this.data.connectedDeviceId = _this.data.deviceId;
        /* 4.获取连接设备的service服务 */
        _this.getBLEDeviceServices();
        wx.stopBluetoothDevicesDiscovery({//监听低功耗蓝牙连接状态的改变事件。包括开发者主动连接或断开连接，设备丢失，连接异常断开等等
          success: function (res) {
            console.log('连接成功，停止搜索')
            console.log(res)
          },
          fail(res) {

          },
          complete() {

          }
        })
        _this.onBlueLinkStateChange();
        _this.setData({
          lan_btn_text: '连接成功，请滴血进行测量',
          lanya_tip:''
        })
      },
      fail: function (res) {
        _this.setData({
          lan_btn_text: '连接蓝牙',
          lanya_tip:'连接蓝牙失败或未打开蓝牙，请打开蓝牙'
        })
      }
    })
  },
  getBLEDeviceServices() {//获取设备的service服务,获取的serviceId有多个要试着连接最终确定哪个是稳定版本的service,获取服务完获取设备特征值
    var _this = this;
    wx.getBLEDeviceServices({
      deviceId: _this.data.connectedDeviceId,
      success: function (res) {
        console.log('获取服务成功')
        console.log(res)
        _this.data.services = res.services
        /* 获取连接设备的所有特征值 */
        console.log('type' + _this.data.testingType)
        if (_this.data.testingType == 1){
          _this.getBLEDeviceCharacteristics_xt()
        }else {
          _this.getBLEDeviceCharacteristics_xz()
        }
        _this.setData({
          lanya_tip: ''
        })
      },
      fail: (res) => {
        _this.setData({
          lan_btn_text: '连接蓝牙',
          lanya_tip: '获取蓝牙服务失败或未打开蓝牙，请打开蓝牙'
        })
      }
    })
  },
  getBLEDeviceCharacteristics_xt() {//获取血糖的特征值
    console.log('测量血糖')
    var _this = this;
    console.log('services')
    var serviceId = '';
    for (var i in _this.data.services) {
      if (this.data.services[i].uuid == '6E400001-B5A3-F393-E0A9-E50E24DCCA9E'){
        serviceId = _this.data.services[i].uuid
      }
    }
    _this.setData({
      serviceId
    })
    console.log(_this.data.services)
    wx.getBLEDeviceCharacteristics({
      deviceId: _this.data.connectedDeviceId,
      serviceId: serviceId,
      success: function (res) {
        console.log('获取特征值成功')
        console.log(res)
        for (var i = 0; i < res.characteristics.length; i++) {
          if (res.characteristics[i].properties.notify) {
            console.log(res.characteristics[i].uuid, '蓝牙特征值 ==========')
            /* 获取蓝牙特征值 */
            _this.data.notifyCharacteristicsId = res.characteristics[i].uuid
            // 启用低功耗蓝牙设备特征值变化时的 notify 功能
            _this.notifyBLECharacteristicValueChange()
            _this.setData({
              lanya_tip: ''
            })
          }
        }
      },
      fail: function (err) {
        _this.setData({
          lan_btn_text: '连接蓝牙',
          lanya_tip: '获取特征值失败失败或未打开蓝牙，请打开蓝牙'
        })
      }
    })
  },
  getBLEDeviceCharacteristics_xz() {//获取血脂的特征值
    console.log('测量血脂')
    var _this = this;
    var serviceId = ''
    for (var i in _this.data.services) {
      var characteristics_slice = _this.data.services[i].uuid.slice(4, 8);
      if (characteristics_slice == 'FEE0' || characteristics_slice == 'FEE0') {
        serviceId = _this.data.services[i].uuid;
        break;
      }
    }
    _this.setData({
      serviceId
    })
    console.log(serviceId)
    wx.getBLEDeviceCharacteristics({
      deviceId: _this.data.connectedDeviceId,
      serviceId: serviceId,
      success: function (res) {
        var characteristics = res.characteristics;      //获取到所有特征值
        var characteristics_length = characteristics.length;    //获取到特征值数组的长度
        console.log('获取到特征值', characteristics);
        console.log('获取到特征值数组长度', characteristics_length);
        /* 遍历数组获取notycharacteristicsId */
        for (var index = 0; index < characteristics_length; index++) {
          var noty_characteristics_UUID = characteristics[index].uuid;    //取出特征值里面的UUID
          var characteristics_slice = noty_characteristics_UUID.slice(4, 8);   //截取4到8位
          /* 判断是否是我们需要的FEE1 */
          if (characteristics_slice == 'FEE1' || characteristics_slice == 'fee1') {
            var index_uuid = index;
            _this.setData({
              notifyCharacteristicsId: characteristics[index_uuid].uuid,    //需确定要的使能UUID
              characteristicsId: characteristics[index_uuid].uuid         //暂时确定的写入UUID
            });
            /* 遍历获取characteristicsId */
            for (var index = 0; index < characteristics_length; index++) {
              var characteristics_UUID = characteristics[index].uuid;    //取出特征值里面的UUID
              var characteristics_slice = characteristics_UUID.slice(4, 8);   //截取4到8位
              /* 判断是否是我们需要的FEE2 */
              if (characteristics_slice == 'FEE2' || characteristics_slice == 'fee2') {
                var index_uuid = index;
                _this.setData({
                  characteristicsId: characteristics[index_uuid].uuid         //确定的写入UUID
                });
              };
            };
          };
        };
        console.log('使能characteristicsId', _this.data.notifyCharacteristicsId);
        console.log('写入characteristicsId', _this.data.characteristicsId);
        _this.notifyBLECharacteristicValueChange();
      },
      fail: function (err) {
        console.log(err)
        wx.showToast({
          title: '获取特征值失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  notifyBLECharacteristicValueChange() {//启动notify 蓝牙监听功能 然后使用 wx.onBLECharacteristicValueChange用来监听蓝牙设备传递数据
    var _this = this;
    console.log('6.启用低功耗蓝牙设备特征值变化时的 notify 功能')
    wx.notifyBLECharacteristicValueChange({
      state: true,
      deviceId: _this.data.connectedDeviceId,
      serviceId: _this.data.serviceId,
      characteristicId: _this.data.notifyCharacteristicsId,
      success() {
        /*用来监听手机蓝牙设备的数据变化*/
        wx.onBLECharacteristicValueChange(function (res) {
          console.log('=====================')
          console.log('监听特征值变化')
          console.log(res.value)
            /**/
          if (_this.data.testingType == 1) {//血糖的逻辑
            _this.xt_handle(res)
          } else {
            _this.xz_handle(res)
          }
        })
      },
      fail(err) {
        console.log(err)
        _this.setData({
          lan_btn_text: '连接蓝牙',
          lanya_tip: '启用低功耗蓝牙设备监听失败'
        })
      }
    })
  },
  xt_handle(res){
    var _this = this;
    var match16binary = _this.buf2string(res.value)
    console.log(match16binary)
    var balanceData = '';
    //var balanceData = (parseInt(match16binary.slice(match16binary.length - 8, match16binary.length - 6), 16)).toFixed(2);
    var value = parseInt(match16binary.slice(match16binary.length - 8, match16binary.length - 6), 16)
    var n = parseInt(match16binary.slice(match16binary.length - 6, match16binary.length - 5), 16)
    console.log(value)
    if (n >= 8) {
      balanceData = (value * Math.pow(10, n - 16)) * 1000
    } else {
      balanceData = (value * Math.pow(10, n)) * 1000
    }
    //var hexstr = _this.receiveData(res.value)
    console.log(balanceData)
    //console.log(hexstr)
    _this.setData({
      inputValue: balanceData.toFixed(2),
      selectDate: new Date().getTime(),
      timerTxt: getDateInDateAndtimes(new Date(), true),
    })
    Toast.success({
      message:'测量成功',
      duration:3000
    });
    _this.closeConnect();
  },
  xz_handle(res){
    var _this = this;
    _this.data.xz_finsed = false;
    if (_this.data.xz_timer){
      clearTimeout(_this.data.xz_timer)
    }
    var balanceData = _this.buf2string(res.value)
    //console.log(balanceData)
    if (balanceData == '020a31306d03') {
      _this.writeSendLanya('020a3101549203');
    }
    if (balanceData.length == 40) {
      _this.data.balanceData += '-' + balanceData
      _this.data.xz_timer = setTimeout(() => {
        _this.data.xz_finsed = true
      }, 1500)
    } else if (balanceData.length == 22 || balanceData.length == 10) {
      _this.data.balanceData += balanceData
      _this.data.xz_timer = setTimeout(() => {
        _this.data.xz_finsed = true
      }, 1500)
    }
  },
  xz_transformation_val(str){
    str = str.substr(0, 50)
    //时间
    var date_hex = str.substr(10, 20);
    var date_arr = []
    //console.log(date_hex)
    for (var i = 0; i < date_hex.length; i += 2) {
      var item = parseInt(date_hex.substr(i, 2), 16) - 48
      date_arr.push(item)
    }
    //console.log(date_arr)
    var measureDate = '20' + date_arr[4] + date_arr[5] + '-' + date_arr[0] + date_arr[1] + '-' + date_arr[2] + date_arr[3] + ' ' + date_arr[6] + date_arr[7] + ':' + date_arr[8] + date_arr[9]
    console.log('时间：' + measureDate)
    //测量类型
    var type = str.substr(32, 4)
    var type_arr = []
    for (var i = 0; i < type.length; i += 2) {
      var item = parseInt(type.substr(i, 2), 16) - 48
      type_arr.push(item)
    }
    //console.log(type_arr)
    var measureType = '' + type_arr[0] + type_arr[1]
    console.log('类型：' + measureType)
    //测量值
    var value = str.substr(36, 8)
    var value_arr = [];
    var measureValue = ''
    if (value == '20204c4f'){//这里有三种特殊情况
      measureValue = 'LO'
    } else if (value == '20204849'){
      measureValue = 'HI'
    } else if (value == '202d2d2d'){
      measureValue = '---'
    }else {
      for (var i = 0; i < value.length; i += 2) {
        var mihe16 = value.substr(i, 2);
        if (mihe16 == '20') {
          value_arr.push('')
        } else if (mihe16 == '2e') {
          value_arr.push('.')
        } else if (mihe16 == '2d') {
          value_arr.push('')
        } else {
          var item = parseInt(mihe16, 16) - 48;
          if (item) {
            value_arr.push(item)
          }
        }
      }
      //console.log(value_arr)
      measureValue = value_arr.join('')
      if (measureValue < 1){
        measureValue = '0' + measureValue
      }
    }
    console.log("值：" + measureValue)
    //单位
    var unit = str.substr(44, 2)
    var measureUnit = parseInt(unit, 16) - 48
    console.log('单位:' + measureUnit)
  
    if (measureUnit == 1){
      this.setData({
        unit: 'mg/dL' 
      })
    } else if (measureUnit == 2){
      this.setData({
        unit: 'mmol/L'
      })
    }
    if (measureType == 17) {
      this.setData({
        inputTcValue: measureValue
      })
    } else if (measureType == 18){
      this.setData({
        inputTgValue: measureValue
      })
    } else if (measureType == 20) {
      this.setData({
        inputHdlValue: measureValue
      })
    } else if (measureType == 24) {
      this.setData({
        inputLdlValue: measureValue
      })
    }
    this.setData({
      timerTxt: measureDate,
      selectDate: new Date('2020-01-31 17:35').getTime(),
    })
  },
  writeSendLanya(value) {
    console.log('sendStr:' + value)
    var _this = this;
    /* 将数值转为ArrayBuffer类型数据 */
    var typedArray = new Uint8Array(value.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    }));
    var buffer = typedArray.buffer;
    wx.writeBLECharacteristicValue({
      deviceId: _this.data.connectedDeviceId,
      serviceId: _this.data.serviceId,
      characteristicId: _this.data.characteristicsId,
      value: buffer,
      success: function (res) {
        console.log('数据发送成功', res);
      },
      fail: function (res) {
        console.log('调用失败', res);
        /* 调用失败时，再次调用 */
        wx.writeBLECharacteristicValue({
          deviceId: _this.data.deviceId,
          serviceId: _this.data.serviceId,
          characteristicId: _this.data.characteristicsId,
          value: buffer,
          success: function (res) {
            console.log('第2次数据发送成功', res);
          },
          fail: function (res) {
            console.log('第2次调用失败', res);
            /* 调用失败时，再次调用 */
            wx.writeBLECharacteristicValue({
              deviceId: _this.data.deviceId,
              serviceId: _this.data.serviceId,
              characteristicId: _this.data.characteristicsId,
              value: buffer,
              success: function (res) {
                console.log('第3次数据发送成功', res);
              },
              fail: function (res) {
                console.log('第3次调用失败', res);
              }
            });
          }
        });
      }
    });
  },
  // 断开设备连接
  closeConnect() {
    var _this = this;
    if (_this.data.connectedDeviceId) {
      console.log('断开设备连接1')
      wx.closeBLEConnection({
        deviceId: _this.data.connectedDeviceId,
        complete: function (res) {
          _this.closeBluetoothAdapter()
        }
      })
    } else {
      console.log('断开设备连接2')
      _this.closeBluetoothAdapter()
    }
    this.setData({
      lan_btn_text: '连接蓝牙',
    })
  },
  // 关闭蓝牙模块
  closeBluetoothAdapter() {
    console.log('关闭蓝牙模块')
    wx.closeBluetoothAdapter({
      success: function (res) {

      },
      fail: function (err) {
      }
    })
  },
  // 监听蓝牙连接情况
  onBlueLinkStateChange() {
    var _this = this;
    wx.onBLEConnectionStateChange(function (res) {// 该方法回调中可以用于处理连接意外断开等异常情况
      console.log('蓝牙意外断开')
      console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
      if (!res.connected) {
        _this.setData({
          lanya_tip: '蓝牙断开',
          lan_btn_text: '连接蓝牙'
        })
        _this.closeConnect();
      }
    })
  },
  /*转换成需要的格式*/
  buf2string(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  },
  receiveData(buf) {
    return this.hexCharCodeToStr(this.ab2hex(buf))
  },
  /*转成二进制*/
  ab2hex(buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer), function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('')
  },
  /*转成可展会的文字*/
  hexCharCodeToStr(hexCharCodeStr) {
    var trimedStr = hexCharCodeStr.trim();
    var rawStr = trimedStr.substr(0, 2).toLowerCase() === '0x' ? trimedStr.substr(2) : trimedStr;
    var len = rawStr.length;
    var curCharCode;
    var resultStr = [];
    for (var i = 0; i < len; i = i + 2) {
      curCharCode = parseInt(rawStr.substr(i, 2), 16);
      resultStr.push(String.fromCharCode(curCharCode));
    }
    return resultStr.join('');
  },
  ab2str(u, f) {
    var b = new Blob([u]);
    var r = new FileReader();
    r.readAsText(b, 'utf-8');
    r.onload = function () { if (f) f.call(null, r.result) }
  },
  videoPlayErr(){
    Toast('视频错误，请检查视频源链接')
  },
  xz_testing_result(data) {
    // "tc": "",//总胆固醇TC参考值：2.85～5.69mmol/L(110～220mg/dl)
    // "hdl": "",//高密度脂蛋白胆固醇HDL参考值：1.04～1.55mmol/L(45～60mg/dl)
    // "ldl": "",//低密度脂蛋白胆固醇LDL参考值：≤3.10mmol/L(≤120mg/dl)
    // "tg": "",//甘油三酯TG参考值:≤2.3mmol/l(≤200mg/dl)
    console.log(data)
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
    data.list = arr;
    this.setData({
      curMeResult: data
    })
    console.log(this.data.curMeResult)
  },
})