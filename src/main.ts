import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import '@/lib/SwipedEvents.js';
import '@/assets/styles/index.css';

const app = createApp(App);

app.use(store);
app.mount('#app');
