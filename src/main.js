import Vue from 'vue'
import App from './App.vue'
// import router from './router.js'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faProcedures, faSadTear, faBed, faVial, faHeadSideCough} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
 
library.add(faUser);
library.add(faProcedures);
library.add(faSadTear);
library.add(faBed);
library.add(faVial);
library.add(faHeadSideCough);
 
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  // router,
  render: h => h(App),
}).$mount('#app')
