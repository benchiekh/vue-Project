<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height class="landing-page">
        <v-row align="center" justify="center">
          <v-col cols="12" md="6" class="text-center">
            <v-card class="pa-5" outlined>
              
              <v-card-subtitle>
                <h1>Bienvenue sur notre site</h1>
                <p class="subheading">Votre solution ultime pour la gestion des utilisateur  et des Produits.</p>
              </v-card-subtitle>
              <v-card-actions>
                <v-btn @click="goToRegister" color="primary" class="mx-2">
                  <v-icon left>mdi-account-plus</v-icon>
                  S'inscrire
                </v-btn>
                <v-btn @click="goToLogin" color="secondary" class="mx-2">
                  <v-icon left>mdi-login</v-icon>
                  Se connecter
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LandingPage',
  methods: {
    goToRegister() {
      this.$router.push({ name: 'Register' });
    },
    goToLogin() {
      this.$router.push({ name: 'Login' });
    }
  }
});
</script>

<style scoped>
.landing-page {
  background: url('@/assets/background.jpg') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
  color: #fff;
}

.logo {
  max-width: 200px;
  margin-bottom: 20px;
}

.v-card {
  background: rgba(0, 0, 0, 0.7); /* Dark overlay for card */
  color: #fff;
}

.v-card-title {
  justify-content: center;
}

.subheading {
  font-size: 1.2em;
  margin-bottom: 20px;
}

.v-btn {
  text-transform: none;
}

.v-btn .v-icon {
  margin-right: 8px;
}
</style>
