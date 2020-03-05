// pages/home/shop/shop.js
import { routerFillter } from '../../../assets/js/router.js'
import { hr_branch} from '../../../assets/js/public.js'
import { getSysDictionaryItemList, getBeanGoodsPageWithSaleNum } from '../../../assets/js/api.js'
routerFillter({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    list:[],
    tabTtypeArr:'',
    selectTypeId:'',
    page_index:1,
    page_size:8,
    loading:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  // onShowCallBack: function () {
    
  // },

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
  onSearch(){
    wx.navigateTo({
      url: '/pages/shopSearch/shopSearch',
    })
  },
  init(){
    getSysDictionaryItemList({ typeCode: 'beanGoodType', hr_branch}).then(res => {
      //console.log(res.data.object)
      if(res.data.code == 200){
        var arr = res.data.object;
        arr.unshift({
          item_name:'全部',
          id:''
        })
        this.setData({
          tabTtypeArr: arr,
          selectTypeId:res.data.object[0].id,
          active:0
        })
        this.init_comm_list()
      }
    })
  },
  onTabChange(event){
    this.setData({
      selectTypeId: event.detail.name ? event.detail.name:'',
      list:[],
    })
    this.data.page_index = 1;
    this.init_comm_list();

  },
  init_comm_list(){
    var postData = {
      good_type_id: this.data.selectTypeId,//商品类型id
      authorityHrBranch: hr_branch,
      page_index: this.data.page_index,
      page_size: this.data.page_size,
      on_shelf: 0,//0上架1下架
      good_own: 0//0公司创建商品 1门店传入商品
    }
    this.setData({
      loading: true
    })
    //console.log(postData)
    getBeanGoodsPageWithSaleNum(postData).then(res => {
      //console.log(res);
      this.setData({
        loading:false
      })
      if (res.data.code = 200) {
        var arr = res.data.object.rows;
        var list = this.data.list;
        if(arr.length > 0){
          for(var i in arr){
            list.push(arr[i])
          }
          this.setData({
            list
          })
        }else {
          this.setData({
            loading:false
          })
        }
      }
    })
  }
})