<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6">
            <v-card class="elevation-12 pa-4">
              <v-card-title class="text-center">
                <h1 class="display-2">Sign In</h1>
              </v-card-title>
              
              <v-card-subtitle class="text-center mb-4">
                <div class="social-buttons">
                  <v-btn fab color="blue darken-2" outlined>
                    <v-icon>fab fa-facebook-f</v-icon>
                  </v-btn>
                  <v-btn fab color="red darken-2" outlined>
                    <v-icon>fab fa-google</v-icon>
                  </v-btn>
                  <v-btn fab color="blue darken-3" outlined>
                    <v-icon>fab fa-linkedin-in</v-icon>
                  </v-btn>
                  <v-btn fab color="blue lighten-1" outlined>
                    <v-icon>fab fa-twitter</v-icon>
                  </v-btn>
                  <v-btn fab color="black" outlined>
                    <v-icon>fab fa-github</v-icon>
                  </v-btn>
                  <v-btn fab color="orange darken-4" outlined>
                    <v-icon>fab fa-gitlab</v-icon>
                  </v-btn>
                  <v-btn fab color="blue darken-3" outlined>
                    <v-icon>fab fa-bitbucket</v-icon>
                  </v-btn>
                </div>
              </v-card-subtitle>
              
              <v-card-text>
                <v-form @submit.prevent="login">
                  <v-text-field
                    v-model="email"
                    label="Email"
                    prepend-icon="mdi-email"
                    type="text"
                    :rules="[rules.required, rules.email]"
                    color="blue accent-3"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    label="Password"
                    prepend-icon="mdi-lock"
                    type="password"
                    :rules="[rules.required, rules.minLength]"
                    color="red accent-3"
                    required
                  ></v-text-field>
                  
                  <div class="text-center mt-4">
                    <v-btn @click="login" rounded color="primary" class="mx-2">
                      Sign In
                    </v-btn>
                  </div>
                </v-form>
              </v-card-text>
              
             
              
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
import { defineComponent } from 'vue';
import { useAuthStore } from '@/stores/authStore'; // Importez le store

export default defineComponent({
  name: 'UserLogin',
  data() {
    return {
      email: '',
      password: '',
      rules: {
        required: value => !!value || 'Required.',
        email: value => /.+@.+/.test(value) || 'E-mail must be valid.',
        minLength: value => value.length >= 6 || 'Password must be at least 6 characters long.',
      },
    };
  },
  setup() {
    const authStore = useAuthStore(); // Instanciez le store
    return { authStore };
  },
  methods: {
    async login() {
      if (!this.email || !this.password) {
        alert('Please enter both email and password.');
        return;
      }

      try {
        // Utilisez le store pour gérer l'authentification
        const { role } = await this.authStore.login(this.email, this.password);

        // Redirection selon le rôle de l'utilisateur
        if (role === 'admin') {
          this.$router.push({ name: 'Admindashboard' });
        } else if (role === 'user') {
          this.$router.push({ name: 'Userdashboard' });
        } else {
          alert('Invalid user role');
        }
      } catch (error) {
        alert('Login failed. Please try again.');
      }
    },

    goToRegister() {
      this.$router.push({ name: 'Register' });
    },
  },
});
</script>



<style scoped>
.v-card {
  background-color: #ffffff;
}

.social-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.social-buttons .v-btn {
  margin: 0 5px;
}

.v-btn {
  text-transform: none;
}

.v-card-title h1 {
  color: #1976d2;
}

.v-card-actions {
  padding: 16px;
}
</style>
