<template>
<div class="googleMap__container">
  <transition name="fade">
    <gmap-map :center="center" :zoom="15" class="google__map" v-if="isMounted">
      <gmap-polyline :path="path" :options="options">
      </gmap-polyline>
    </gmap-map>
  </transition>
</div>
</template>

<script>
import busRoute from './bus.route';

const colors = {
  $blue: 'rgb(0,122,255)',
  $pink: 'rgb(255,45,85)',
  $red: 'rgb(255,59,48)',
  $purple: 'rgb(88,86,214)',
  $orange: 'rgb(255,149,0)',
};

const TIMEOUT_MOUNTED = 100;

export default {
  data() {
    return {
      isMounted: false,
      path: busRoute,
      center: { lat: 1.343, lng: 103.683 },
      options: {
        strokeColor: colors.$blue,
      },
    };
  },
  mounted() {
    setTimeout(() => { this.isMounted = true; }, TIMEOUT_MOUNTED);
  },
};
</script>

<style lang="scss" scoped>
@import '../colors.scss';

.googleMap__container {
  width: 100%;
  height: 100%;
  .google__map {
    width: 100%;
    height: 100%;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
