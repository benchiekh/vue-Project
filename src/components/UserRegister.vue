<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6">
            <v-card class="elevation-12 pa-4">
              <v-card-title class="text-center">
                <h1 class="display-2">Create an Account</h1>
              </v-card-title>

              <v-card-subtitle class="text-center">
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
                <v-form @submit.prevent="register">
                  <v-text-field
                    v-model="firstName"
                    label="First Name"
                    prepend-icon="mdi-account"
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="lastName"
                    label="Last Name"
                    prepend-icon="mdi-account"
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="email"
                    label="Email"
                    prepend-icon="mdi-email"
                    :rules="[rules.required, rules.email]"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    label="Password"
                    prepend-icon="mdi-lock"
                    type="password"
                    :rules="[rules.required, rules.minLength]"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="confirmPassword"
                    label="Confirm Password"
                    prepend-icon="mdi-lock"
                    type="password"
                    :rules="[validateConfirmPassword]"
                    required
                  ></v-text-field>

                  <div class="text-center mt-4">
                    <v-btn type="submit" rounded color="primary" class="mx-2">
                      Sign Up
                    </v-btn>
                  </div>
                </v-form>
              </v-card-text>

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
import { defineComponent } from 'vue';
import { registerService } from '@/services/authService';

export default defineComponent({
  name: 'UserRegister',
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      rules: {
        required: value => !!value || 'Required.',
        email: value => /.+@.+/.test(value) || 'E-mail must be valid.',
        minLength: value => value.length >= 6 || 'Password must be at least 6 characters long.',
      },
    };
  },
  methods: {
    validateConfirmPassword(value) {
      return value === this.password || 'Passwords do not match.';
    },
    async register() {
      try {
        if (this.password !== this.confirmPassword) {
          alert('Passwords do not match.');
          return;
        }

        // Créer un objet registerData avec les données du formulaire
        const registerData = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
        };

        // Appeler le service avec l'objet registerData
        const response = await registerService(registerData);

        if (response.status === 200) {
          alert('Registration successful!');
          this.$router.push({ name: 'Login' });
        }
      } catch (error) {
        console.error('There was an error!', error.response?.data || error);
        alert('Registration failed. Please try again.');
      }
    },
    goToLogin() {
      this.$router.push({ name: 'Login' });
    },
  },
});
</script>

<style scoped>
.social-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.social-buttons .v-btn {
  margin: 0 5px;
}

.v-card {
  background-color: #ffffff;
}

.v-card-title h1 {
  color: #1976d2;
}
</style>
