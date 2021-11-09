import { createWebHistory, createRouter } from 'vue-router';
import Welcome from '@/views/Welcome.vue';
import Game from '@/views/Game.vue';

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: Welcome,
  },
  {
    path: '/game',
    name: 'Game',
    component: Game,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
