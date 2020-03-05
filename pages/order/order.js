// pages/order/order.js
import { routerFillter } from '../../assets/js/router.js'
import { getBranchPersonalityCustom } from '../../assets/js/publicRequest.js'
routerFillter({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    integral_name: '积分'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.tab > 0){
      this.setData({
        active: parseInt(options.tab)
      })
    }
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

  }
})