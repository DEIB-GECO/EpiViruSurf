import Vue from 'vue'
import './plugins/vuetify'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import VueClipboard from 'vue-clipboard2'
import draggable from 'vuedraggable'

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

Vue.use(VueClipboard);
Vue.use(draggable);