// pages/addressEdit/addressEdit.js
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
import { routerFillter } from '../../assets/js/router.js'
import { isPoneAvailable} from '../../assets/js/public.js'
import { saveUserAddress, getArea, getUserAddressById} from '../../assets/js/api.js'
routerFillter({

  /**
   * 页面的初始数据
   */
  data: {
    sex:'0',
    checked:true,
    if_default:false,
    user_name:'',
    tel_phone:'',
    area_info:'',
    showArea:false,
    columns: [],
    province_id: '',
    provinceData:[],
    city_id:'',
    cityData:[],
    district_id:'',
    districtData:[],
    address:'',
    house_num:'',
    adrId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    if (options.id){
      this.setData({
        adrId: options.id
      })
      wx.setNavigationBarTitle({
        title: '编辑收货地址'
      })
      this.init_data();
    }
    this.initArea('')//初始化省市区
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
  onChange(){
    
  },
  onSexChange(event){
    this.setData({
      sex: event.detail
    })
  },
  onSwitchChange(){
    this.setData({
      if_default:!this.data.if_default
    })
  },
  onUserNameChange(event){
    this.setData({
      user_name: event.detail
    })
  },
  onTelChange(event) {
    this.setData({
      tel_phone: event.detail
    })
  },
  onAdrChange(event){
    this.setData({
      address: event.detail
    })
  },
  onHouseChange(event) {
    this.setData({
      house_num: event.detail
    })
  },
  onAreaChange(){
    console.log(1111111)
  },
  openArea(){
    this.setData({
      showArea:true
    })
  },
  initArea(id) {
    this.getAreaInfoData(id, (provinceArr) => {
      //console.log(provinceArr)
      var provinceNameArr = [];
      var cityNameArr = [];
      var districtNameArr = []

      var provinceData = []
      var cityData = [];
      var districtData = [];
      var columns = [];
      for (var i = 0; i < provinceArr.length; i++) {
        provinceNameArr.push(provinceArr[i].name);
        provinceData.push({
          name: provinceArr[i].name,
          id: provinceArr[i].id
        })
      }
      columns.push({
        values: provinceNameArr,
        className: 'column1'
      })
      this.getAreaInfoData(provinceArr[0].id, (cityArr) => {
        for (var j = 0; j < cityArr.length; j++) {
          cityNameArr.push(cityArr[j].name);
          cityData.push({
            name: cityArr[j].name,
            id: cityArr[j].id
          })
        }
        columns.push({
          values: cityNameArr,
          className: 'column2'
        })
        
        this.getAreaInfoData(cityArr[0].id, (districtArr) => {
          for (var k = 0; k < districtArr.length; k++) {
            districtNameArr.push(districtArr[k].name);
            districtData.push({
              name: districtArr[k].name,
              id: districtArr[k].id
            })
          }
          columns.push({
            values: districtNameArr,
            className: 'column3'
          })
          this.setData({
            provinceData,
            cityData,
            districtData,
            columns
          })
        })
      })
    })
  },
  getAreaInfoData(id, callBack) {
    getArea(id).then(res => {
      if (res.data.code == 200) {
        callBack(res.data.object)
      }
    })
  },  
  onConfirm(event) {
    var data = event.detail.value;
    this.setData({
      area_info: data[0] + data[1] + data[2]
    })
    for (var i = 0; i < this.data.provinceData.length; i++) {
      if (data[0] == this.data.provinceData[i].name) {
        this.setData({
          province_id: this.data.provinceData[i].id
        })
        break;
      }
    }
    for (var i = 0; i < this.data.cityData.length; i++) {
      if (data[1] == this.data.cityData[i].name) {
        this.setData({
          city_id: this.data.cityData[i].id
        })
        break;
      }
    }
    for (var i = 0; i < this.data.districtData.length; i++) {
      if (data[2] == this.data.districtData[i].name) {
        this.setData({
          district_id: this.data.districtData[i].id
        })
        break;
      }
    }
    this.setData({
      showArea: false
    })
    //console.log(this.data.district_id)
  },
  onCancel() {
    this.setData({
      showArea:false
    })
  },
  onChange(event) {
    var { picker, value, index } = event.detail
    var name = value[index];
    var data = '';
    var id = '';

    if (index == 0) {
      data = this.data.provinceData;
    } else if (index == 1) {
      data = this.data.cityData;
    } else if (index == 2) {
      data = this.data.districtData;
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].name == name) {
        id = data[i].id;
        break;
      }
    }
    if (index < 2) {//当省和市改变是picker变动
      this.getAreaInfoData(id, (arrData) => {
        var areaData = []
        var cityData = [];
        var districtData = [];
        if (index == 0) {
          this.setData({
            cityData:[],
            districtData:[]
          })
        } else if (index == 1) {
          this.setData({
            districtData: []
          })
        }
        for (var i = 0; i < arrData.length; i++) {
          areaData.push(arrData[i].name);
          if (index == 0) {
            cityData.push({
              name: arrData[i].name,
              id: arrData[i].id
            });
          } else if (index == 1) {
            districtData.push({
              name: arrData[i].name,
              id: arrData[i].id
            });
          }
        }
        if(index == 0){
          this.setData({
            cityData
          })
        }
        if(index == 1){
          this.setData({
            districtData
          })
        }
        if (index == 0) {//如果是省在次改变区
          this.getAreaInfoData(this.data.cityData[0].id, (arrData_02) => {
            var areaData_02 = [];
            var districtData = []
            for (var i = 0; i < arrData_02.length; i++) {
              areaData_02.push(arrData_02[i].name)
              districtData.push({
                name: arrData_02[i].name,
                id: arrData_02[i].id
              });
            }
            this.setData({
              districtData
            })
            this.setData({
              'columns[2]':{
                values: areaData_02,
                className: 'column3'
              }
            })
          })
        }
        var myVal = 'columns[' + (index + 1) + ']';
        this.setData({
          [myVal]:{
            values: areaData,
            className: 'column' + (index + 1)
          }
        })
      })
    }
  },
  submit() {
    if (!this.data.user_name) {
      Toast('请输入姓名');
      return;
    }
    if (!this.data.tel_phone) {
      Toast('请输入手机号码');
      return
    }
    if (!isPoneAvailable(this.data.tel_phone)) {
      Toast('请输入正确的手机号码');
      return
    }
    if (!this.data.province_id || !this.data.city_id || !this.data.district_id) {
      Toast('请选择省市区');
      return
    }
    if (!this.data.address) {
      Toast('请输入街道名称/小区名称');
      return
    }
    Dialog.confirm({
      title: '提示',
      message: '请确认信息无误，确定要保存吗?',
      confirmButtonColor: '#333'
    }).then(() => {
      var postData = {
        "id": this.data.adrId,//更新则传
        "u_id": wx.getStorageSync('userId'),//会员id,必传
        "user_name": this.data.user_name,//名称,必传
        "tel_phone": this.data.tel_phone,//电话,必传
        "sex": this.data.sex,//性别,必传
        "province_id": this.data.province_id,//省,必传
        "city_id": this.data.city_id,//市,必传
        "district_id": this.data.district_id,//区,必传
        "address": this.data.address,//地址,必传
        "house_num": this.data.house_num,//门牌号
        "if_default": this.data.if_default ? 1 : 0//是否默认0否1是,必传
      }
      //console.log(postData)
      saveUserAddress(postData).then(res => {
        if (res.data.code == 200) {
          Toast('保存成功')
          setTimeout(() => {
            wx.navigateBack()
          },1000)
        }
      })
    }).catch(() => {
      // on cancel
    });
  },
  init_data(){
    getUserAddressById({ id: this.data.adrId }).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        var data = res.data.object;
        this.setData({
          user_name: data.user_name,
          sex: data.sex + '',
          tel_phone: data.tel_phone,
          area_info: data.province_name + data.city_name + data.district_name,
          province_id: data.province_id,
          city_id: data.city_id,
          district_id: data.district_id,
          address: data.address,
          house_num: data.house_num,
          if_default: data.if_default == 1 ? true : false
        })
      }
    })
  }
})