<template>
    <v-container>
        <v-row class="mb-4">
            <v-col cols="12" sm="8" md="6">
                <v-card class="pa-4">
                    <v-card-title class="headline text-center">
                        Profil de {{ updatedUser.firstName || 'Utilisateur' }}
                    </v-card-title>
                    <v-card-subtitle class="text-center">
                        Email: {{ updatedUser.email }}
                    </v-card-subtitle>

                    <v-card-text>
                        <v-form @submit.prevent="updateProfile">
                            <v-text-field
                                label="Nom"
                                v-model="updatedUser.firstName"
                                :rules="[rules.required]"
                            ></v-text-field>

                            <v-text-field
                                label="Prénom"
                                v-model="updatedUser.lastName"
                                :rules="[rules.required]"
                            ></v-text-field>

                            <v-text-field
                                label="Email"
                                v-model="updatedUser.email"
                                :rules="[rules.required, rules.email]"
                            ></v-text-field>

                            <v-text-field
                                label="Mot de passe"
                                v-model="updatedUser.password"
                                type="password"
                                :rules="[rules.minLength]"
                                hint="Laisser vide pour ne pas modifier"
                            ></v-text-field>

                            <v-btn type="submit" color="primary" class="mt-3" :loading="loading">
                                Mettre à jour
                            </v-btn>
                        </v-form>
                    </v-card-text>

                    <v-card-actions>
                        <v-btn color="red" text @click="logout">
                            Déconnexion
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="goToUserDashboard" color="primary">
        
                        <v-toolbar-title>Dashboard</v-toolbar-title>
                    </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';

export default {
    name: 'UserProfile',
    data() {
        return {
            loading: false,
            updatedUser: {
                firstName: '',
                lastName: '',
                email: '',
                password: '', // Laisser vide si non modifié
            },
            rules: {
                required: value => !!value || 'Requis.',
                email: value => /.+@.+\..+/.test(value) || 'E-mail invalide.',
                minLength: value => value.length >= 6 || 'Le mot de passe doit contenir au moins 6 caractères.',
            },
        };
    },
    async created() {
        const authStore = useAuthStore();

        try {
            if (!authStore.user) {
                // Si l'utilisateur n'est pas déjà chargé, récupérer les informations utilisateur
                await authStore.fetchAuthenticatedUser();
            }
            console.log('Utilisateur récupéré :', authStore.user);

            // Initialiser les données avec les informations de l'utilisateur connecté
            this.updatedUser.firstName = authStore.user?.firstName || '';
            this.updatedUser.lastName = authStore.user?.lastName || '';
            this.updatedUser.email = authStore.user?.email || '';
        } catch (error) {
            console.error('Erreur lors du chargement des informations utilisateur', error);
        }
    },
    methods: {
        async updateProfile() {
            this.loading = true;
            try {
                await useAuthStore().updateUser(this.updatedUser);
                alert('Profil mis à jour avec succès');
            } catch (error) {
                console.error('Erreur lors de la mise à jour du profil', error);
                alert('Échec de la mise à jour du profil.');
            } finally {
                this.loading = false;
            }
        },
        goToUserDashboard() {
            if(this.updateProfile.role == 'admin')
      this.$router.push('/admindashboard'); 
    else {
        this.$router.push('/userdashboard'); 

    }
    },
        logout() {
            const authStore = useAuthStore();
            authStore.logout();
            this.$router.push('/login');
        },
    },
};
</script>

<style scoped>
.v-card {
    background-color: #ffffff;
    border-radius: 12px;
}
.v-card-title {
    color: #1976d2;
}
</style>
