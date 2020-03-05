import { getUserInfo} from './api.js'

export var hr_branch = '491250de444c4c2e956bc90878f50f99'; //测试一部  57d4e01126a34f4d95bd2ebe2d4df980   民康 491250de444c4c2e956bc90878f50f99
export var notUrlArr = [
  "pages/index/index",
  "pages/login/login",
  "pages/checkLogin/checkLogin",
  "pages/register/register",
  "pages/home/shop/shop",
  "pages/home/healthy/healthy",
  "pages/home/sign/sign",
  "pages/home/self/self",
  "pages/verification/verification",
  "pages/shopSearch/shopSearch",
  "pages/shopSearchCont/shopSearchCont",
  "pages/commDetail/commDetail"
  
]
export var token = '2342465ddsgdhry3w';
export var defaultUserHeadeUrl = "https://www.vip448.cn/photo/xcx_head.png";

export function isImgOrViode(url) {//判断是图片还是视频
  var arr = url.split('.');
  if (arr[arr.length - 1].toLowerCase() == 'mp4') {
    return false
  } else {
    return true
  }
}
export function getCurTime(isDay) { //返回年月或年月日
  var year = (new Date()).getFullYear();
  var month = (new Date()).getMonth() + 1;
  month = (month < 10 ? '0' + month : month)
  if (isDay) {
    var day = (new Date()).getDate();
    day = (day < 10 ? '0' + day : day)
    return year + '-' + month + '-' + day;
  }
  return year + '-' + month;
}
export function getDateInDatetimes(time, isReturnS) {
  if (time) {
    var date = new Date(time);
  } else {
    var date = new Date();
  }
  var year = date.getFullYear();
  var month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  var day = (date.getDate()) < 10 ? '0' + date.getDate() : date.getDate();
  if (isReturnS) {
    var h = (date.getHours()) < 10 ? '0' + date.getHours() : date.getHours();
    var f = (date.getMinutes()) < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = (date.getSeconds()) < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return year + '-' + month + '-' + day + ' ' + h + ':' + f + ':' + s;
  } else {
    return year + '-' + month + '-' + day
  }

}
export function getDateInDateAndtimes(time, isReturnF) {
  if (time) {
    var date = new Date(time);
  } else {
    var date = new Date();
  }
  var year = date.getFullYear();
  var month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  var day = (date.getDate()) < 10 ? '0' + date.getDate() : date.getDate();
  if (isReturnF) {
    var h = (date.getHours()) < 10 ? '0' + date.getHours() : date.getHours();
    var f = (date.getMinutes()) < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = (date.getSeconds()) < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return year + '-' + month + '-' + day + ' ' + h + ':' + f;
  } else {
    return year + '-' + month + '-' + day
  }

}
export function getInTimeRetDate(time, isDay) {//根据时间返回年月日或年月
  var year = (new Date(time)).getFullYear();
  var month = (new Date(time)).getMonth() + 1;
  month = (month < 10 ? '0' + month : month)
  if (isDay) {
    var day = (new Date(time)).getDate();
    day = (day < 10 ? '0' + day : day)
    return year + '-' + month + '-' + day;
  }
  return year + '-' + month;
}
export function getMonthLength(date) { //获取指定日期的总共天数
  if (date) {
    var d = new Date(date);
  } else {
    var d = new Date();
  }
  // 将日期设置为下月一号
  d.setMonth(d.getMonth() + 1)
  d.setDate('1')
  // 获取本月最后一天
  d.setDate(d.getDate() - 1)
  return d.getDate()
}
export function isPoneAvailable(phoneNumber) {//验证手机号码
  var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
  if (!myreg.test(phoneNumber)) {
    return false;
  } else {
    return true;
  }
}
export function popleCardNum(card) {
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X 
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!reg.test(card)) {
    return false;
  }
  return true
}
export function formatSeconds(s, isshowH) {//根据毫秒数返回时分秒
  var t = '';
  if (s > -1) {
    var hour = Math.floor(s / 3600);
    var min = Math.floor(s / 60) % 60;
    var sec = s % 60;
    if (isshowH) {
      if (hour < 10) {
        t = '0' + hour + ":";
      } else {
        t = hour + ":";
      }
    }
    if (min < 10) { t += "0"; }
    t += min + ":";
    if (sec < 10) { t += "0"; }
    t += sec;
  }
  return t;
}
export function formatTwoTimeMath(time_01, time_02) {//比较时间大小
  var d1 = new Date(time_01);
  var d2 = new Date(time_02);
  return parseInt(d2 - d1)
}
export function jsGetAge(strBirthday) {   /*根据出生日期算出年龄*/
  var returnAge;
  var strBirthdayArr = strBirthday.split("-");
  var birthYear = strBirthdayArr[0];
  var birthMonth = strBirthdayArr[1];
  var birthDay = strBirthdayArr[2];

  var d = new Date();
  var nowYear = d.getFullYear();
  var nowMonth = d.getMonth() + 1;
  var nowDay = d.getDate();

  if (nowYear == birthYear) {
    returnAge = 0;//同年 则为0岁
  }
  else {
    var ageDiff = nowYear - birthYear; //年之差
    if (ageDiff > 0) {
      if (nowMonth == birthMonth) {
        var dayDiff = nowDay - birthDay;//日之差
        if (dayDiff < 0) {
          returnAge = ageDiff - 1;
        }
        else {
          returnAge = ageDiff;
        }
      }
      else {
        var monthDiff = nowMonth - birthMonth;//月之差
        if (monthDiff < 0) {
          returnAge = ageDiff - 1;
        }
        else {
          returnAge = ageDiff;
        }
      }
    }
    else {
      returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
    }
  }
  return returnAge;//返回周岁年龄
}
export function isObjEqual(o1, o2) {//比较对象是否相等
  var props1 = Object.getOwnPropertyNames(o1);
  var props2 = Object.getOwnPropertyNames(o2);
  if (props1.length != props2.length) {
    return false;
  }
  for (var i = 0, max = props1.length; i < max; i++) {
    var propName = props1[i];
    if (o1[propName] !== o2[propName]) {
      return false;
    }
  }
  return true;
}
export function getUser(phoneNumber,callBack){
  var postData = {
    "hr_branch": hr_branch,
    "login_name": "+86-" + phoneNumber
  }
  getUserInfo(postData).then(res => {
    if(res.data.code == 200){
      callBack(res)
    }
  })
}
export function isLogoin(){
  if (!wx.getStorageSync('userId')) {
    wx.showModal({
      title: '提示',
      content: '未登录或登录失效，请登录',
      showCancel: false,
      showCancel: true,
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      },
      fail() {
        console.log('取消登录')
      }
    })
    return false;
  }else {
    return true
  }
}
export function isLogoin_02() {
  if (!wx.getStorageSync('userId')) {
    return false;
  } else {
    return true
  }
}

