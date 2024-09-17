import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import { registerValidationRules } from '@/plugins/vee-validate';
import FloatingVue from 'floating-vue';
import axios from 'axios';
import { useMonaco } from './plugins/monaco';
import router from './router'; 
import Toast, { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css'; 

useMonaco();
registerValidationRules();

const app = createApp(App);


app.config.globalProperties.$axios = axios;
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const toastOptions = {
  position: 'top-right',  
  timeout: 3000,          
};

app.use(router)
   .use(store)
   .use(FloatingVue)
   .use(Toast, toastOptions)  
   .mount('#app');
