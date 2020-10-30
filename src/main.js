// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap';
import VeeValidate from 'vee-validate';
import zhTW from 'vee-validate/dist/locale/zh_TW';
import VueI18n from 'vue-i18n';


import App from './App';
import router from './router';
import './bus';
import currencyFilter from './filters/currency';
import dateFilter from './filters/date';

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(VueI18n)
const i18n = new VueI18n({
     locale: 'zhTW'
})
Vue.use(VeeValidate, {
  events: 'input|blur', //這是為了讓使用者離開該欄位時觸發驗證
  i18n,
  dictionary: {
    zhTW
  }
});

Vue.component('Loading', Loading);         // 以全域的方式啟用他
Vue.filter('currency', currencyFilter); // 以全域的方式啟用他
//            自訂名稱  , import 名稱
Vue.filter('date', dateFilter);


axios.defaults.withCredentials = true; // 請求附帶cookie(對應登入頁)
/* eslint-disable no-new */
new Vue({
  i18n,
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

// 加入導航守衛
router.beforeEach((to, from, next) => {
  console.log('to', to, 'from', from, 'next', next);
  if(to.meta.requiresAuth){
    console.log('這裡需要驗證');
    const api = `${process.env.APIPATH}/api/user/check`;
    axios.post(api).then((response) => {
      console.log(response.data);
      if(response.data.success){
        console.log('已登入');
        next();
      }else {
        next({
          path: '/login',
        });
      };
    });
  } else{
    next();
  };
})