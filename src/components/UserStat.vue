<template>
    <div class="stat-user">
      <v-card>
        <v-card-title>
          <span class="headline">Statistiques des Utilisateurs</span>
        </v-card-title>
        <v-card-subtitle>
          <v-row>
            <v-col>
              <v-stat-card
                :title="'Total Utilisateurs'"
                :value="totalUsers"
                icon="mdi-account-multiple"
              />
            </v-col>
            <v-col>
              <v-stat-card
                :title="'Utilisateur le Plus Actif'"
                :value="mostActiveUser.name"
                :valueDetails="mostActiveUser.activity"
                icon="mdi-account-star"
              />
            </v-col>
            <!-- Ajoutez d'autres statistiques ici -->
          </v-row>
        </v-card-subtitle>
      </v-card>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        totalUsers: 0,
        mostActiveUser: {
          name: '',
          activity: ''
        },
      };
    },
    async created() {
      await this.fetchUserStats();
    },
    methods: {
      async fetchUserStats() {
        try {
          const response = await axios.get('/api/users/stats');
          const stats = response.data;
          this.totalUsers = stats.totalUsers;
          this.mostActiveUser = stats.mostActiveUser;
        } catch (error) {
          console.error('Erreur lors de la récupération des statistiques des utilisateurs', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Ajoutez des styles spécifiques au composant ici */
  </style>
  