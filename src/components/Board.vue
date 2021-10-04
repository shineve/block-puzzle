<template>
  <div class="board">
    <div class="tile-container">
      <Tile></Tile>
    </div>
    <Grid></Grid>
  </div>
</template>

<script lang="ts">
import Grid from '@/components/Grid.vue';
import Tile from '@/components/Tile.vue';
export default {
  components: {
    Grid,
    Tile,
  },
  props: {
    tileCountPerRow: {
      type: Number,
      default: 4,
    },
  },
};
</script>

<style scoped>
.board {
  @apply relative overflow-hidden rounded-md;
  width: 480px;
  height: 480px;
}

.tile-container {
  @apply absolute z-10 inset-0 m-2;
}
</style>
