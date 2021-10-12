<template>
  <div class="App h-full mx-auto container flex flex-col items-center justify-center bg-blue-50">
    <header />
    <main class="flex flex-col items-center justify-center px-4 w-full h-full bg-blue-50">
      <div class="game-container">
        <Game />
      </div>
    </main>
    <footer />
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

<style scoped>
.game-container {
  @apply h-full w-full;
  max-width: 480px;
  max-height: 480px;
}
</style>
