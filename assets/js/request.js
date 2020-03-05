
import { notUrlArr } from './public.js';
var baseUrl = '';
var requstUrl = '';

function createQuest({ url, method, data, header },isRootBase){
  var baseUrl = 'https://www.vip448.cn';// 正式
  if (!isRootBase){
    //baseUrl = 'http://120.79.137.195:4464';//测试
    //baseUrl = 'http://192.168.0.199' //雷的测试地址
    requstUrl = baseUrl + '/bbox2-web-cplat';
    //requstUrl = 'http://229t8s0532.iask.in:56036/bbox2-web-cplat' //远程测试
  }else {
    //baseUrl = 'http://120.79.137.195:4172';//测试
    requstUrl = baseUrl + '/bbox2-web-mobile-cat';
    //requstUrl = 'http://229t8s0532.iask.in:56036/bbox2-web-mobile-cat' //远程测试
  }
  url = requstUrl + url
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url,
      header,
      data,
      method, 
      success: res => {
        if (res.data.code && res.data.code != 200){
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
        if (res.data.statusCode && res.data.statusCode != 200){
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
        resolve(res)
      },
      fail: err => {
        wx.showToast({
          title: '服务器错误',
          icon: 'none',
          duration: 2000
        })
        reject(err)
      },
    })
  })
  return promise
}
export function _request(requestObj, isRootBase) {
  var routeData = getCurrentPages()[getCurrentPages().length - 1];
  if (notUrlArr.indexOf(routeData.route) == -1){
    if (!wx.getStorageSync('userId')) {
      // wx.showModal({
      //   title: '提示',
      //   content: '未登录或登录失效，请登录',
      //   showCancel: true,
      //   success(res) {
      //     if (res.confirm) {
      //       wx.navigateTo({
      //         url: '/pages/login/login',
      //       })
      //     }
      //   },
      //   fail() {
      //     setTimeout(() => {
      //       wx.navigateBack()
      //     },1000 )
      //   }
      // })
      return new Promise(function (resolve, reject) {
        reject('未登录或登录失效，禁止调用');
      });
    } else {
      return createQuest(requestObj, isRootBase)
    }
  }else {
    return createQuest(requestObj, isRootBase)
  }
}
