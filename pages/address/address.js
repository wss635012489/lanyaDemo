// pages/address/address.js
import Dialog from '@vant/weapp/dialog/dialog';
import { routerFillter} from '../../assets/js/router.js'
import { getUserAddressPage, deleteUserAddress} from '../../assets/js/api.js'
routerFillter({

  /**
   * 页面的初始数据
   */
  data: {
    loading:false,
    page_index:1,
    page_size:10,
    list:[],
    isSel:false,
    eventChannel:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options && options.sel){
      this.setData({
        isSel:true
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
  onShowCallBack: function () {
    this.setData({
      list:[]
    })
    this.data.page_index = 1;
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
    this.data.page_index++;
    this.init();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  delAddress(event){
    Dialog.confirm({
      title: '提示',
      message: '确定要删除该地址吗？',
    }).then(() => {
      deleteUserAddress({ id: event.currentTarget.dataset.adid }).then(res => {
        //console.log(res)
        if (res.data.code == 200) {
          this.data.page_index = 1;
          this.setData({
            list:[]
          })
          this.init();
        }
      })
    }).catch(() => {
      
    });
  },
  linkTo(event){
    if (event.currentTarget.dataset.adid){
      wx.navigateTo({
        url: '/pages/addressEdit/addressEdit?id=' + event.currentTarget.dataset.adid,
      })
    }else {
      wx.navigateTo({
        url: '/pages/addressEdit/addressEdit',
      })
    }
  },
  init() {
    this.setData({
      loading:true
    })
    var postData = {
      u_id: wx.getStorageSync('userId'),
      page_index: this.data.page_index,
      page_size: this.data.page_size
    }
    //console.log(postData)
    getUserAddressPage(postData).then(res => {
      console.log(res);
      this.setData({
        loading:false
      })
      if (res.data.code == 200) {
        var arr = res.data.object.rows;
        var list = this.data.list
        if (arr.length > 0) {
          for (var i in arr) {
            list.push(arr[i])
          }
        }
        this.setData({
          list
        })
      }
    })
  },
  selItem(event){
    if(this.data.isSel){
      wx.setStorageSync('selAddress', event.currentTarget.dataset.item);
      wx.navigateBack();
    }
  }
})