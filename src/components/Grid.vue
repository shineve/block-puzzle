<template>
  <div class="grid-container">
    <div
      v-for="(cell, index) in totalCells"
      :key="index"
      class="grid-cell"
    />
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
export default {
  props: {
    tileCountPerRowOrColumn: {
      type: Number,
      default: 4,
    },
  },
  setup(props) {
    const totalCells = ref(props.tileCountPerRowOrColumn * props.tileCountPerRowOrColumn);
    return {
      totalCells,
    };
  },
};
</script>

<style scoped>
.grid-container {
  @apply flex flex-wrap border-8 rounded-md;
  background-color: #bbada0;
  border-color: #bbada0;
}

.grid-cell {
  --tile-size: calc(25% - 1rem);
  @apply rounded m-2 bg-white bg-opacity-30;
  width: var(--tile-size);
  height: var(--tile-size);
  /* width: calc(var(--pixel-size) * 12.5); */
  /* height: calc(var(--pixel-size) * 12.5); */
}
</style>
