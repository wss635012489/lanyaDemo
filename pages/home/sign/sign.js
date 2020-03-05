import { routerFillter } from '../../../assets/js/router.js'
import { token, hr_branch, isLogoin } from '../../../assets/js/public.js'
import { getSignInList, userSignIn, getSignBeanSatistics} from '../../../assets/js/api.js'
import { getBranchPersonalityCustom } from '../../../assets/js/publicRequest.js'
import Toast from '@vant/weapp/toast/toast';

const less_year = (new Date()).getFullYear();
const less_month = (new Date()).getMonth() + 1;
const less_day = (new Date()).getDate();
routerFillter({
  data: {
    hasEmptyGrid: false,
    cur_year: '',
    cur_month: '',
    todayIndex:'999', 
    showPop:false,
    signDays:[],
    reward:0,
    continue_day:0,
    integral_name:'积分'
  },
  onLoad(options) {
    this.setNowDate();
  },
  onShowCallBack(){
    if (isLogoin()) {
      this.init();
    }
    getBranchPersonalityCustom(data => {
      this.setData({
        integral_name: data.integral_name ? data.integral_name : '积分'
      })
    })
  },
  dateSelectAction: function (e) {
  //   var cur_day = e.currentTarget.dataset.idx;
  //  // console.log(`点击的日期:${this.data.cur_year}年${this.data.cur_month}月${cur_day}日`);
  //   if (e.currentTarget.dataset.daytype == 'bq'){
  //     if (this.data.cur_month != less_month || this.data.cur_year != less_year) {
  //       Toast('只能在当月进行补签');
  //       return;
  //     }
  //   }
  //   if (this.data.cur_year > less_year || this.data.cur_year < less_year){
  //     Toast('当前时间不可签到');
  //     return;
  //   } else if (this.data.cur_year == less_year){
  //     if (this.data.cur_month != less_month){
  //       Toast('当前时间不可签到');
  //       return;
  //     }else {
  //       if (cur_day > less_day ) {
  //         Toast('当前时间不可签到');
  //         return;
  //       }
  //       if (cur_day == less_day) {
  //         return;
  //       }
  //     }
  //   }
  //   var time = this.data.cur_year + '-' + (this.data.cur_month < 10 ? '0' + this.data.cur_month : this.data.cur_month) + '-' + (cur_day < 10 ? '0' + cur_day : cur_day)
  //   this.userSignInDay(time)
  },
  setNowDate: function () {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const todayIndex = date.getDate() - 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.setData({
      cur_year: cur_year,
      cur_month: cur_month,
      weeks_ch,
      todayIndex,
    })
  },

  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month) {
    let days = [];
    let signDays = this.data.signDays;
    //console.log(this.data.signDays)
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      let type = '';
      for(let j = 0; j < signDays.length; j++ ){
        if (i == parseInt((signDays[j].sign_time).split('-')[2])){
          if (signDays[j].if_complement == 1){
            type = 'bq'
          }
          if (signDays[j].if_complement == '0'){
            type = 'qd'
          }
        }
      }
      days.push({
        day: i,
        type: type
      });
    }
    //console.log(days)
    this.setData({
      days
    });
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    var newMonth = '';
    var newYear = '';
    if (handle === 'prev') {
      newMonth = cur_month - 1;
      newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })

    } else {
      newMonth = cur_month + 1;
      newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
    if (newMonth == less_month && newYear == less_year) {
      this.setData({
        todayIndex:less_day - 1
      })
    }else {
      this.setData({
        todayIndex: '999'
      })
    }

    this.init();
  },
  closePop(){
    this.setData({
      showPop:false
    })
  },
  openPop(){
    this.setData({
      showPop: true
    })
  },
  init(){
    var postData = {
      "token": token,
      "u_id": wx.getStorageSync('userId'),
      "cj_id": wx.getStorageSync('cj_id'),
      "sign_time": this.data.cur_year + '-' + (this.data.cur_month < 10 ? '0' + this.data.cur_month : this.data.cur_month)
    }
    this.initStatic(postData.sign_time)
    //console.log(postData)
    getSignInList(postData).then(res => {
      //console.log(res)
      if(res.data.code == 200){
       // console.log(res.data.object)
        this.setData({
          signDays: res.data.object
        })
      }
      this.calculateDays(this.data.cur_year, this.data.cur_month)
    }).catch(() => {
      this.calculateDays(this.data.cur_year, this.data.cur_month)
    })
  },
  userSignInDay(time){
    var postData = {
      "token": token,
      "u_id": wx.getStorageSync('userId'), // 会员id
      "cj_id": wx.getStorageSync('cj_id'), // 场景id
      "sign_time": time, // 签到时间 yyyy-MM-dd
      "type": 2, // 签到类型  0：取消签到，1：请假，2：签到，3：发礼品, 4:未签到回访
      "remarks": "", // 备注，例如请假原因 或 未签到回访后填写的原因
      "hr_branch": hr_branch
    }
    //console.log(postData)
    userSignIn(postData).then(res => {
      console.log(res)
      if(res.data.code == 200){
        this.openPop();
        this.setData({
          reward: res.data.object.signData.add_hd_num,
          continue_day: res.data.object.signData.continue_day
        })
        this.init();
      }
    })
  },
  goSign(){
    if(isLogoin()){
      var time = less_year + '-' + (less_month < 10 ? '0' + less_month : less_month) + '-' + (less_day < 10 ? '0' + less_day : less_day)
      this.userSignInDay(time)
    }
  },
  initStatic(time){
    var postData = {
      "token": token,//token
      "u_id": wx.getStorageSync('userId'),//当前用户id
      "invite_user_id": wx.getStorageSync('userId'),//邀请人id
      "cj_id": wx.getStorageSync('cj_id'),//门店id
      "sign_time": time,//签到月份
      "invite_time": time//邀请月份
    }
    //console.log(postData)
    getSignBeanSatistics(postData).then(res => {
      //console.log(res)
      if (res.data.code == 200) {
        this.setData({
          continue_day: res.data.object.currentMonthSignCount
        })
      }
    })
  }
})