<template>
<div class="googleMap__container">
  <transition name="fade">
    <gmap-map :center="center" :zoom="zoom" class="google__map" v-if="isMounted">
      <gmap-polyline :path="path" :options="options">
      </gmap-polyline>
      <map-marker v-for="(m, idx) in markers" :key="idx" class="mapMarker"
        :position="m.position" :icon="`/static/bus_icon_${color}.png`"/>
    </gmap-map>
  </transition>
</div>
</template>

<script>
import busRoutes from './bus.route';

const colors = {
  $blue: 'rgb(0,122,255)',
  $pink: 'rgb(255,45,85)',
  $red: 'rgb(255,59,48)',
  $purple: 'rgb(88,86,214)',
  $orange: 'rgb(255,149,0)',
};

const TIMEOUT_MOUNTED = 100;
const BUS_UPDATE_INTERVAL = 50;
const NEXT_POS_DISTANCE_TRESHOLD = 0.00005;
const NEXT_POS_FRACTION = 0.04;

const mockBusStarts = [10, 50, 100];

const calcDistance = (start, end) => Math.sqrt(
  ((start.lng - end.lng) ** 2)
  + ((start.lat - end.lat) ** 2));

const getPosBetween = (start, end, frac) => ({
  lng: start.lng + ((end.lng - start.lng) * frac),
  lat: start.lat + ((end.lat - start.lat) * frac),
});

const mod = (num, div) => ((num % div) + div) % div;

export default {
  props: {
    color: String,
  },
  data() {
    return {
      isMounted: false,
      path: busRoutes,
      center: { lat: 1.346, lng: 103.683 },
      zoom: 15,
      options: {
        strokeColor: colors[`$${this.color}`],
      },
      markers: mockBusStarts.map(idx => ({ position: busRoutes[mockBusStarts[idx]] })),
    };
  },
  methods: {
    setBusPos(whichBus, position) {
      this.markers[whichBus].position = position;
    },
  },
  mounted() {
    const direction = this.color === 'red' ? 1 : -1;
    mockBusStarts.forEach((idx, whichBus) => {
      setTimeout(() => { this.isMounted = true; }, TIMEOUT_MOUNTED);
      let busPosIdx = idx;
      let start = busRoutes[mod(busPosIdx, busRoutes.length)];
      let end = busRoutes[mod(busPosIdx + direction, busRoutes.length)];
      setInterval(() => {
        let position;
        if (calcDistance(start, end) > NEXT_POS_DISTANCE_TRESHOLD) {
          start = getPosBetween(start, end, NEXT_POS_FRACTION);
          position = start;
        } else {
          busPosIdx += direction;
          position = busRoutes[mod(busPosIdx, busRoutes.length)];
          start = position;
          end = busRoutes[mod(busPosIdx + direction, busRoutes.length)];
        }
        this.setBusPos(whichBus, position);
      }, BUS_UPDATE_INTERVAL);
    });
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
    .mapMarker {
      width: 10px;
      transform: translateX(50px);
    }
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
