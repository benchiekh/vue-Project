import { defineStore } from 'pinia';
import { loginService, updateUserService, fetchAuthenticatedUser } from '@/services/authService'; // Assurez-vous que `fetchAuthenticatedUser` est importé

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

                if (response.status === 200) {
                    const { user, role, token } = response.data;

                    this.user = user;
                    this.token = token;
                    this.role = role;

                    localStorage.setItem('token', token);

                    return { user, role, token };
                } else {
                    throw new Error('Login failed');
                }
            } catch (error) {
                console.error('Login error:', error.response?.data || error);
                throw new Error('Failed to login');
            }
        },

        async fetchAuthenticatedUser() {
            try {
                const response = await fetchAuthenticatedUser(); // URL de l'API pour récupérer l'utilisateur
                console.log('Réponse de l\'API utilisateur:', response.data); // Vérifiez ce que vous recevez

                this.user = response.data; // Assurez-vous que la réponse contient les bonnes données
                console.log('Utilisateur stocké dans le store:', this.user); // Vérifiez si l'utilisateur est correctement stocké

            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur authentifié', error);
                this.user = null;
            }
        },

        async updateUser(newUserData) {
            try {
                const response = await updateUserService(newUserData);

                if (response.status === 200) {
                    this.user = { ...this.user, ...response.data };

                    return response.data;
                } else {
                    throw new Error('Update failed');
                }
            } catch (error) {
                console.error('Update error:', error.response?.data || error);
                throw new Error('Failed to update user');
            }
        },

        logout() {
            this.user = null;
            this.token = null;
            this.role = null;
            localStorage.removeItem('token');
        },
    },
    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.role === 'admin',
        isUser: (state) => state.role === 'user',
    },
});
