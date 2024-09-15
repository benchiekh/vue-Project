<template>
  <!-- Composant principal de l'application Vuetify -->
  <v-app>
    <v-main>
      <!-- Conteneur qui occupe toute la hauteur de la page -->
      <v-container class="fill-height" fluid>
        <!-- Centrage du contenu avec Vuetify -->
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6">
            <!-- Carte contenant le formulaire d'inscription -->
            <v-card class="elevation-12 pa-4">
              <!-- Titre de la carte : 'Create an Account' -->
              <v-card-title class="text-center">
                <h1 class="display-2">Create an Account</h1>
              </v-card-title>

              <!-- Boutons de réseaux sociaux pour l'inscription avec des icônes -->
              <v-card-subtitle class="text-center">
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

              <!-- Formulaire d'inscription -->
              <v-card-text>
                <v-form @submit.prevent="register">
                  <!-- Champ pour le prénom -->
                  <v-text-field
                    v-model="firstName"
                    label="First Name"
                    prepend-icon="mdi-account"
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                  <!-- Champ pour le nom -->
                  <v-text-field
                    v-model="lastName"
                    label="Last Name"
                    prepend-icon="mdi-account"
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                  <!-- Champ pour l'email -->
                  <v-text-field
                    v-model="email"
                    label="Email"
                    prepend-icon="mdi-email"
                    :rules="[rules.required, rules.email]"
                    required
                  ></v-text-field>
                  <!-- Champ pour le mot de passe -->
                  <v-text-field
                    v-model="password"
                    label="Password"
                    prepend-icon="mdi-lock"
                    type="password"
                    :rules="[rules.required, rules.minLength]"
                    required
                  ></v-text-field>
                  <!-- Champ pour la confirmation du mot de passe -->
                  <v-text-field
                    v-model="confirmPassword"
                    label="Confirm Password"
                    prepend-icon="mdi-lock"
                    type="password"
                    :rules="[validateConfirmPassword]"
                    required
                  ></v-text-field>

                  <!-- Bouton pour soumettre le formulaire -->
                  <div class="text-center mt-4">
                    <v-btn type="submit" rounded color="primary" class="mx-2">
                      Sign Up
                    </v-btn>
                  </div>
                </v-form>
              </v-card-text>

              <!-- Bouton pour rediriger vers la page de connexion -->
              <v-card-actions class="text-center">
                <v-btn
                  rounded
                  outlined
                  dark
                  @click="goToLogin"
                >
                  Sign In
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
// Importation de la fonction defineComponent de Vue et du store d'enregistrement (Pinia)
import { defineComponent } from 'vue';
import { useRegisterStore } from '@/stores/registerStore'; // Importer le store pour gérer l'inscription

export default defineComponent({
  name: 'UserRegister',
  data() {
    return {
      // Variables pour stocker les entrées du formulaire
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      // Règles de validation pour le formulaire
      rules: {
        required: value => !!value || 'Required.', // Champ obligatoire
        email: value => /.+@.+/.test(value) || 'E-mail must be valid.', // Validation de l'email
        minLength: value => value.length >= 6 || 'Password must be at least 6 characters long.', // Longueur minimale du mot de passe
      },
    };
  },
  setup() {
    // Utilisation du store d'enregistrement pour gérer les actions d'inscription
    const registerStore = useRegisterStore();
    return { registerStore }; // Renvoyer le store pour l'utiliser dans le composant
  },
  methods: {
    // Méthode pour valider que les mots de passe correspondent
    validateConfirmPassword(value) {
      return value === this.password || 'Passwords do not match.'; // Les mots de passe doivent être identiques
    },
    // Méthode pour gérer l'inscription de l'utilisateur
    async register() {
      try {
        // Vérification si les mots de passe correspondent
        if (this.password !== this.confirmPassword) {
          alert('Passwords do not match.'); // Alerte si les mots de passe sont différents
          return;
        }

        // Créer un objet avec les données du formulaire
        const registerData = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
        };

        // Utiliser le store pour appeler l'action d'inscription
        await this.registerStore.registerUser(registerData);

        // Alerte de succès et redirection vers la page de connexion
        alert('Registration successful!');
        this.$router.push({ name: 'Login' });
      } catch (error) {
        // En cas d'erreur, afficher un message d'alerte
        alert('Registration failed. Please try again.');
      }
    },
    // Méthode pour rediriger vers la page de connexion
    goToLogin() {
      this.$router.push({ name: 'Login' });
    },
  },
});
</script>

<style scoped>
/* Styles pour les boutons des réseaux sociaux */
.social-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.social-buttons .v-btn {
  margin: 0 5px;
}

/* Style pour la carte d'inscription */
.v-card {
  background-color: #ffffff;
}

/* Couleur du titre de la carte */
.v-card-title h1 {
  color: #1976d2;
}
</style>
