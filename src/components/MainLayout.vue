<template>
  <v-app>
    <v-main>
   
      <router-view></router-view> <!-- Ici, les composants routés seront affichés -->
    </v-main>
  </v-app>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',
});
</script>

<style>
/* Ajoutez vos styles ici */
</style>
