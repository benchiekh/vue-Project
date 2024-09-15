<template>
    <div class="stat-product">
      <v-card>
        <v-card-title>
          <span class="headline">Statistiques des Produits</span>
        </v-card-title>
        <v-card-subtitle>
          <v-row>
            <v-col cols="12" md="6">
              <v-card>
                <v-card-title>Total Produits</v-card-title>
                <v-card-subtitle>{{ productStats.totalProducts }}</v-card-subtitle>
                <v-icon>mdi-cube</v-icon>
              </v-card>
              <bar-chart :data="chartData" :options="chartOptions" />
            </v-col>
            <v-col cols="12" md="6">
              <v-card>
                <v-card-title>Produit le Plus Cher</v-card-title>
                <v-card-subtitle>{{ productStats.mostExpensiveProduct.name }}</v-card-subtitle>
                <v-card-subtitle>Prix: {{ formattedPrice }}</v-card-subtitle>
                <v-icon>mdi-currency-usd</v-icon>
              </v-card>
              <pie-chart :data="priceDistribution" :options="pieChartOptions" />
            </v-col>
          </v-row>
        </v-card-subtitle>
      </v-card>
    </div>
  </template>
  
  <script>
  import { useProductStatsStore } from '@/stores/productStatsStore';
  import { computed, onMounted } from 'vue';
  import { Bar, Pie } from 'vue-chartjs';
  import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
  
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
  
  export default {
    components: {
      BarChart: Bar,
      PieChart: Pie
    },
    setup() {
      const productStats = useProductStatsStore();
    
      onMounted(() => {
        productStats.fetchStats();
      });
    
      const formattedPrice = computed(() => {
        const price = productStats.mostExpensiveProduct.price;
        return price ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(price) : '';
      });
  
      const chartData = computed(() => ({
        labels: ['Total Produits'],
        datasets: [{
          label: 'Nombre de Produits',
          data: [productStats.totalProducts],
          backgroundColor: ['#42A5F5']
        }]
      }));
  
      const chartOptions = {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.raw}`
            }
          }
        }
      };
  
      const priceDistribution = computed(() => ({
        labels: ['Produit le Plus Cher'],
        datasets: [{
          label: 'Prix du Produit le Plus Cher',
          data: [productStats.mostExpensiveProduct.price],
          backgroundColor: ['#FF6384']
        }]
      }));
  
      const pieChartOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw}`
            }
          }
        }
      };
  
      return {
        productStats,
        formattedPrice,
        chartData,
        chartOptions,
        priceDistribution,
        pieChartOptions
      };
    }
  }
  </script>
  
  <style scoped>
  /* Ajoutez des styles spécifiques au composant ici */
  .stat-product {
    padding: 16px;
  }
  .v-card {
    margin-bottom: 16px;
  }
  </style>
  