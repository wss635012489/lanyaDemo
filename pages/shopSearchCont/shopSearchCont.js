// pages/shopSearchCont/shopSearchCont.js
import { hr_branch} from '../../assets/js/public.js'
import { getBeanGoodsPageWithSaleNum} from '../../assets/js/api.js'
import { routerFillter} from '../../assets/js/router.js'
routerFillter({

  /**
   * 页面的初始数据
   */
  data: {
    value:'',
    list:[],
    page_index:1,
    page_size:8,
    loading:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      value: options.search != 'null' ? options.search:''
    })
    this.init_comm_list();
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
    this.data.page_index++
    this.init_comm_list();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onSearch(event) {
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
      }
      wx.setNavigationBarTitle({
        title: event.detail
      })
    }
    this.setData({
      value: event.detail,
      list:[]
    })
    this.data.page_index = 1;
    this.init_comm_list();
  },
  init_comm_list(){
    var postData = {
      "search_content": this.data.value,
      "page_index": this.data.page_index,
      "page_size": this.data.page_size,
      "on_shelf": 0,//0上架1下架
      "good_own": 0,//0公司创建商品 1门店传入商品
      "hr_branch": hr_branch
    }
    this.setData({
      loading: true
    })
    //console.log(postData)
    getBeanGoodsPageWithSaleNum(postData).then(res => {
      //console.log(res)
      this.setData({
        loading: false
      })
      if (res.data.code == 200) {
        var arr = res.data.object.rows;
        var list = this.data.list;
        if (arr.length > 0) {
          for (var i in arr) {
            list.push(arr[i])
          }
          this.setData({
            list
          })
        } else {
          this.setData({
            loading: false
          })
        }
      }
    })
  }
})