// stores/registerStore.js
import { defineStore } from 'pinia';
import { registerService } from '@/services/authService'; // Assurez-vous que ce service est correctement implémenté

export const useRegisterStore = defineStore('register', {
  state: () => ({
    registrationSuccess: false,
    registrationError: null,
  }),
  actions: {
    async registerUser(registerData) {
      try {
        const response = await registerService(registerData);

        if (response.status === 200) {
          this.registrationSuccess = true;
          this.registrationError = null;

          // Enregistrer les données utilisateur si nécessaire (par exemple, pour l'accès futur)
          return response.data;
        } else {
          throw new Error('Registration failed');
        }
      } catch (error) {
        this.registrationError = error.response?.data || 'Failed to register user';
        this.registrationSuccess = false;
        throw new Error(this.registrationError);
      }
    },
  },
});
