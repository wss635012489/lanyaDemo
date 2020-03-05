// pages/cart/cart.js
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
import { routerFillter } from '../../assets/js/router.js'
import { getBranchPersonalityCustom } from '../../assets/js/publicRequest.js'
import { token} from '../../assets/js/public.js'
import { getBeanGoodsCartPage, delBeanGoodsCart, getBeanGoodDetail} from '../../assets/js/api.js'
routerFillter({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    checkedAll:false,
    showPop:false,
    integral_name: '积分',
    page_index:1,
    page_size:10,
    total:0,
    loading:false,
    all_price_num:0,
    all_bean_num: 0,
    specList:[],
    selNumber:0
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
    this.data.page_index = 1;
    this.init()
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
    this.init()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onCheckChange(event){
    //console.log(event)
    var id = event.currentTarget.dataset.commid;
    var allNumber = 0;
    for(var i in this.data.list){
      if (id == this.data.list[i].id){
        this.setData({
          ['list[' + i + '].isSel']: !this.data.list[i].isSel
        })
      }
      if (!this.data.list[i].isSel){
        allNumber++;
      }
    }
    if (!allNumber){
      this.setData({
        checkedAll:true
      })
    }else {
      this.setData({
        checkedAll: false
      })
    }
    this.commTotal();
  },
  onNumberChange(event){
    //console.log(event)
    var id = event.currentTarget.dataset.commid;
    for(var i in this.data.list){
      if (id == this.data.list[i].id){
        this.setData({
          ['list[' + i + '].order_num']: event.detail
        });
        break;
      }
    }
    this.commTotal();
  },
  onCheckAllChange(){
    this.setData({
      checkedAll: !this.data.checkedAll
    })
    for(var i in this.data.list){
      this.setData({
        ['list[' + i + '].isSel']: this.data.checkedAll
      })
    }
    this.commTotal();
  },
  delItem(event){
    var id = event.currentTarget.dataset.commid;
    Dialog.confirm({
      title: '提示',
      message: '确定要删除该商品吗？'
    }).then(() => {
      // on confirm
      delBeanGoodsCart({ ids: id}).then(res => {
        //console.log(res)
        if(res.data.code == 200){
          Toast('删除成功');
          this.data.page_index = 1;
          var arr = this.data.list;
          for (var i in arr){
            if (arr[i].id == id){
              arr.splice(i,1);
              break;
            }
          }
          this.setData({
            list:arr
          })
          this.init();
        }
      })
    }).catch(() => {
      // on cancel
    });
  },
  goPayment(){
    var arr = [];
    var total_order_num = 0;
    for(var i in this.data.list){
      var data = this.data.list[i];
      if (data.isSel){
        data.good_order_num = data.order_num;//单个商品下单数量
        data.good_total_num = data.order_num * data.activity_bean_num;//单个商品总共需要积分数量
        data.good_total_price = data.order_num * data.activity_price_num;//单个商品总共需要金额
        data.price_state = 1;//1活动价 2秒杀价
        arr.push(data);
        total_order_num += data.order_num;
      }
    }
    var orderInfo = {
      "token": token,
      "user_id": wx.getStorageSync('userId'),//会员id
      "cj_id": wx.getStorageSync('cj_id'),//门店id
      "total_order_num": total_order_num,//总订单数量
      "total_bean_num": this.data.all_bean_num,//总红豆数量
      "total_price": this.data.all_price_num,//总价格
      "good_channel": 1,//0积分商城渠道产生订单   1微信商城  2秒杀订单数据
      // "pick_way": 1,//取货方式0门店自提1送货上门 默认0
      // "user_address": "",//地址
      // "order_desc": "订单备注",
      "good_data": JSON.stringify(arr),
    }
    wx.setStorageSync('orderInfo', JSON.stringify(orderInfo))
    wx.navigateTo({
      url: '/pages/payment/payment',
    })
  },
  onClose(){
    this.setData({
      showPop:false
    })
  },
  openSpec(event){
    var id = event.currentTarget.dataset.goodid;
    getBeanGoodDetail({ id}).then(res => {
      //console.log(res)
      if(res.data.code == 200){
        this.setData({
          specList: res.data.object.beanGoodsSpecList
        })
        this.setData({
          showPop: true
        })
      }
    })
  },
  commTotal(){
    var all_price_num = 0;
    var all_bean_num = 0;
    var selNumber = 0;
    for (var i in this.data.list) {
      if (this.data.list[i].isSel) {
        all_price_num += (this.data.list[i].activity_price_num * this.data.list[i].order_num);
        all_bean_num += (this.data.list[i].activity_bean_num * this.data.list[i].order_num)
        selNumber++;
      }
    }
    this.setData({
      all_price_num,
      all_bean_num,
      selNumber
    })
  },
  init(){
    this.setData({
      loading:true
    })
    var postData = {
      "token": token,
      "u_id": wx.getStorageSync('userId'),
      "page_index": this.data.page_index,
      "page_size": this.data.page_size
    }
    getBeanGoodsCartPage(postData).then(res => {
      //console.log(res)
      this.setData({
        loading: false
      })
      if (res.data.code == 200) {
        var list = this.data.list;
        var arr = res.data.object.rows;
        if(list.length == 0){
          if (arr[0]){
            list.push(arr[0])
          }
        }
        for (var i in arr) {
          var isAdd = true;
          for(var j in list){
            if(arr[i].id == list[j].id){
              isAdd = false;
              break;
            }
          }
          if(isAdd){
            arr[i].isSel = false;
            list.push(arr[i])
          }
        }
        this.setData({
          total: res.data.object.total,
          list
        })
        console.log(this.data.list)
      }
    })
  },
  selSpecItem(event){
    var data = event.currentTarget.dataset.specitem;
    //console.log(data)
    for(var i in this.data.list){
      if (this.data.list[i].good_id == data.bean_good_id){
        this.setData({
          ['list[' + i + '].spec_id']: data.id,
          ['list[' + i + '].spec_name']: data.spec_name,   
          ['list[' + i + '].specactivity_bean_num_id']: data.activity_bean_num,
          ['list[' + i + '].activity_price_num']: data.activity_price_num,
        })
        break;
      }
    }
    this.setData({
      showPop:false
    })
    this.commTotal();
  }
})