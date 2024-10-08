import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Assurez-vous que le chemin est correct
import vuetify from './plugins/vuetify'; // Assurez-vous que le chemin est correct
import { loadFonts } from './plugins/webfontloader'; // Pour charger les polices d'icônes
import { createPinia } from 'pinia';

loadFonts();
const pinia = createPinia();


createApp(App)
  .use(router)
  .use(vuetify)
  .use(pinia)
  .mount('#app');

 
  