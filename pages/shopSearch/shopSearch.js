// pages/shopSearch/shopSearch.js
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
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
    this.init()
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
  onSearch(event){
    if (event.detail){
      var isOk = true;
      var arr = [];
      if (wx.getStorageSync('searchKey')) {
        arr = JSON.parse(wx.getStorageSync('searchKey'))
      }
      for (var i in arr) {
        if (arr[i] == event.detail) {
          isOk = false;
          break;
          return;
        }
      }
      if (isOk) {
        arr.push(event.detail)
        wx.setStorageSync('searchKey', JSON.stringify(arr));
        //this.init()
      }
    }

    wx.navigateTo({
      url: '/pages/shopSearchCont/shopSearchCont?search=' + event.detail,
    })
  },
  init(){
    console.log('-===================================================')
    console.log(wx.getStorageSync('searchKey'))
    if (wx.getStorageSync('searchKey')){
      this.setData({
        list: JSON.parse(wx.getStorageSync('searchKey'))
      })
    }else {
      this.setData({
        list:[]
      })
    }
  },
  clearSearch(){
    Dialog.confirm({
      title: '提示',
      message: '确定要清空历史搜索吗？'
    }).then(() => {
      wx.removeStorageSync('searchKey')
      this.init();
    }).catch(() => {
      // on cancel
    });
  },
  delItem(event){
    Dialog.confirm({
      title: '提示',
      message: '确定删除该条记录吗？'
    }).then(() => {
      var arr = JSON.parse(wx.getStorageSync('searchKey'))
      for(var i in arr){
        if (arr[i] == event.target.dataset.itemkey){
          arr.splice(i,1)
        }
      }
      wx.setStorageSync('searchKey', JSON.stringify(arr));
      this.init();
    }).catch(() => {
      // on cancel
    });
  },
  goSearch(event){
    wx.navigateTo({
      url: '/pages/shopSearchCont/shopSearchCont?search=' + event.target.dataset.itemkey,
    })
  }
})