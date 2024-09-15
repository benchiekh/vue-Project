<template>
  <v-container>
    <!-- Barre d'outils avec bouton de déconnexion et icône de profil -->
    <v-toolbar flat>
      <v-toolbar-title>User Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>
      
      <!-- Icône de profil qui redirige vers la page de profil -->
      <v-btn icon @click="goToUserProfile" color="primary">
        <v-icon>mdi-account</v-icon>
        <v-toolbar-title>Profile</v-toolbar-title>
      </v-btn>
      
      <v-spacer></v-spacer>
      <!-- Bouton de déconnexion qui déclenche la méthode logout -->
      <v-btn @click="logout" color="red" text>Logout</v-btn>
    </v-toolbar>

    <!-- Contenu du tableau de bord des produits -->
    <v-row class="mb-4">
      <v-col>
        <!-- Carte affichant le tableau des produits -->
        <v-card class="pa-4" elevation="2">
          <v-card-title class="headline text-center">Welcome, {{ updatedUser.firstName }}</v-card-title>
          <v-card-subtitle class="text-center">
            <!-- Barre de recherche pour filtrer les produits par description -->
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search description"
              single-line
              hide-details
            />
            <!-- Bouton pour ouvrir le dialogue d'ajout de produit -->
            <v-btn @click="openAddDialog" color="primary" class="mt-2">Add Product</v-btn>
          </v-card-subtitle>

          <!-- En-tête pour le tableau des produits -->
          <v-card-subtitle class="text-center">
            <v-chip class="ma-2" color="primary" text-color="white">Product List</v-chip>
          </v-card-subtitle>

          <!-- Tableau affichant la liste des produits -->
          <div class="product-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in filteredProducts" :key="product.id">
                  <td>{{ product.name }}</td>
                  <td>{{ product.description }}</td>
                  <td>{{ product.price }}</td>
                  <td>{{ product.quantity }}</td>
                  <td>
                    <v-btn icon @click="openEditDialog(product)" class="mr-2" color="blue">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon @click="confirmDeleteProduct(product)" class="red--text">
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

    <!-- Dialogue pour l'ajout de produit -->
    <v-dialog v-model="addDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Add Product</v-card-title>
        <v-card-text>
          <!-- Champs de formulaire pour ajouter un produit -->
          <v-text-field label="Name" v-model="newProduct.name"></v-text-field>
          <v-text-field label="Description" v-model="newProduct.description"></v-text-field>
          <v-text-field label="Price" v-model="newProduct.price" type="number"></v-text-field>
          <v-text-field label="Quantity" v-model="newProduct.quantity" type="number"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- Bouton pour ajouter le produit -->
          <v-btn color="primary" @click="addProduct">Add</v-btn>
          <!-- Bouton pour annuler l'ajout -->
          <v-btn color="grey" @click="addDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialogue pour l'édition de produit -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Edit Product</v-card-title>
        <v-card-text>
          <!-- Champs de formulaire pour modifier un produit existant -->
          <v-text-field label="Name" v-model="editedProduct.name"></v-text-field>
          <v-text-field label="Description" v-model="editedProduct.description"></v-text-field>
          <v-text-field label="Price" v-model="editedProduct.price" type="number"></v-text-field>
          <v-text-field label="Quantity" v-model="editedProduct.quantity" type="number"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- Bouton pour enregistrer les modifications -->
          <v-btn color="primary" @click="editProduct">Save</v-btn>
          <!-- Bouton pour annuler la modification -->
          <v-btn color="grey" @click="editDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialogue pour la confirmation de suppression de produit -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Confirm Deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete this product?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- Bouton pour confirmer la suppression -->
          <v-btn color="primary" text @click="deleteProduct">Yes</v-btn>
          <!-- Bouton pour annuler la suppression -->
          <v-btn color="grey" text @click="deleteDialog = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { useProductStore } from '@/stores/productStore'; // Utilisation du store des produits via Pinia
import { removeAuthToken } from '@/utils/authUtils'; // Utilitaire pour gérer les tokens d'authentification
import { useAuthStore } from '@/stores/authStore'; // Utilisation du store d'authentification

