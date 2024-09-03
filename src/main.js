import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import { registerValidationRules } from '@/plugins/vee-validate';
import FloatingVue from 'floating-vue';
import axios from 'axios';  
import { useMonaco } from './plugins/monaco';
useMonaco();

registerValidationRules();

const app = createApp(App);

// Axios global 
app.config.globalProperties.$axios = axios;

app.use(store).use(FloatingVue).mount('#app');
