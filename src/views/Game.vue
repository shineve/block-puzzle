<template>
  <div class="game-container">
    <Game />
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
