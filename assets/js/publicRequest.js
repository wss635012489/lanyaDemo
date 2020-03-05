import { getSysBranchCustom, getWeMiniUser } from './api';
import { hr_branch } from './public';
const app = getApp();

export function getBranchPersonalityCustom(callBack) {//获取部个性定制
  var postData = {
    "hr_branch": hr_branch
  }
  getSysBranchCustom(postData).then(res => {
    //console.log(res);
    if (res.data.code == 200) {
      if (callBack) {
        callBack(res.data.object);
      }
    }
  })
}
export function getOpenId(callBack){
  wx.login({
    success: res => {
      //console.log(res)
      getWeMiniUser({ code: res.code, hr_branch }).then(res => {
        if (res.data.code == 200) {
          app.globalData.openId = res.data.object.openid;
          if (callBack){
            callBack()
          }
        }
      })
    }
  })
}