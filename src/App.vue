<template>
  <div class="App h-full mx-auto container flex flex-col items-center justify-center bg-blue-50">
    <header />
    <main class="flex flex-col items-center justify-center px-4 w-full h-full bg-blue-50">
      <router-view />
    </main>
    <footer />
  </div>
</template>

<script lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    const onWindowResize = () => {
      store.dispatch('getBoardSize');
    };

    onMounted(() => {
      store.dispatch('getBoardSize');
      window.addEventListener('resize', onWindowResize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', onWindowResize);
    });
  },
};
</script>
