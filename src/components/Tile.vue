<template>
  <div class="tile" :style="tileStyle" :class="[`tile-${value}`]">
    {{ value }}
  </div>
</template>

<script lang="ts">
import { ref, toRefs, computed, PropType, onMounted, watch, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { TileMeta } from '@/types/Tile';
export default defineComponent({
  name: 'Tile',
  props: {
    position: {
      type: Object as PropType<[number, number]>,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
  },
  setup(props: TileMeta) {
    const store = useStore();
    let scale = ref(1);
    let documentWidth = ref(0);
    let rem = ref(16);
    let size = ref(0);

    watch(
      () => props.value,
      (newValue, oldValue) => {
        if (newValue !== oldValue) {
          animateTile();
        }
      },
    );

    onMounted(() => {
      animateTile();
    });

    const animateTile = () => {
      scale.value = 1.1;
      setTimeout(() => {
        scale.value = 1;
      }, 100);
    };

    const positionToPixels = (position: number) => {
      return (position / 4) * store.getters['boardSize'];
    };

    const tileStyle = computed(() => {
      return {
        left: positionToPixels(props.position[0]) + 'px',
        top: positionToPixels(props.position[1]) + 'px',
        transform: `scale(${scale.value})`,
        zIndex: props.id,
      };
    });

    return {
      tileStyle,
      position: props.position,
    };
  },
});
</script>

<style scoped>
.tile {
  /* height: 50px;
  width: 50px;
  background-color: #eee4da;
  color: #776e65;
   */
  @apply m-2 absolute rounded font-bold text-center flex items-center justify-center text-4xl;
  /* position: absolute; */
  /* left: calc(attr(data-position-x) / 4 * 100%);
  top: calc(attr(data-position-y) / 4 * 100%); */
  width: var(--tile-size);
  height: var(--tile-size);
  /* width: calc(var(--pixel-size) * 12.5);
  height: calc(var(--pixel-size) * 12.5); */
  /* margin: 0.5rem; */
  /* border-radius: calc(var(--pixel-size) * 0.5); */
  background-color: #daddee;
  color: #776e65;
  /* font-weight: bold;
  text-align: center; */
  /* font-size: calc(var(--pixel-size) * 6); */
  /* line-height: 2.1; */
  transition-property: left, top, transform;
  transition-duration: 250ms, 250ms, 100ms;
  transform: scale(1);

  /* -=-=-=- START OF TEXT SIZE -=-=-=- */
  &-128,
  &-256,
  &-512 {
    @apply text-4xl;
    /* font-size: 2.25rem; */
    /* font-size: calc(var(--pixel-size) * 5.5); */
    /* line-height: 2.28; */
  }

  &-1024,
  &-2048 {
    /* font-size: 1.75rem; */
    @apply text-2xl;
    /* font-size: calc(var(--pixel-size) * 4); */
    /* line-height: 3.18; */
  }
  /* -=-=-=-= END OF TEXT SIZE =-=-=-=- */

  &-2 {
    background: #eee4da;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0), inset 0 0 0 1px rgba(255, 255, 255, 0);
  }

  &-4 {
    background: #ede0c8;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0), inset 0 0 0 1px rgba(255, 255, 255, 0);
  }

  &-8 {
    color: #f9f6f2;
    background: #f2b179;
  }

  &-16 {
    color: #f9f6f2;
    background: #f59563;
  }

  &-32 {
    color: #f9f6f2;
    background: #f67c5f;
  }

  &-64 {
    color: #f9f6f2;
    background: #f65e3b;
  }

  &-128 {
    color: #f9f6f2;
    background: #edcf72;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.2381),
      inset 0 0 0 1px rgba(255, 255, 255, 0.14286);
  }

  &-256 {
    color: #f9f6f2;
    background: #edcc61;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.31746),
      inset 0 0 0 1px rgba(255, 255, 255, 0.19048);
  }

  &-512 {
    color: #f9f6f2;
    background: #edc850;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.39683),
      inset 0 0 0 1px rgba(255, 255, 255, 0.2381);
  }

  &-1024 {
    color: #f9f6f2;
    background: #edc53f;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.47619),
      inset 0 0 0 1px rgba(255, 255, 255, 0.28571);
  }

  &-2048 {
    color: #f9f6f2;
    background: #edc22e;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.55556),
      inset 0 0 0 1px rgba(255, 255, 255, 0.33333);
  }
}
</style>
