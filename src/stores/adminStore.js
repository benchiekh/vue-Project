import { defineStore } from 'pinia';
import { getUsers, deleteUserService, editUserService } from '@/services/authService';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    users: [],
    loading: false,
    editedUser: {
      firstName: '',
      lastName: '',
      email: '',
      id: null,
    },
    userToDelete: null,
  }),
  getters: {
    filteredUsers: (state) => (search) => {
      return state.users.filter(user =>
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
  },
  actions: {
    async fetchUsers() {
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
    async updateUser() {
      try {
        const updatedData = {
          firstName: this.editedUser.firstName,
          lastName: this.editedUser.lastName,
          email: this.editedUser.email,
        };
        await editUserService(this.editedUser.id, updatedData);
        this.users = this.users.map(u => (u._id === this.editedUser.id ? { ...u, ...updatedData } : u));
        alert('Profile updated successfully');
      } catch (error) {
        console.error('There was an error updating the profile!', error);
        alert('Failed to update profile');
      }
    },
    async deleteUser() {
      try {
        await deleteUserService(this.userToDelete._id);
        this.users = this.users.filter(user => user._id !== this.userToDelete._id);
        alert('User deleted successfully');
      } catch (error) {
        console.error('There was an error deleting the user!', error);
        alert('Failed to delete user');
      }
    },
    setEditedUser(user) {
      this.editedUser = { ...user, id: user._id };
    },
    setUserToDelete(user) {
      this.userToDelete = user;
    }
  }
});
