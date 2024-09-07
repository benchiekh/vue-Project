<template>
  <v-container>
    <h1 class="text-center mb-4">Hello Admin</h1>

    <v-data-table
      :headers="headers"
      :items="users"
      item-key="id"
      class="elevation-1"
      :loading="loading"
      :search="search"
    >
      <!-- Table Rows with Actions -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          icon
          @click="editUser(item)"
          class="mr-2"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          icon
          @click="confirmDeleteUser(item)"
          class="red--text"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Dialog for Delete Confirmation -->
    <v-dialog
      v-model:show="deleteDialog"
      max-width="290"
    >
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
import { getUsers, deleteUser as deleteUserService } from '@/services/authService'; // Assurez-vous que le chemin est correct

export default {
  name: 'AdminDashboard',
  data() {
    return {
      users: [],
      headers: [
        { text: 'First Name', value: 'firstName' },
        { text: 'Last Name', value: 'lastName' },
        { text: 'Email', value: 'email' },
        { text: 'Role', value: 'role' },
        { text: 'Actions', value: 'actions', sortable: false } // Ajouter la colonne Actions
      ],
      search: '',
      loading: false,
      deleteDialog: false,
      userToDelete: null,
    };
  },
  async created() {
    this.loading = true;
    try {
      const response = await getUsers();
      this.users = response.data;
    } catch (error) {
      console.error('There was an error fetching users!', error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    editUser(user) {
      // Rediriger vers une page d'édition ou ouvrir un formulaire d'édition
      this.$router.push({ name: 'EditUser', params: { id: user.id } });
    },
    confirmDeleteUser(user) {
      this.userToDelete = user;
      this.deleteDialog = true;
    },
    async deleteUser() {
      try {
        await deleteUserService(this.userToDelete.id);
        this.users = this.users.filter(user => user.id !== this.userToDelete.id);
        this.deleteDialog = false;
        alert('User deleted successfully');
      } catch (error) {
        console.error('There was an error deleting the user!', error);
        alert('Failed to delete user');
      }
    }
  }
};
</script>
<style scoped>
.v-data-table th, .v-data-table td {
  font-size: 16px;
}
.v-data-table .v-data-table__wrapper {
  border-radius: 8px;
}
.v-data-table .v-data-table__header {
  background-color: #1976D2;
  color: white;
}
.v-data-table .v-data-table__body tr:nth-of-type(odd) {
  background-color: #f5f5f5;
}
.v-data-table .v-data-table__body tr:hover {
  background-color: #e0e0e0;
}
.v-btn {
  min-width: 0;
}
</style>
