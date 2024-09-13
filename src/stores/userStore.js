// src/stores/userStore.js
import { defineStore } from 'pinia';
import { fetchAuthenticatedUser } from '@/services/authService';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loading: false,
  }),
  actions: {
    async fetchUser() {
      this.loading = true;
      console.log('Fetching user...');
      try {
        const response = await fetchAuthenticatedUser();
        console.log('User fetched:', response.data); // Vérifiez la réponse
        this.user = response.data;
      } catch (error) {
        console.error('Error fetching authenticated user:', error);
      } finally {
        this.loading = false;
      }
    }
  }
});
