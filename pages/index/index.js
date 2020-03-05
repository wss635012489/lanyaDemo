//index.js
//获取应用实例
// import Dialog from '/@vant/weapp/dialog/dialog';
// import { getWeMiniUser } from '../../assets/js/api.js'
// import { hr_branch } from '../../assets/js/public.js'
// const app = getApp()

Page({
  // data: {
  //   userInfo: {},
  //   hasUserInfo: false,
  //   canIUse: wx.canIUse('button.open-type.getUserInfo')
  // },
  // onLoad: function () {
  //   if (app.globalData.userInfo) {
  //     this.setData({
  //       userInfo: app.globalData.userInfo,
  //       hasUserInfo: true
  //     })
  //     this.linkTo()
  //   } else if (this.data.canIUse){
  //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //     // 所以此处加入 callback 以防止这种情况
  //     app.userInfoReadyCallback = res => {
  //       this.setData({
  //         userInfo: res.userInfo,
  //         hasUserInfo: true
  //       })
  //       this.linkTo()
  //     }
  //   } else {
  //     // 在没有 open-type=getUserInfo 版本的兼容处理
  //     wx.getUserInfo({
  //       success: res => {
  //         app.globalData.userInfo = res.userInfo
  //         this.setData({
  //           userInfo: res.userInfo,
  //           hasUserInfo: true
  //         })
  //         this.linkTo()
  //       }
  //     })
  //   }
  //   if (!app.globalData.openId) {//可能会在 Page.onLoad 之后才返回
  //     wx.login({
  //       success: res => {
  //         //console.log(res)
  //         getWeMiniUser({ code: res.code, hr_branch }).then(res => {
  //           if (res.data.code == 200) {
  //             app.globalData.openId = res.data.object.openid
  //           }
  //         })
  //       }
  //     })
  //   }
  // },
  onShow: function () {
    this.linkTo()
  },
  // getUserInfo: function(e) {
  //   //console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  //   this.linkTo()
  // },
  linkTo(){
    wx.switchTab({
      url: '/pages/home/self/self'
    })
    // if (wx.getStorageSync('userId')) {
    //   wx.switchTab({
    //     url: '/pages/home/self/self'
    //   })
    //   // wx.navigateTo({
    //   //   url: '/pages/testingResult/testingResult',
    //   // })
    // } else {
    //   wx.reLaunch({
    //     url: '/pages/login/login',
    //   })
    // }
  },
  // authorization(){
  //   Dialog.confirm({
  //     title: '警告',
  //     message: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权'
  //   }).then(() => {
  //     wx.openSetting({
  //       success: (res) => {
  //         if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
  //           wx.getUserInfo({
  //             success: (res) => {
  //               app.globalData.userInfo = res.userInfo
  //               this.setData({
  //                 userInfo: res.userInfo,
  //                 hasUserInfo: true
  //               })
  //               this.linkTo()
  //             }
  //           })
  //         }
  //       }
  //     })
  //   }).catch(() => {
  //     // on cancel
  //   });
  // }
})
