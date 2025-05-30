import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router';


Vue.use(ElementUI);

Vue.config.productionTip = false

import './assets/css/reset.css'


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
