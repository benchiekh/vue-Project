<template>
  <v-container>
    <v-row class="mb-4">
      <v-col>
        <v-card class="pa-4" elevation="2">
          <v-card-title class="headline text-center">Product Dashboard</v-card-title>
          <v-card-subtitle class="text-center">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />
          </v-card-subtitle>
          <v-card-actions class="pa-2">
            <v-btn color="primary" @click="openAddDialog">Add Product</v-btn>
          </v-card-actions>
          <v-data-table
            :headers="headers"
            :items="filteredProducts"
            item-key="id"
            class="elevation-1"
            :loading="loading"
          >
            <!-- Utilisation de scoped slots pour actions -->
            <template #item="{ item }">
              <v-data-table-row>
                <v-data-table-cell>{{ item.name }}</v-data-table-cell>
                <v-data-table-cell>{{ item.description }}</v-data-table-cell>
                <v-data-table-cell>{{ item.price }}</v-data-table-cell>
                <v-data-table-cell>{{ item.quantity }}</v-data-table-cell>
                <v-data-table-cell>{{ item.category }}</v-data-table-cell>
                <v-data-table-cell>
                  <v-btn icon @click="editProduct(item)" color="blue">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon @click="confirmDeleteProduct(item)" class="red--text">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-data-table-cell>
              </v-data-table-row>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog for Adding Product -->
    <v-dialog v-model="addDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Add Product</v-card-title>
        <v-card-text>
          <v-text-field label="Name" v-model="newProduct.name"></v-text-field>
          <v-text-field label="Description" v-model="newProduct.description"></v-text-field>
          <v-text-field label="Price" type="number" v-model="newProduct.price"></v-text-field>
          <v-text-field label="Quantity" type="number" v-model="newProduct.quantity"></v-text-field>
          <v-select
            label="Category"
            v-model="newProduct.category"
            :items="['Electronics', 'Clothing', 'Books', 'Other']"
          ></v-select>
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
          <v-text-field label="Price" type="number" v-model="editedProduct.price"></v-text-field>
          <v-text-field label="Quantity" type="number" v-model="editedProduct.quantity"></v-text-field>
          <v-select
            label="Category"
            v-model="editedProduct.category"
            :items="['Electronics', 'Clothing', 'Books', 'Other']"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveProduct">Save</v-btn>
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
          Are you sure you want to delete this product?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="deleteProductConfirmed">Yes</v-btn>
          <v-btn color="grey" text @click="deleteDialog = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { getProducts, deleteProduct, addProduct as addProductService, editProduct as editProductService } from '@/services/productService';

export default {
  name: 'ProductDashboard',
  data() {
    return {
      products: [],
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Price', value: 'price' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Category', value: 'category' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      search: '',
      loading: false,
      deleteDialog: false,
      addDialog: false,
      editDialog: false,
      productToDelete: null,
      newProduct: {
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        category: '',
      },
      editedProduct: {
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        category: '',
        id: null,
      }
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
    openAddDialog() {
      this.newProduct = {
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        category: '',
      };
      this.addDialog = true;
    },
    async addProduct() {
      try {
        const response = await addProductService(this.newProduct);
        this.products.push(response.data);
        this.addDialog = false;
        alert('Product added successfully');
      } catch (error) {
        console.error('There was an error adding the product!', error);
        alert('Failed to add product');
      }
    },
    editProduct(product) {
      this.editedProduct = { ...product };
      this.editDialog = true;
    },
    async saveProduct() {
      try {
        await editProductService(this.editedProduct.id, this.editedProduct);
        this.products = this.products.map(p => (p.id === this.editedProduct.id ? this.editedProduct : p));
        this.editDialog = false;
        alert('Product updated successfully');
      } catch (error) {
        console.error('There was an error updating the product!', error);
        alert('Failed to update product');
      }
    },
    confirmDeleteProduct(product) {
      this.productToDelete = product;
      this.deleteDialog = true;
    },
    async deleteProductConfirmed() {
      try {
        await deleteProduct(this.productToDelete.id);
        this.products = this.products.filter(product => product.id !== this.productToDelete.id);
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