export default {
  name: 'UserDashboard',
  data() {
    return {
      search: '', // Terme de recherche
      addDialog: false, // Contrôle du dialogue d'ajout
      editDialog: false, // Contrôle du dialogue de modification
      deleteDialog: false, // Contrôle du dialogue de suppression
      newProduct: { // Nouveau produit à ajouter
        name: '',
        description: '',
        price: '',
        quantity: ''
      },
      updatedUser: { // Informations sur l'utilisateur connecté
        firstName: '',
        lastName: '',
        email: ''
      },
      editedProduct: {}, // Produit à modifier
      selectedProduct: null, // Produit sélectionné pour suppression
      user: {} // Stockage des informations utilisateur
    };
  },
  computed: {
    // Filtrer les produits en fonction du terme de recherche
    filteredProducts() {
      return this.productStore.products.filter(product =>
        product.name.toLowerCase().includes(this.search.toLowerCase()) ||
        product.description.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  async created() {
    this.user = JSON.parse(this.$route.query.user || '{}'); // Obtenir les données utilisateur à partir des paramètres de la route
    await this.productStore.fetchProducts(); // Récupérer la liste des produits via le store
    const authStore = useAuthStore();

    // Charger les informations utilisateur si elles ne sont pas déjà disponibles
    try {
      if (!authStore.user) {
        await authStore.fetchAuthenticatedUser(); // Récupérer les informations de l'utilisateur connecté
      }
      this.updatedUser.firstName = authStore.user?.firstName || '';
      this.updatedUser.lastName = authStore.user?.lastName || '';
      this.updatedUser.email = authStore.user?.email || '';
    } catch (error) {
      console.error('Erreur lors du chargement des informations utilisateur', error);
    }
  },
  methods: {
    // Ouvrir le dialogue d'ajout de produit
    openAddDialog() {
      this.newProduct = { name: '', description: '', price: '', quantity: '' };
      this.addDialog = true;
    },
    // Ajouter un nouveau produit en utilisant le store
    async addProduct() {
      await this.productStore.addProduct(this.newProduct);
      this.addDialog = false;
      this.newProduct = { name: '', description: '', price: '', quantity: '' };
    },
    // Ouvrir le dialogue de modification pour un produit donné
    openEditDialog(product) {
      this.editedProduct = { ...product };
      this.editDialog = true;
    },
    // Modifier le produit sélectionné
    async editProduct() {
      await this.productStore.editProduct(this.editedProduct);
      this.editDialog = false;
    },
    // Confirmer la suppression d'un produit
    confirmDeleteProduct(product) {
      this.selectedProduct = product;
      this.deleteDialog = true;
    },
    // Supprimer le produit sélectionné
    async deleteProduct() {
      await this.productStore.deleteProduct(this.selectedProduct._id);
      this.deleteDialog = false;
    },
    // Déconnexion de l'utilisateur et redirection vers la page de connexion
    logout() {
      removeAuthToken();
      this.$router.push('/login');
    },
    // Rediriger vers la page de profil de l'utilisateur
    goToUserProfile() {
      this.$router.push('/profile');
    }
  },
  setup() {
    const productStore = useProductStore(); // Initialisation du store des produits avec Pinia
    return { productStore };
  }
};
</script>

<style scoped>
.v-card {
  border-radius: 12px; /* Style pour arrondir les cartes */
}
.product-table {
  overflow-x: auto; /* Assurer le défilement horizontal si nécessaire */
}
.product-table table {
  width: 100%; /* S'assurer que le tableau prend toute la largeur disponible */
  border-collapse: collapse; /* Supprimer les espaces entre les cellules */
}
.product-table th, .product-table td {
  border: 1px solid #ddd; /* Bordure pour les cellules */
  padding: 8px; /* Espacement à l'intérieur des cellules */
  text-align: left; /* Alignement du texte à gauche */
}
.product-table th {
  background-color: #f4f4f4; /* Couleur de fond des en-têtes */
  font-weight: bold; /* Gras pour les en-têtes */
}
.product-table tr:nth-child(even) {
  background-color: #f9f9f9; /* Couleur de fond alternée pour les lignes */
}
.product-table tr:hover {
  background-color: #f1f1f1; /* Couleur de fond au survol */
}
</style>
