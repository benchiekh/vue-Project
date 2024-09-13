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
import { useProductStore } from '@/stores/productStore';

export default {
  name: 'UserDashboard',
  data() {
    return {
      user: { firstName: '' },
      search: '',
      addDialog: false,
      editDialog: false,
      deleteDialog: false,
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
      return this.productStore.products.filter(product =>
        product.name.toLowerCase().includes(this.search.toLowerCase()) ||
        product.description.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  async created() {
    await this.productStore.fetchProducts();
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
        console.log('User logged out');
      this.$router.push('/login'); 
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
