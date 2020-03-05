// pages/commDetail/commDetail.js
import Toast from '@vant/weapp/toast/toast';
import { routerFillter } from '../../assets/js/router.js'
import { isImgOrViode, token, hr_branch,isLogoin} from '../../assets/js/public.js'
import { getBeanGoodDetail, getTeachStepList, saveBeanGoodsCart} from '../../assets/js/api.js'
import { getBranchPersonalityCustom } from '../../assets/js/publicRequest.js'
routerFillter({
  /**
   * 页面的初始数据
   */
  data: {
    isShowCont:false,
    commId:'',
    showDot:false,
    specList: [],
    specActiveIndex:0,
    toal_price_num: 0,
    toal_bean_num: 0,
    swiperImg:[],
    good_name:'',
    good_desc:'',
    good_price:0,
    total_bug_num:0,
    good_unit:'份',
    bean_num:0,
    price_num:0,
    good_number:1,
    detailsList:[],
    integral_name:'积分',
    spec_id:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      commId: options.id
    })
    this.init()
    getBranchPersonalityCustom(data => {
      this.setData({
        integral_name: data.integral_name ? data.integral_name : '积分'
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onNumberChange(event){
    this.setData({
      good_number: event.detail,
      toal_price_num: this.data.price_num * event.detail,
      toal_bean_num: this.data.bean_num * event.detail
    })
  },
  selSpecItem(event){
    this.setData({
      specActiveIndex: event.currentTarget.dataset.itemindex
    })
    this.setSpecifications(this.data.specList[event.currentTarget.dataset.itemindex])
  },
  init(){
    if (this.data.commId){
      Toast.loading({
        duration: 0,       // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        message: '加载中...',
        mask: true,
      });
      getBeanGoodDetail({ id: this.data.commId }).then(res => {
        //console.log(res)
        if(res.data.code == 200){
          var info = res.data.object;
          //console.log(info)
          if(info && JSON.stringify(info) != '{}'){
            var arr = this.arrInStr(info.detail_img);
            var swiperImg = [];
            for (var i in arr){
              swiperImg.push({
                url: arr[i],
                isImg: isImgOrViode(arr[i])
              })
            } 
            this.setData({
              swiperImg,
              good_name: info.good_name,
              good_desc: info.good_desc,
              isShowCont:true,
              total_bug_num: info.saleData.total_bug_num,
              specList: info.beanGoodsSpecList
            })
            this.setSpecifications(info.beanGoodsSpecList[0])
            this.getCommDetail(info.id)
          }
        }
      })
    }else {
      wx.showToast({
        title: '没有相关商品信息',
        icon: 'none',
        duration: 2000
      })
    }
  },
  setSpecifications(data){
    //console.log(data)
    var bean_num = data.bean_num != undefined ? data.bean_num : data.activity_bean_num;
    var price_num = data.price_num != undefined ? data.price_num : data.activity_price_num
    this.setData({
      good_price: data.good_price,
      good_unit: data.good_unit,
      bean_num: bean_num,
      price_num: price_num,
      toal_price_num: price_num * this.data.good_number,
      toal_bean_num: bean_num * this.data.good_number,
      spec_id:data.id
    })
  },
  arrInStr(str) {
    if(!str){
      return ''
    }
    return str.split(',');
  },
  getCommDetail(id){
    getTeachStepList({ good_id: id }).then(res => {
      //console.log(res);
      if (res.data.code == 200) {
        //console.log(res.data.object)
        var list = []
        var arr_01 = res.data.object.courseStepClassifyList;
        var arr_02 = res.data.object.teachStepList;
        for (var i in arr_01) {
          for (var j in arr_02) {
            if (arr_01[i].id == arr_02[j].step_classify) {
              arr_02[j].isVideo = !isImgOrViode(arr_02[j].step_type_url)
              list.push(arr_02[j])
            }
          }
        }
        this.setData({
          detailsList: list
        })
        //console.log(list)

        // if (this.submitDisabled) {
        //   this.$toast('商品已售完')
        // }
      }
      Toast.clear();
    })
  },
  videoStartPlay(event){
    var query = wx.createSelectorQuery();
    var queryNode = query.selectAll('.my-video');
    queryNode.fields({
      id: true,//是否返回节点id
    })
    query.exec(res => {
      var arr = res[0]
      for(var i in arr){
        if (arr[i].id != event.currentTarget.id){
          var context = wx.createVideoContext(arr[i].id);
          if (context){
            context.pause();
            context.seek(0);
          }
        }
      }
    })
  },
  addComm(){
    if(isLogoin()){
      var postData = {
        "token": token,
        "u_id": wx.getStorageSync('userId'),
        "good_id": this.data.commId,
        "spec_id": this.data.spec_id,
        "order_num": this.data.good_number,
        "hr_branch": hr_branch,
        "cj_id": wx.getStorageSync('cj_id')
      }
      console.log(postData)
      saveBeanGoodsCart(postData).then(res => {
        if (res.data.code == 200) {
          Toast.success({
            message: '添加成功，在购物车等您哦',
            duration: 2500
          });
        }
      })
    }
  }
})