<template>
    <!-- Conteneur principal pour la mise en page Vuetify -->
    <v-container>
        <!-- Ligne de la grille avec un espace en bas (mb-4) -->
        <v-row class="mb-4">
            <!-- Colonne qui s'adapte selon la taille de l'écran (sm, md, etc.) -->
            <v-col cols="12" sm="8" md="6">
                <!-- Carte Vuetify contenant le formulaire et les informations de l'utilisateur -->
                <v-card class="pa-4">
                    <!-- Titre de la carte avec le prénom de l'utilisateur ou 'Utilisateur' par défaut -->
                    <v-card-title class="headline text-center">
                        Profil de {{ updatedUser.firstName || 'Utilisateur' }}
                    </v-card-title>
                    <!-- Sous-titre affichant l'email de l'utilisateur -->
                    <v-card-subtitle class="text-center">
                        Email: {{ updatedUser.email }}
                    </v-card-subtitle>

                    <!-- Formulaire pour mettre à jour le profil utilisateur -->
                    <v-card-text>
                        <v-form @submit.prevent="updateProfile">
                            <!-- Champ pour le prénom de l'utilisateur -->
                            <v-text-field
                                label="Nom"
                                v-model="updatedUser.firstName"
                                :rules="[rules.required]"
                            ></v-text-field>

                            <!-- Champ pour le nom de famille de l'utilisateur -->
                            <v-text-field
                                label="Prénom"
                                v-model="updatedUser.lastName"
                                :rules="[rules.required]"
                            ></v-text-field>

                            <!-- Champ pour l'email de l'utilisateur -->
                            <v-text-field
                                label="Email"
                                v-model="updatedUser.email"
                                :rules="[rules.required, rules.email]"
                            ></v-text-field>

                            <!-- Champ pour modifier le mot de passe, optionnel -->
                            <v-text-field
                                label="Mot de passe"
                                v-model="updatedUser.password"
                                type="password"
                                :rules="[rules.minLength]"
                                hint="Laisser vide pour ne pas modifier"
                            ></v-text-field>

                            <!-- Bouton pour soumettre le formulaire -->
                            <v-btn type="submit" color="primary" class="mt-3" :loading="loading">
                                Mettre à jour
                            </v-btn>
                        </v-form>
                    </v-card-text>

                    <!-- Actions supplémentaires sous le formulaire -->
                    <v-card-actions>
                        <!-- Bouton pour se déconnecter -->
                        <v-btn color="red" text @click="logout">
                            Déconnexion
                        </v-btn>
                        <v-spacer></v-spacer> <!-- Espacement flexible entre les boutons -->
                        <!-- Bouton pour rediriger vers le dashboard -->
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
// Importation du store d'authentification (Pinia)
import { useAuthStore } from '@/stores/authStore';

export default {
    name: 'UserProfile', // Nom du composant
    data() {
        return {
            loading: false, // Indicateur de chargement pour les requêtes asynchrones
            updatedUser: {
                firstName: '', // Champ pour le prénom
                lastName: '', // Champ pour le nom
                email: '', // Champ pour l'email
                password: '', // Champ pour le mot de passe (optionnel, vide si non modifié)
            },
            // Règles de validation pour les champs du formulaire
            rules: {
                required: value => !!value || 'Requis.', // Validation des champs obligatoires
                email: value => /.+@.+\..+/.test(value) || 'E-mail invalide.', // Validation de l'email
                minLength: value => value.length >= 6 || 'Le mot de passe doit contenir au moins 6 caractères.', // Longueur minimale du mot de passe
            },
        };
    },
    async created() {
        // Récupération des informations utilisateur à la création du composant
        const authStore = useAuthStore();

        try {
            if (!authStore.user) {
                // Si l'utilisateur n'est pas déjà chargé, récupérer les informations depuis le store
                await authStore.fetchAuthenticatedUser();
            }
            console.log('Utilisateur récupéré :', authStore.user);

            // Initialisation des données du formulaire avec les informations de l'utilisateur connecté
            this.updatedUser.firstName = authStore.user?.firstName || '';
            this.updatedUser.lastName = authStore.user?.lastName || '';
            this.updatedUser.email = authStore.user?.email || '';
        } catch (error) {
            console.error('Erreur lors du chargement des informations utilisateur', error);
        }
    },
    methods: {
        // Méthode pour mettre à jour le profil de l'utilisateur
        async updateProfile() {
            this.loading = true; // Activer l'indicateur de chargement
            try {
                // Utiliser le store pour mettre à jour les informations utilisateur
                await useAuthStore().updateUser(this.updatedUser);
                alert('Profil mis à jour avec succès');
            } catch (error) {
                console.error('Erreur lors de la mise à jour du profil', error);
                alert('Échec de la mise à jour du profil.');
            } finally {
                this.loading = false; // Désactiver l'indicateur de chargement
            }
        },
        // Méthode pour rediriger vers le tableau de bord de l'utilisateur
        goToUserDashboard() {
            if(this.updateProfile.role == 'admin') {
                // Si l'utilisateur est un admin, redirection vers le tableau de bord admin
                this.$router.push('/admindashboard'); 
            } else {
                // Sinon, redirection vers le tableau de bord utilisateur
                this.$router.push('/userdashboard'); 
            }
        },
        // Méthode pour déconnecter l'utilisateur
        logout() {
            const authStore = useAuthStore();
            authStore.logout(); // Appel de la méthode de déconnexion dans le store
            this.$router.push('/login'); // Redirection vers la page de connexion
        },
    },
};
</script>

<style scoped>
/* Styles spécifiques au composant */
.v-card {
    background-color: #ffffff;
    border-radius: 12px; /* Coins arrondis pour la carte */
}
.v-card-title {
    color: #1976d2; /* Couleur bleue pour le titre de la carte */
}
</style>
