import Vue from 'vue'
import App from './App.vue'
import AV from 'leancloud-storage'
import axios from 'axios'

Vue.prototype.$http = axios;  //其他页面在使用axios的时候直接  this.$http就可以了

var APP_ID = 'VKJfEk81YqWIqkxLtqxlyGpH-gzGzoHsz';
var APP_KEY = 'H1hrm0dJWbnpzFAS6jJRsmuD';      
//初始化
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});
new Vue({
  el: '#app', 
  render: h => h(App)
})
