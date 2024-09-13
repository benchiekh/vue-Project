// stores/authStore.js
import { defineStore } from 'pinia';
import { loginService } from '@/services/authService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    role: null,
  }),
  actions: {
    async login(email, password) {
      try {
        const response = await loginService({ email, password });

        // Si la requête est réussie
        if (response.status === 200) {
          const { role, token } = response.data;

          // Enregistrer le token et les informations utilisateur dans le store
          this.token = token;
          this.user = email;
          this.role = role;

          // Sauvegarder le token dans localStorage pour les requêtes ultérieures
          localStorage.setItem('token', token);

          return { role, token };
        } else {
          throw new Error('Login failed');
        }
      } catch (error) {
        console.error('Login error:', error.response?.data || error);
        throw new Error('Failed to login');
      }
    },
    logout() {
      // Réinitialiser l'état du store à la déconnexion
      this.user = null;
      this.token = null;
      this.role = null;

      // Supprimer le token du localStorage
      localStorage.removeItem('token');
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.role === 'admin',
    isUser: (state) => state.role === 'user',
  },
});
