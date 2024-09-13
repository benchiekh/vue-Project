<template>
  <v-container>
    <!-- Toolbar with Logout Button -->
    <v-toolbar flat>
      <v-toolbar-title>User Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="logout" color="red" text>Logout</v-btn>
    </v-toolbar>

    <v-row class="mb-4">
      <v-col>
        <v-card class="pa-4" elevation="2">
          <v-card-title class="headline text-center">Welcome : {{ user.firstName }}</v-card-title>
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
            :loading="loading"
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

    <!-- Dialog for Add Product -->
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

    <!-- Dialog for Edit Product -->
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

    <!-- Dialog for Delete Confirmation -->
    <v-dialog v-model="deleteDialog" max-width="400">
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
import { getProducts, addProduct as addProductService, editProduct as editProductService, deleteProduct as deleteProductService } from '@/services/productService';

export default {
  name: 'UserDashboard',
  data() {
    return {
      user: { firstName: '' },
      products: [],
      newProduct: {
        name: '',
        description: '',
        price: '',
        quantity: ''
      },
      editedProduct: {
        _id: null,
        name: '',
        description: '',
        price: '',
        quantity: ''
      },
      search: '',
      loading: false,
      addDialog: false,
      editDialog: false,
      deleteDialog: false,
      selectedProduct: {},
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Price', value: 'price' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product =>
        product.name.toLowerCase().includes(this.search.toLowerCase()) ||
        product.description.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  async created() {
    this.loading = true;
    try {
      const response = await getProducts();
      this.products = response.data;
    } catch (error) {
      console.error('There was an error fetching products!', error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    logout() {
      // Logique de déconnexion ici
      console.log('User logged out');
      // Redirection ou nettoyage des données d'authentification
      this.$router.push('/login'); // Redirection vers la page de connexion par exemple
    },
    openAddDialog() {
      this.newProduct = { name: '', description: '', price: '', quantity: '' };
      this.addDialog = true;
    },
    async addProduct() {
      try {
        const response = await addProductService(this.newProduct);
        this.products.push(response.data);
        this.addDialog = false;
        this.newProduct = { name: '', description: '', price: '', quantity: '' };
        alert('Product added successfully');
      } catch (error) {
        console.error('There was an error adding the product!', error);
        alert('Failed to add product');
      }
    },
    openEditDialog(product) {
      this.editedProduct = { ...product };
      console.log('Editing product:', this.editedProduct); // Vérifie que l'ID est présent
      console.log('Editing product with ID:', this.editedProduct._id); // Assure-toi que l'ID est bien là
      this.editDialog = true;
    },
    async editProduct() {
      try {
        if (!this.editedProduct._id) {
          throw new Error('Product ID is missing');
        }
        const updatedData = {
          name: this.editedProduct.name,
          description: this.editedProduct.description,
          price: this.editedProduct.price,
          quantity: this.editedProduct.quantity
        };
        await editProductService(this.editedProduct._id, updatedData);
        this.products = this.products.map(p => (p._id === this.editedProduct._id ? { ...p, ...updatedData } : p));
        this.editDialog = false;
        alert('Product updated successfully');
      } catch (error) {
        console.error('There was an error updating the product!', error);
        alert('Failed to update product');
      }
    },
    confirmDeleteProduct(product) {
      this.selectedProduct = product;
      console.log('Selected product for deletion:', this.selectedProduct); // Vérifie que l'ID est présent
      console.log('Selected product ID:', this.selectedProduct._id); // Assure-toi que l'ID est bien là
      this.deleteDialog = true;
    },
    async deleteProduct() {
      try {
        if (!this.selectedProduct._id) {
          throw new Error('Product ID is missing');
        }
        await deleteProductService(this.selectedProduct._id);
        this.products = this.products.filter(product => product._id !== this.selectedProduct._id);
        this.deleteDialog = false;
        alert('Product deleted successfully');
      } catch (error) {
        console.error('There was an error deleting the product!', error);
        alert('Failed to delete product');
      }
    }
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
