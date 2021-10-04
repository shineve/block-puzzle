<template>
  <Board :tiles="tiles"></Board>
</template>

<script lang="ts">
import { uniqueId } from 'lodash';
import { reactive } from 'vue';
import Tile from '@/types/Tile';
import Board from '@/components/Board.vue';

export default {
  components: {
    Board,
  },
  setup() {
    const tiles: Tile[] = reactive([
      {
        position: [0, 0],
        value: 2,
        id: uniqueId(),
      },
    ]);

    return {
      tiles,
    };
  },
};
</script>

<style lang="css" scoped></style>
