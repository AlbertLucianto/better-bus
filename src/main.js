// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import * as VueGoogleMaps from 'vue2-google-maps';
import Vue from 'vue';
import App from './App';

Vue.config.productionTip = false;
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBzlLYISGjL_ovJwAehh6ydhB56fCCpPQw',
  },
});
Vue.component('map-marker', VueGoogleMaps.Marker);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
});
