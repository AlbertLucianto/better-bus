<template>
<div>
  <transition name="fade">
    <div class="busDetail__card" :style="cardStyle" :class="{ dragging }"
      @mousedown="startDrag" @touchstart="startDrag" ref="card" v-if="showMainCard">
      <div class="bus__icon" :style="busIconStyle">
        <svg class="crowdLevel">
          <circle class="level__bar" cx="50" cy="50" r="45"/>
          <circle class="level__value" cx="50" cy="50" r="45" :style="circleStyle" :class="color"/>
        </svg>
        <div class="level__text">{{ displayLevel }}%</div>
        <bus-icon :color="color"/>
      </div>
    </div>
  </transition>
  <arrow-icon class="arrow__icon" :style="arrowStyle"/>
  <div class="list__nextBus" :style="cardStyle" v-if="active"
    :class="{ fade: showMainCard, dragging }"
    @mousedown="startDrag" @touchstart="startDrag">
    <div v-for="(_, idx) in new Array(3).fill(0)" :key="idx"
      :style="getNextBusStyle(idx)" class="nextBus__item">
      <div class="bus__icon"></div>
    </div>
  </div>
</div>
</template>

<script>
import BusIcon from './BusIcon';
import ArrowIcon from './ArrowIcon';

const MAX_DASH_ARRAY = 280;
const MOUNTED_TIMEOUT_ANIMATE = 200;
const INTERVAL = 15;
const DAMP_ICON_X = 10;

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
    ArrowIcon,
  },
  data() {
    return {
      crowdLevel: 0,
      displayLevel: 0,
    };
  },
  watch: {
    active(val) {
      if (!val) {
        this.crowdLevel = 0;
        this.displayLevel = 0;
      } else this.setCrowdLevel();
    },
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
    arrowStyle() {
      const scrolled = this.dragged.y + this.scrollY;
      return {
        ...this.cardStyle,
        opacity: 1 - (scrolled / TRESHOLD_SCROLL_Y),
      };
    },
    busIconStyle() {
      return {
        'margin-left': `${(this.dragged.x + this.offsetX) / DAMP_ICON_X}px`,
      };
    },
    showMainCard() { return this.dragged.y + this.scrollY > TRESHOLD_SCROLL_Y; },
    getNextBusStyle() {
      return idx => ({
        transform: `translateY(${this.showMainCard ? idx * 100 : 0}px)`,
        'transition-delay': `${idx * 50}ms`,
        opacity: this.showMainCard ? 1 / (idx + 2) : 1,
      });
    },
  },
  methods: {
    setCrowdLevel() {
      this.crowdLevel = mockedCrowdLevel;
      const itv = setInterval(() => {
        this.displayLevel += 1;
        if (this.displayLevel >= mockedCrowdLevel) clearInterval(itv);
      }, INTERVAL);
    },
  },
  mounted() {
    setTimeout(() => {
      if (this.active) this.setCrowdLevel();
    }, MOUNTED_TIMEOUT_ANIMATE);
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
        &.blue { stroke: $blue; }
        &.red { stroke: $red; }
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
  left: 15px;
  top: calc(100% - 12.5px);
  z-index: 100;
  cursor: grab;
  .nextBus__item {
    height: 80px;
    margin-bottom: 10px;
    border-radius: 2px;
    box-shadow: 0 5px 30px -5px rgba(0,0,0,.2);
    background: white;
    transition: transform .3s ease, opacity .35s ease;
    .bus__icon {
      box-sizing: border-box;
      width: 100px;
      height: 100%;
      box-shadow: 0 5px 30px -5px rgba(0,0,0,.3);
      background: #232222;
    }
  }
}
.arrow__icon {
  position: absolute;
  bottom: 16px;
  left: 50%;
  z-index: 9;
}

.fade-enter-active, .fade-leave-active {
  transition: all .5s ease;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
