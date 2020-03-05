// components/commList.js
import Toast from '@vant/weapp/toast/toast';
import { getBranchPersonalityCustom } from '../../assets/js/publicRequest.js'
import { saveBeanGoodsCart, getBeanGoodsCartPage} from '../../assets/js/api.js';
import { token, hr_branch, isLogoin, isLogoin_02} from '../../assets/js/public.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [],
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    integral_name:'积分',
    totalCartNumber: 0
  },
  attached() {
    getBranchPersonalityCustom(data => {
      this.setData({
        integral_name: data.integral_name ? data.integral_name:'积分'
      })
    })
  },
  /**
   * 组件的方法列表
   */
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { 
      if (isLogoin_02()){
        this.initCartNumber();
      }
    },
  },
  methods: {
    initCartNumber() {
      getBeanGoodsCartPage({
        "token": token,
        "u_id": wx.getStorageSync('userId')
      }).then(res => {
        if (res.data.code == 200) {
          console.log(res)
          this.setData({
            totalCartNumber: res.data.object.total
          })
        }
      })
    },
    addCommToCart(event) {
      if (isLogoin()){
        var data = event.currentTarget.dataset.itemdata;
        //console.log(data)
        var postData = {
          "token": token,
          "u_id": wx.getStorageSync('userId'),
          "good_id": data.id,
          "spec_id": data.beanGoodsSpecList[0].id,
          "order_num": 1,
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
            this.initCartNumber();
          }
        })
      }
    },
    goCart() {
      wx.navigateTo({
        url: '/pages/cart/cart',
      })
    },
    goDetails(event){
      // wx.showToast({
      //   title: '正在开发中',
      //   icon: 'none',
      //   duration: 2000
      // })
      wx.navigateTo({
        url: '/pages/commDetail/commDetail?id=' + event.currentTarget.dataset.itemid
      })
    }
  },
})
