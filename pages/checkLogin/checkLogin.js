// pages/checkLogin/checkLogin.js
import Dialog from '@vant/weapp/dialog/dialog';
import { defaultUserHeadeUrl } from '../../assets/js/public.js'
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    headUrl: defaultUserHeadeUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      headUrl: app.globalData.userInfo.avatarUrl
    })
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
  outLogin(){
    Dialog.confirm({
      title: '标题',
      message: '确定要切换账号重新登录吗'
    }).then(() => {
      wx.navigateTo({ url: '/pages/login/login' })
    }).catch(() => {
      // on cancel
    });
  }
})