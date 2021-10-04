<template>
  <div class="grid-container">
    <div class="grid-cell" v-for="(cell, index) in 16" :key="index"></div>
  </div>
</template>

<style scoped>
.grid-container {
  @apply flex flex-wrap border-8 rounded-md;
  background-color: #bbada0;
  border-color: #bbada0;
}

.grid-cell {
  @apply rounded m-2 bg-white bg-opacity-30;
  width: calc(var(--pixel-size) * 12.5);
  height: calc(var(--pixel-size) * 12.5);
}
</style>
