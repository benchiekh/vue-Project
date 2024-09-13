<template>
  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>Admin Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="logout" color="red" text>Logout</v-btn>
    </v-toolbar>

    <v-row class="mb-4">
      <v-col>
        <v-card class="pa-4" elevation="2">
          <v-card-title class="headline text-center">Hello : {{ user?.firstName }}</v-card-title>
          <v-card-subtitle class="text-center">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />
          </v-card-subtitle>
          <v-data-table
            :headers="headers"
            :items="filteredUsers"
            item-key="id"
            class="elevation-1"
            :loading="adminStore.loading"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn icon @click="openEditDialog(item)" class="mr-2" color="blue">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="confirmDeleteUser(item)" class="red--text">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog for Edit User -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Edit Profile</v-card-title>
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

    <!-- Dialog for Delete Confirmation -->
    <v-dialog
      v-model="deleteDialog"
      max-width="400"
      transition="dialog-transition"
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
import { useAdminStore } from '@/stores/adminStore';
import { useUserStore } from '@/stores/userStore';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      search: '',
      headers: [
        { text: 'First Name', value: 'firstName' },
        { text: 'Last Name', value: 'lastName' },
        { text: 'Email', value: 'email' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      editDialog: false,
      deleteDialog: false,
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
    await this.userStore.fetchUser(); // Fetch authenticated user
    await this.adminStore.fetchUsers(); // Fetch all users
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
