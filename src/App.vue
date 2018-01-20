<template>
  <div id="app">
    <div class="app__container" ref="container">
      <bus-map v-for="(color, idx) in busColors" :key="idx"
        v-if="active === idx" :color="busColors[active]"/>
      <bus-detail-card v-for="(color, idx) in busColors" :startDrag="startDrag"
        :key="color" :offsetX="getTransformOffset(idx)" :scrollY="scrollY" :active="active === idx"
        :orientation="orientation" :color="color" :dragged="pos"
        :dragging="dragging"/>
      <div class="bottomOverlay"></div>
    </div>
  </div>
</template>

<script>
// import dynamics from 'dynamics.js';

import BusMap from '@/components/BusMap';
import BusDetailCard, { TRESHOLD_SCROLL_Y } from '@/components/BusDetailCard';

const CHANGE_LINE_TRESHOLD = 100;
const HORIZONTAL = 'horizontal';
const VERTICAL = 'vertical';
const ORIENTATION_TRESHOLD = 10;

export default {
  components: {
    BusMap,
    BusDetailCard,
  },
  name: 'App',
  data() {
    return {
      active: 0,
      busColors: ['blue', 'red'],
      dragging: '',
      start: { x: 0, y: 0 },
      pos: { x: 0, y: 0 },
      bufferMove: { x: 0, y: 0 },
      scrollY: 0,
      screenWidth: 0,
      orientation: HORIZONTAL,
    };
  },
  computed: {
    getTransformOffset() {
      const padding = 50;
      return idx => (idx - this.active) * (this.screenWidth - padding);
    },
  },
  methods: {
    startDrag(e) {
      const evt = e.changedTouches ? e.changedTouches[0] : e;
      this.dragging = true;
      this.start.x = evt.pageX - this.bufferMove.x;
      this.start.y = evt.pageY - this.bufferMove.y;
      window.addEventListener('mousemove', this.onDrag);
      window.addEventListener('mouseup', this.onRelease);
      window.addEventListener('touchmove', this.onDrag);
      window.addEventListener('touchend', this.onRelease);
    },
    onDrag(e) {
      e.stopPropagation();
      if (this.dragging) {
        const evt = e.changedTouches ? e.changedTouches[0] : e;
        this.bufferMove.x = evt.pageX - this.start.x;
        this.bufferMove.y = evt.pageY - this.start.y;
        if (!this.orientation && Math.abs(this.bufferMove.y) > ORIENTATION_TRESHOLD) {
          this.orientation = VERTICAL;
        } else if (!this.orientation && Math.abs(this.bufferMove.x) > ORIENTATION_TRESHOLD) {
          this.orientation = HORIZONTAL;
        }
        if (this.orientation === HORIZONTAL) this.pos.x = this.bufferMove.x;
        else if (this.orientation === VERTICAL
        && (this.scrollY + this.pos.y > TRESHOLD_SCROLL_Y - 100
        || this.bufferMove.y - this.pos.y > 0)) {
          this.pos.y = this.bufferMove.y;
        }
      }
    },
    onRelease() {
      if (this.dragging) {
        this.dragging = false;
        if (this.orientation === HORIZONTAL) {
          if (Math.abs(this.bufferMove.x) > CHANGE_LINE_TRESHOLD) {
            if (this.bufferMove.x > 0) this.prevLine();
            else this.nextLine();
          }
          this.pos.x = 0;
        } else if (this.orientation === VERTICAL) {
          if (this.pos.y > TRESHOLD_SCROLL_Y && this.scrollY >= 0) {
            this.scrollY = 0;
          } else {
            this.scrollY = Math.min(this.scrollY + this.pos.y, 0);
          }
          this.pos.y = 0;
        }
        this.clearBufferMove();
        this.orientation = '';
      }
    },
    clearBufferMove() {
      this.bufferMove.x = 0;
      this.bufferMove.y = 0;
    },
    prevLine() {
      this.active = Math.max(this.active - 1, 0);
      this.scrollY = 0;
    },
    nextLine() {
      this.active = Math.min(this.active + 1, this.busColors.length - 1);
      this.scrollY = 0;
    },
  },
  mounted() {
    this.$nextTick(() => {
      const container = this.$refs.container;
      this.screenWidth = container.getBoundingClientRect().width;
    });
  },
};
</script>

<style lang="scss">
@import './colors.scss';

body {
  margin: 0;
  background-color: #FAFAFD;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}
.app__container {
  position: relative;
  background: rgb(214,214,214);
  width: 414px;
  height: 720px;
  max-height: 100%;
  max-width: 100%;
  box-shadow: 0 12px 50px -20px rgba(0,0,0,.4);
  border-radius: 5px;
  overflow: hidden;
}
.bottomOverlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 300px;
  background: linear-gradient(5deg, rgb(240,240,240) 40%, rgba(240,240,240,0) 90%);
}
</style>
