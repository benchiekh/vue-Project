// src/stores/productStatsStore.js
import { defineStore } from 'pinia';
import { fetchProductStats } from '@/services/authService'; // Assurez-vous que le chemin est correct

export const useProductStatsStore = defineStore('productStats', {
  state: () => ({
    totalProducts: 0,
    mostExpensiveProduct: {
      name: '',
      price: 0,
    },
    loading: false,
    error: null,
  }),
  actions: {
    async fetchStats() {
      this.loading = true;
      try {
        const response = await fetchProductStats();
        this.totalProducts = response.data.totalProducts;
        this.mostExpensiveProduct = response.data.mostExpensiveProduct;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
