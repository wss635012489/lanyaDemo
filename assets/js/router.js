import { notUrlArr } from './public.js';
/**
 * routerFillter --全局路由拦截器
 * @function
 * @param{Object} pageObj 当前页面的page对象
 */
exports.routerFillter = function (pageObj) {
  pageObj.onShow = function () {
    var routeData = getCurrentPages()[getCurrentPages().length - 1]
    //console.log(routeData)
    if (notUrlArr.indexOf(routeData.route) == -1){
      if (!wx.getStorageSync('userId')){
        wx.showModal({
          title: '提示',
          content: '未登录或登录失效，请登录',
          showCancel:false,
          showCancel:true,
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }
          },
        })
      }
    }
    if (wx.getStorageSync('userId')){
      if (pageObj.onShowCallBack) {//重新封装的onShow
        pageObj.onShowCallBack.bind(this)()
      }
    }
  }
  return Page(pageObj)
}