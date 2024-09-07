import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import your router configuration
import vuetify from './plugins/vuetify'; // Import Vuetify

const app = createApp(App);

app.use(router); // Use the router
app.use(vuetify);

app.mount('#app');
