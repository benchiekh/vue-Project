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
      <v-btn @click="logout" color="red" text>Logout</v-btn>
    </v-toolbar>

    <!-- Contenu du tableau de bord des produits -->
    <v-row class="mb-4">
      <v-col>
        <v-card class="pa-4" elevation="2">
          <v-card-title class="headline text-center">Welcome: {{ updatedUser.firstName}}</v-card-title>
          <v-card-subtitle class="text-center">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search description"
              single-line
              hide-details
            />
            <v-btn @click="openAddDialog" color="primary" class="mt-2">Add Product</v-btn>
          </v-card-subtitle>
          <v-data-table
            :headers="headers"
            :items="filteredProducts"
            item-key="id"
            class="elevation-1"
            :loading="productStore.loading"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn icon @click="openEditDialog(item)" class="mr-2" color="blue">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="confirmDeleteProduct(item)" class="red--text">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialogue pour l'ajout de produit -->
    <v-dialog v-model="addDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Add Product</v-card-title>
        <v-card-text>
          <v-text-field label="Name" v-model="newProduct.name"></v-text-field>
          <v-text-field label="Description" v-model="newProduct.description"></v-text-field>
          <v-text-field label="Price" v-model="newProduct.price" type="number"></v-text-field>
          <v-text-field label="Quantity" v-model="newProduct.quantity" type="number"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="addProduct">Add</v-btn>
          <v-btn color="grey" @click="addDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialogue pour l'édition de produit -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Edit Product</v-card-title>
        <v-card-text>
          <v-text-field label="Name" v-model="editedProduct.name"></v-text-field>
          <v-text-field label="Description" v-model="editedProduct.description"></v-text-field>
          <v-text-field label="Price" v-model="editedProduct.price" type="number"></v-text-field>
          <v-text-field label="Quantity" v-model="editedProduct.quantity" type="number"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="editProduct">Save</v-btn>
          <v-btn color="grey" @click="editDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialogue pour la confirmation de suppression -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Confirm Deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete this product?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="deleteProduct">Yes</v-btn>
          <v-btn color="grey" text @click="deleteDialog = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { useProductStore } from '@/stores/productStore';
import { removeAuthToken } from '@/utils/authUtils';
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'UserDashboard',
  data() {
    return {
      search: '',
      addDialog: false,
      editDialog: false,
      deleteDialog: false,
      newProduct: {
        name: '',
        description: '',
        price: '',
        quantity: ''
      }, updatedUser: {
                firstName: '',
                lastName: '',
                email: ''
            },
      editedProduct: {},
      selectedProduct: null,
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Price', value: 'price' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      user: {}
    };
  },
  computed: {
    filteredProducts() {
      return this.productStore.products.filter(product =>
        product.name.toLowerCase().includes(this.search.toLowerCase()) ||
        product.description.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  async created() {
    this.user = JSON.parse(this.$route.query.user || '{}');
    await this.productStore.fetchProducts();
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
    openAddDialog() {
      this.newProduct = { name: '', description: '', price: '', quantity: '' };
      this.addDialog = true;
    },
    async addProduct() {
      await this.productStore.addProduct(this.newProduct);
      this.addDialog = false;
      this.newProduct = { name: '', description: '', price: '', quantity: '' };
    },
    openEditDialog(product) {
      this.editedProduct = { ...product };
      this.editDialog = true;
    },
    async editProduct() {
      await this.productStore.editProduct(this.editedProduct);
      this.editDialog = false;
    },
    confirmDeleteProduct(product) {
      this.selectedProduct = product;
      this.deleteDialog = true;
    },
    async deleteProduct() {
      await this.productStore.deleteProduct(this.selectedProduct._id);
      this.deleteDialog = false;
    },
    logout() {
      removeAuthToken();
      this.$router.push('/login');
    },
    // Nouvelle méthode pour rediriger vers la page de profil
    goToUserProfile() {
      this.$router.push('/profile'); // Assurez-vous que la route '/userprofile' est bien définie dans le router
    }
  },
  setup() {
    const productStore = useProductStore();
    return { productStore };
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
  background-color: #000000;
  color: rgb(217, 7, 7);
}
</style>