<template>
  <v-container>
    <!-- Barre d'outils avec titre, bouton de profil et bouton de déconnexion -->
    <v-toolbar flat>
      <v-toolbar-title>Admin Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>
      
      <!-- Bouton pour accéder au profil de l'utilisateur -->
      <v-btn icon @click="goToUserProfile" color="primary">
        <v-icon>mdi-account</v-icon>
        <v-toolbar-title>Profile</v-toolbar-title>
      </v-btn>
      
      <v-spacer></v-spacer>
      
      <!-- Bouton pour se déconnecter -->
      <v-btn @click="logout" color="red" text>Logout</v-btn>
    </v-toolbar>

    <!-- Tableau des utilisateurs -->
    <v-row class="mb-4">
      <v-col>
        <v-card class="pa-4" elevation="2">
          <v-card-title class="headline text-center">Welcome: {{ updatedUser.firstName }}</v-card-title>
          <v-card-subtitle class="text-center">
            <!-- Barre de recherche pour filtrer les utilisateurs -->
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search by Name"
              single-line
              hide-details
            />
          </v-card-subtitle>

          <!-- En-tête pour le tableau des utilisateurs -->
          <v-card-subtitle class="text-center">
            <v-chip class="ma-2" color="primary" text-color="white">User List</v-chip>
          </v-card-subtitle>

          <!-- Tableau affichant la liste des utilisateurs -->
          <div class="user-table">
            <table>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id">
                  <td>{{ user.firstName }}</td>
                  <td>{{ user.lastName }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <v-btn icon @click="openEditDialog(user)" class="mr-2" color="blue">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon @click="confirmDeleteUser(user)" class="red--text">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialogue pour la modification d'un utilisateur -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Edit User</v-card-title>
        <v-card-text>
          <v-text-field label="First Name" v-model="adminStore.editedUser.firstName"></v-text-field>
          <v-text-field label="Last Name" v-model="adminStore.editedUser.lastName"></v-text-field>
          <v-text-field label="Email" v-model="adminStore.editedUser.email"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="editUser">Save</v-btn>
          <v-btn color="grey" @click="editDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialogue pour confirmer la suppression d'un utilisateur -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Confirm Deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete this user?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="deleteUser">Yes</v-btn>
          <v-btn color="grey" text @click="deleteDialog = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { useAdminStore } from '@/stores/adminStore';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      search: '',
      editDialog: false,
      deleteDialog: false,
      updatedUser: {
        firstName: '',
        lastName: '',
        email: ''
      }
    };
  },
  computed: {
    user() {
      return this.userStore.user;
    },
    filteredUsers() {
      return this.adminStore.filteredUsers(this.search);
    }
  },
  async created() {
    await this.userStore.fetchUser();
    await this.adminStore.fetchUsers();
    const authStore = useAuthStore();
    
    try {
      if (!authStore.user) {
        await authStore.fetchAuthenticatedUser();
      }
      this.updatedUser.firstName = authStore.user?.firstName || '';
      this.updatedUser.lastName = authStore.user?.lastName || '';
      this.updatedUser.email = authStore.user?.email || '';
    } catch (error) {
      console.error('Erreur lors du chargement des informations utilisateur', error);
    }
  },
  methods: {
    async editUser() {
      await this.adminStore.updateUser();
      this.editDialog = false;
    },
    confirmDeleteUser(user) {
      this.adminStore.setUserToDelete(user);
      this.deleteDialog = true;
    },
    async deleteUser() {
      await this.adminStore.deleteUser();
      this.deleteDialog = false;
    },
    goToUserProfile() {
      this.$router.push('/profile');
    },
    logout() {
      console.log('User logged out');
      this.$router.push('/login');
    },
    openEditDialog(user) {
      this.adminStore.setEditedUser(user);
      this.editDialog = true;
    }
  },
  setup() {
    const adminStore = useAdminStore();
    const userStore = useUserStore();
    return { adminStore, userStore };
  }
};
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}
.user-table {
  overflow-x: auto;
}
.user-table table {
  width: 100%;
  border-collapse: collapse;
}
.user-table th, .user-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.user-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}
.user-table tr:nth-child(even) {
  background-color: #f9f9f9;
}
.user-table tr:hover {
  background-color: #f1f1f1;
}
.v-btn {
  min-width: 0;
}
</style>
