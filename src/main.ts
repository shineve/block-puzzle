import { createApp } from 'vue';
import App from './App.vue';
// @ts-ignore
import store from './store';

import '@/lib/swipedEvents.js';
import '@/assets/styles/index.css';

const app = createApp(App);

app.use(store);
app.mount('#app');
