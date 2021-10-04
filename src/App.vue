<template>
  <div class="App h-full mx-auto">
    <div class="container flex flex-col items-center justify-center px-4 h-full bg-blue-50">
      <Game></Game>
    </div>
  </div>
</template>

<script lang="ts">
import Game from '@/components/Game.vue';

export default {
  components: {
    Game,
  },
};
</script>

<style>
:root {
  --pixel-size: 8px;
}
</style>