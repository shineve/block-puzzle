<template>
  <div class="tile"></div>
</template>

<style scoped>
.tile {
  /* height: 50px;
  width: 50px;
  background-color: #eee4da;
  color: #776e65;
   */
  position: absolute;
  width: calc(var(--pixel-size) * 12.5);
  height: calc(var(--pixel-size) * 12.5);
  margin: calc(var(--pixel-size) * 1);
  border-radius: calc(var(--pixel-size) * 0.5);
  background-color: #eee4da;
  color: #776e65;
  font-weight: bold;
  text-align: center;
  font-size: calc(var(--pixel-size) * 6);
  line-height: 2.1;
  transition-property: left, top, transform;
  transition-duration: 250ms, 250ms, 100ms;
  transform: scale(1);
}
</style>
