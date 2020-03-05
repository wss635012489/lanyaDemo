// pages/payment/payment.js
import Toast from '@vant/weapp/toast/toast';
import { routerFillter } from '../../assets/js/router.js'
import { getBranchPersonalityCustom } from '../../assets/js/publicRequest.js'
import { hr_branch} from '../../assets/js/public.js'
import { getUserAddressDefault, unifiedorderForWeMini, saveBeanGoodsOrder, updateBeanGoodsOrderUserAddress} from '../../assets/js/api.js'
var app = getApp();
routerFillter({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    adrInfo:'',
    integral_name: '积分',
    all_price_num:0,
    all_bean_num:0,
    orderInfo:'',
    order_desc:'',
    disabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('orderInfo')){
      this.setData({
        orderInfo: JSON.parse(wx.getStorageSync('orderInfo'))
      })
      var arr = JSON.parse(JSON.parse(wx.getStorageSync('orderInfo')).good_data);
      var all_price_num = 0;
      var all_bean_num = 0
      for (var i in arr){
        all_price_num += arr[i].activity_price_num * arr[i].order_num;
        all_bean_num += arr[i].activity_bean_num * arr[i].order_num;
      }
      this.setData({
        list: arr,
        all_price_num,
        all_bean_num
      })
    }else {
      Toast('没有相关订单信息')
    }
    //console.log(this.data.list)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShowCallBack() {
    var address = wx.getStorageSync('selAddress');
    if (address) {
      //console.log(address)
      this.setData({
        adrInfo: address
      })
    }else {
      this.getMrAddress();
    }
    getBranchPersonalityCustom(data => {
      this.setData({
        integral_name: data.integral_name ? data.integral_name : '积分'
      })
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync('selAddress');
    //wx.removeStorageSync('orderInfo');
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
  selAddress(){
    wx.navigateTo({
      url: '/pages/address/address?sel=yes'
    })
  },
  goPay(){
    if (!this.data.adrInfo){
      Toast('请选择收货地址')
      return;
    }
    this.setData({
      disabled:true
    })
    if (this.data.orderInfo.order_id && this.data.orderInfo.order_code){
      this.oldOrderPay();
    }else {
      this.addNweOrderPay()
    }
  },
  getMrAddress(){
    getUserAddressDefault({u_id: wx.getStorageSync('userId')}).then(res => {
      //console.log(res)
      if(res.data.code == 200){
        this.setData({
          adrInfo: res.data.object
        })
      }
    })
  },
  addNweOrderPay() {//新的订单支付
    if (this.data.orderInfo){
      var postData = this.data.orderInfo
      postData.pick_way = 1;//取货方式0门店自提1送货上门 默认0
      postData.user_address = this.data.adrInfo.id,//地址
      postData.order_desc = this.data.order_desc
      console.log(postData)
      saveBeanGoodsOrder(postData).then(res => {
        console.log('===============')
        console.log(res)
        if(res.data.code == 200){
          this.getPayInfo(res.data.object.order_code);
        }else {
          this.setData({
            disabled: false
          })
        }
      })
    }else {
      Toast('没有商品订单信息')
    }
  },
  oldOrderPay() {//老订单支付
    var postData = {
      order_id: this.data.orderInfo.order_id,
      user_address: this.data.adrInfo.id
    }
    updateBeanGoodsOrderUserAddress(postData).then(res => {
      this.subDisabled = false;
      if (res.data.code == 200) {
        this.getPayInfo(this.data.orderInfo.order_code);
      }
    })
  },
  getPayInfo(out_trade_no){
    var _this = this;
    var postData = {
      "hr_branch": hr_branch,
      "openId": app.globalData.openId,
      "out_trade_no": out_trade_no,
      "total_fee": this.data.all_price_num,
      "u_id": wx.getStorageSync('userId')
    }
    console.log(postData)
    unifiedorderForWeMini(postData).then(res => {
      console.log('xxxxxxxxxxxxxxxx')
      console.log(res)
      if(res.data.code == 200){
        var data = res.data.object;
        wx.requestPayment({
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign,
          success(res) {
            Toast('支付成功,等待跳转...');
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/payResult/payResult',
              })
            }, 1500)
          },
          fail(res) {
            Toast('支付失败,等待跳转...');
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/order/order?tab=1',
              })
            },1500)
          }
        })
      }
    })
  },
  onDescChange(event){
    //console.log(event)
    this.setData({
      order_desc: event.detail
    })
  }
})