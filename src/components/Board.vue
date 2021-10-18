<template>
  <div class="board" id="board">
    <div class="tile-container">
      <Tile v-for="tile in tiles" :key="tile.id" v-bind="tile"></Tile>
    </div>
    <Grid :tileCountPerRowOrColumn="tileCountPerRowOrColumn"></Grid>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { TileMeta } from '@/types/Tile';
import Grid from '@/components/Grid.vue';
import Tile from '@/components/Tile.vue';
export default {
  components: {
    Grid,
    Tile,
  },
  props: {
    tiles: {
      type: Object as PropType<TileMeta[]>,
      default: [],
      required: true,
    },
    tileCountPerRowOrColumn: {
      type: Number,
      default: 4,
    },
  },
};
</script>

<style scoped>
.board {
  @apply relative overflow-hidden rounded-md aspect-w-1	aspect-h-1 w-full;
}

.tile-container {
  --tile-container-size: calc(100% - 1rem);
  
  @apply absolute z-10 inset-0 m-2;

  width: var(--tile-container-size);
  height: var(--tile-container-size);
}
</style>

<style>
.tile-container {
  --tile-size: calc(25% - 1rem);
}
</style>
