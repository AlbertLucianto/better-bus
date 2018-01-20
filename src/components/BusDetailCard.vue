<template>
<div>
  <transition name="fade">
    <div class="busDetail__card" :style="cardStyle" :class="{ dragging }"
      @mousedown="startDrag" @touchstart="startDrag" ref="card" v-if="showCard">
      <div class="bus__icon">
        <svg class="crowdLevel">
          <circle class="level__bar" cx="50" cy="50" r="45"/>
          <circle class="level__value" cx="50" cy="50" r="45" :style="circleStyle"/>
        </svg>
        <div class="level__text">{{ displayLevel }}%</div>
        <bus-icon color="blue"/>
      </div>
    </div>
  </transition>
  <div class="list__nextBus" :style="cardStyle" v-if="active"
    :class="{ fade: showCard, dragging }"
    @mousedown="startDrag" @touchstart="startDrag">
    <div v-for="(_, idx) in new Array(3).fill(0)" :key="idx"
      class="nextBus__item" :class="{ last: idx === 2 }"></div>
  </div>
</div>
</template>

<script>
import BusIcon from './BusIcon';

const MAX_DASH_ARRAY = 280;
const MOUNTED_TIMEOUT_ANIMATE = 200;
const INTERVAL = 15;

export const TRESHOLD_SCROLL_Y = -150;

const mockedCrowdLevel = 75;

export default {
  props: {
    color: String,
    dragged: Object,
    startDrag: Function,
    dragging: Boolean,
    offsetX: Number,
    scrollY: Number,
    active: Boolean,
  },
  components: {
    BusIcon,
  },
  data() {
    return {
      crowdLevel: 0,
      displayLevel: 0,
      bottomCard: 1000,
    };
  },
  computed: {
    circleStyle() {
      const length = (this.crowdLevel / 100) * MAX_DASH_ARRAY;
      return {
        'stroke-dasharray': `${length} 1000`,
      };
    },
    cardStyle() {
      return {
        transform: `
          translateX(${this.dragged.x + this.offsetX}px)
          translateY(${this.dragged.y + this.scrollY}px)
        `,
      };
    },
    showCard() { return this.dragged.y + this.scrollY > TRESHOLD_SCROLL_Y; },
  },
  mounted() {
    setTimeout(() => {
      this.crowdLevel = mockedCrowdLevel;
      const itv = setInterval(() => {
        this.displayLevel += 1;
        if (this.displayLevel >= mockedCrowdLevel) clearInterval(itv);
      }, INTERVAL);
    }, MOUNTED_TIMEOUT_ANIMATE);
    this.$nextTick(() => {
      this.bottomCard = this.$refs.card.getBoundingClientRect().bottom;
    });
  },
};
</script>

<style lang="scss" scoped>
@import '../colors.scss';

.busDetail__card {
  user-select: none;
  position: absolute;
  z-index: 100;
  width: calc(100% - 80px);
  height: 180px;
  left: 42.5px;
  bottom: 50px;
  box-shadow: 0 20px 40px -15px rgba(0,0,0,.3);
  background: white;
  cursor: grab;
  &:not(.dragging) {
    transition: transform .1s ease-out;
  }
  .bus__icon {
    box-sizing: border-box;
    width: 140px;
    height: calc(100% + 5px);
    padding-top: 15px;
    transform: scale(1.1);
    box-shadow: 0 5px 30px -5px rgba(0,0,0,.3);
    background: #232222;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .crowdLevel {
      width: 100px;
      height: 100px;
      .level__bar {
        fill: rgba(0,0,0,0);
        stroke: #444;
        stroke-width: 5px;
      }
      .level__value {
        transition: stroke-dasharray 1s ease;
        transform: rotate(-90deg);
        transform-origin: 50% 50%;
        fill: rgba(0,0,0,0);
        stroke: $blue;
        stroke-width: 5px;
        stroke-linecap: round;
      }
    }
    .level__text {
      color: white;
      margin: 15px;
    }
  }
}

.list__nextBus {
  box-sizing: border-box;
  padding: 5px 10px;
  position: absolute;
  width: calc(100% - 30px);
  max-height: 40%;
  background: white;
  left: 15px;
  top: calc(100% - 20px);
  z-index: 100;
  border-radius: 5px;
  box-shadow: 0 5px 30px -5px rgba(0,0,0,.3);
  transition: opacity .5s ease;
  cursor: grab;
  .nextBus__item {
    height: 80px;
    border-bottom: 1px solid rgba(0,0,0,.075);
    &.last {
      border-bottom: none;
    }
  }
  &.fade {
    opacity: .5;
  }
  &:not(.dragging) {
    transition: opacity .5 ease, transform .5s ease .5s;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: all .5s ease;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
