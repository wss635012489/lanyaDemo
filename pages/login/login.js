// pages/login/login.js
import Toast from '@vant/weapp/toast/toast';
import { isPoneAvailable, hr_branch, getUser, defaultUserHeadeUrl} from '../../assets/js/public.js'
import { getAdminVeriCode, verifyAdminVeriCode, loginForWeChat} from '../../assets/js/api.js'
import { getOpenId} from '../../assets/js/publicRequest.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headUrl: defaultUserHeadeUrl,
    phoneNumber:'',
    code:'',
    timer:'',
    codeTxt:'获取验证码',
    disabled:false,
    name:'昵称'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.setData({
      headUrl: app.globalData.userInfo ? app.globalData.userInfo.avatarUrl : defaultUserHeadeUrl,
      name: app.globalData.userInfo ? app.globalData.userInfo.nickName : '昵称'
    })
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
    clearInterval(this.data.timer)
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
  getCode(){
    if (!app.globalData.userInfo) {
      wx.navigateTo({
        url: '/pages/verification/verification',
      })
      return;
    }
    if (!this.data.phoneNumber){
      Toast('请输入手机号');
      return;
    }
    if (!isPoneAvailable(this.data.phoneNumber)){
      Toast('请输入正确手机号');
      return;
    }
    var postData = {
      login_name: '+86-' + this.data.phoneNumber,
      code_type: "1",
      u_type: "4",
      hr_branch: hr_branch
    }
    getUser(this.data.phoneNumber,() => {
      getAdminVeriCode(postData).then(res => {
        console.log(res)
        if(res.data.code == 200){
          this.setData({
            disabled:true
          })
          var s = 60;
          this.data.timer = setInterval(() => {                            
            if(s > 0){
              s--;
              this.setData({
                codeTxt: '重新获取' + s + '(s)'
              })
            }else {
              this.setData({
                disabled: false,
                codeTxt:'获取验证码'
              })
              clearInterval(this.data.timer)
            }
          },1000)
        }
      })
    })
  },
  login(){
    if (app.globalData.openId){
      this.goLogoin()
    }else {
      getOpenId(this.goLogoin)
    }
  },
  goLogoin(){
    if (!app.globalData.userInfo) {
      wx.navigateTo({
        url: '/pages/verification/verification',
      })
      return;
    }
    if (!this.data.phoneNumber) {
      Toast('请输入手机号');
      return;
    }
    if (!isPoneAvailable(this.data.phoneNumber)) {
      Toast('请输入正确手机号');
      return;
    }
    if (!this.data.code) {
      Toast('请输入验证码');
      return;
    }
    getUser(this.data.phoneNumber, () => {
      var postData = {
        login_name: '+86-' + this.data.phoneNumber,
        code_type: "3",
        u_type: "4",
        veri_code: this.data.code,
        openid: app.globalData.openId,
        hr_branch: hr_branch
      }
      //console.log(postData)
      verifyAdminVeriCode(postData).then(r => {
        //console.log(r)
        if (r.data.success) {
          loginForWeChat({ openid: postData.openid }).then(res => {
            console.log(res)
            if (res.data.code == 200) {
              wx.setStorageSync('userId', res.data.object.userId);
              wx.setStorageSync('cj_id', res.data.object.cj_id)
              wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 2000
              })
              setTimeout(() => {
                wx.navigateBack()
                //wx.navigateBack()
              }, 600)
            }
          })
        }
      })
    })
  },
  onPhoneChange(event){
    this.setData({
      phoneNumber: event.detail 
    })
  },
  onCodeChange(event){
    this.setData({
      code: event.detail 
    })
  },
  goRegister(){
    wx.navigateTo({
      url: '/pages/register/register',
    })
  }
})