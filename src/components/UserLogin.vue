<template>
  <!-- Composant principal de l'application -->
  <v-app>
    <!-- Composant `v-main` pour le contenu principal de l'application -->
    <v-main>
      <!-- Conteneur pour centrer le contenu, avec la classe `fill-height` pour occuper toute la hauteur -->
      <v-container class="fill-height" fluid>
        <!-- Ligne centrée à l'intérieur du conteneur -->
        <v-row align="center" justify="center">
          <!-- Colonne qui s'adapte à la taille de l'écran (cols pour mobile, sm pour tablettes, md pour bureau) -->
          <v-col cols="12" sm="8" md="6">
            <!-- Carte avec une élévation de 12 pour l'ombre et du padding (pa-4) -->
            <v-card class="elevation-12 pa-4">
              <!-- Titre de la carte, centré -->
              <v-card-title class="text-center">
                <h1 class="display-2">Sign In</h1>
              </v-card-title>
              
              <!-- Sous-titre avec des boutons de connexion via les réseaux sociaux -->
              <v-card-subtitle class="text-center mb-4">
                <div class="social-buttons">
                  <!-- Bouton Facebook -->
                  <v-btn fab color="blue darken-2" outlined>
                    <v-icon>fab fa-facebook-f</v-icon>
                  </v-btn>
                  <!-- Bouton Google -->
                  <v-btn fab color="red darken-2" outlined>
                    <v-icon>fab fa-google</v-icon>
                  </v-btn>
                  <!-- Bouton LinkedIn -->
                  <v-btn fab color="blue darken-3" outlined>
                    <v-icon>fab fa-linkedin-in</v-icon>
                  </v-btn>
                  <!-- Bouton Twitter -->
                  <v-btn fab color="blue lighten-1" outlined>
                    <v-icon>fab fa-twitter</v-icon>
                  </v-btn>
                  <!-- Bouton GitHub -->
                  <v-btn fab color="black" outlined>
                    <v-icon>fab fa-github</v-icon>
                  </v-btn>
                  <!-- Bouton GitLab -->
                  <v-btn fab color="orange darken-4" outlined>
                    <v-icon>fab fa-gitlab</v-icon>
                  </v-btn>
                  <!-- Bouton Bitbucket -->
                  <v-btn fab color="blue darken-3" outlined>
                    <v-icon>fab fa-bitbucket</v-icon>
                  </v-btn>
                </div>
              </v-card-subtitle>
              
              <!-- Contenu de la carte avec un formulaire pour la connexion -->
              <v-card-text>
                <v-form @submit.prevent="login">
                  <!-- Champ pour l'email avec un icône et des règles de validation -->
                  <v-text-field
                    v-model="email"
                    label="Email"
                    prepend-icon="mdi-email"
                    type="text"
                    :rules="[rules.required, rules.email]"
                    color="blue accent-3"
                    required
                  ></v-text-field>
                  <!-- Champ pour le mot de passe avec des règles de validation -->
                  <v-text-field
                    v-model="password"
                    label="Password"
                    prepend-icon="mdi-lock"
                    type="password"
                    :rules="[rules.required, rules.minLength]"
                    color="red accent-3"
                    required
                  ></v-text-field>
                  
                  <!-- Bouton pour soumettre le formulaire de connexion -->
                  <div class="text-center mt-4">
                    <v-btn @click="login" rounded color="primary" class="mx-2">
                      Sign In
                    </v-btn>
                  </div>
                </v-form>
              </v-card-text>
              
              <!-- Bouton pour rediriger vers l'inscription -->
              <v-card-actions class="text-center">
                <v-btn
                  rounded
                  outlined
                  dark
                  @click="goToRegister"
                >
                  Sign Up
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
// Importation du composant `defineComponent` de Vue
import { defineComponent } from 'vue';
// Importation du service d'authentification
import { loginService } from '@/services/authService';

export default defineComponent({
  name: 'UserLogin', // Nom du composant
  data() {
    return {
      // Modèles pour les champs de formulaire
      email: '',
      password: '',
      // Règles de validation pour le formulaire
      rules: {
        required: value => !!value || 'Required.', // Champ requis
        email: value => /.+@.+/.test(value) || 'E-mail must be valid.', // Validation d'email
        minLength: value => value.length >= 6 || 'Password must be at least 6 characters long.', // Longueur minimale du mot de passe
      },
    };
  },
  methods: {
    // Méthode de connexion
    async login() {
      // Vérifier si l'email et le mot de passe sont remplis
      if (!this.email || !this.password) {
        alert('Please enter both email and password.');
        return;
      }

      try {
        const loginData = {
          email: this.email, // Email saisi
          password: this.password, // Mot de passe saisi
        };

        // Appel au service de connexion
        const response = await loginService(loginData);

        if (response.status === 200) {
          const userRole = response.data.role; // Récupérer le rôle de l'utilisateur
          const token = response.data.token; // Récupérer le token d'authentification

          // Stocker le token dans le localStorage
          localStorage.setItem('token', token);

          // Émettre un événement de succès de connexion avec les infos de l'utilisateur
          this.$emit('login-success', { email: this.email, role: userRole });

          // Redirection en fonction du rôle de l'utilisateur
          if (userRole === 'admin') {
            this.$router.push({ name: 'Admindashboard' });
          } else if (userRole === 'user') {
            this.$router.push({ name: 'Userdashboard' });
          } else {
            alert('Invalid user role');
          }
        } else {
          alert('Login failed. Please try again.');
        }
      } catch (error) {
        console.error('There was an error!', error.response?.data || error);
        alert('Login failed. Please try again.');
      }
    },
    // Méthode pour rediriger vers la page d'inscription
    goToRegister() {
      this.$router.push({ name: 'Register' });
    },
  },
});
</script>

<style scoped>
/* Style de la carte */
.v-card {
  background-color: #ffffff;
}

/* Style des boutons sociaux */
.social-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

/* Espacement entre les boutons sociaux */
.social-buttons .v-btn {
  margin: 0 5px;
}

/* Style du texte des boutons */
.v-btn {
  text-transform: none;
}

/* Style du titre de la carte */
.v-card-title h1 {
  color: #1976d2;
}

/* Style des actions de la carte */
.v-card-actions {
  padding: 16px;
}
</style>
