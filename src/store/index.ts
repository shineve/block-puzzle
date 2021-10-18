import { createStore, createLogger } from 'vuex';
const debug = process.env.NODE_ENV !== 'production';
import env from './modules/env';

export default createStore({
  modules: { env },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
