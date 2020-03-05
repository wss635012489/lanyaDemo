// pages/home/self/self.js
import { routerFillter} from '../../../assets/js/router.js'
import { defaultUserHeadeUrl, getInTimeRetDate, hr_branch, token, isLogoin, isLogoin_02} from '../../../assets/js/public.js'
import { getUserInfo, userBindCjId} from '../../../assets/js/api.js'
import { getBranchPersonalityCustom} from '../../../assets/js/publicRequest.js'
import Dialog from '@vant/weapp/dialog/dialog';
routerFillter({

  /**
   * 页面的初始数据
   */
  data: {
    headUrl: '',
    nick_name:'昵称',
    create_time:'',
    currency:0,
    integral_name:'积分'
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
  onShowCallBack: function () {
    this.init();
    getBranchPersonalityCustom(data => {
      this.setData({
        integral_name: data.integral_name ? data.integral_name : '积分'
      })
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
  outLogin(){
    if (isLogoin_02()){
      Dialog.confirm({
        title: '提示',
        message: '确定要退出登录吗？'
      }).then(() => {
        wx.clearStorageSync();
        wx.reLaunch({ url: '/pages/login/login' })
      }).catch(() => {
        // on cancel
      });
    }else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  linkTo(event){
    if(isLogoin()){
      wx.navigateTo({
        url: event.currentTarget.dataset.linkurl,
      })
    }
    console.log(event)
  },
  init(){
    getUserInfo({ u_id: wx.getStorageSync('userId') }).then(res => {
      //console.log(res)
      if (res.data.code == 200) {
        var data = res.data.object
        this.setData({
          nick_name: data.nick_name,
          create_time: getInTimeRetDate(data.create_time, true),
          currency: data.currency,
          headUrl: data.head_img ? data.head_img:''
        })
      }
    })
  },
  openScan(){
    if (isLogoin()){
      wx.scanCode({
        success(res) {
          console.log(res)
          var postData = {
            token,
            hr_branch,
            cj_id: res.result,
            u_id: wx.getStorageSync('userId'),
          }
          userBindCjId(postData).then(res => {
            console.log(res)
            if (res.data.code == 200) {
              wx.showToast({
                title: '绑定成功',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      })
    }
  },
  bdPhone(){
    wx.makePhoneCall({
      phoneNumber: '4006355378' 
    })
  },
})