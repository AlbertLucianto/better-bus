<template>
<div class="googleMap__container">
  <transition name="fade">
    <gmap-map :center="center" :zoom="zoom" class="google__map" v-if="isMounted">
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
  props: {
    color: String,
  },
  data() {
    return {
      isMounted: false,
      path: busRoute,
      center: { lat: 1.346, lng: 103.683 },
      zoom: 15,
      options: {
        strokeColor: colors[`$${this.color}`],
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
    width: calc(100% + 20px);
    height: calc(100% + 40px);
    margin-top: -40px;
    margin-left: -10px;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: all 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: scale(.95);
}
</style>
