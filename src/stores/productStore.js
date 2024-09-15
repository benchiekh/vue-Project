 import { defineStore } from 'pinia';
import { getProducts, addProduct as addProductService, editProduct as editProductService, deleteProduct as deleteProductService } from '@/services/productService';

export const useProductStore = defineStore('productStore', {
  state: () => ({
    products: [],
    loading: false,
    selectedProduct: {},
  }),
  actions: {
    async fetchProducts() {
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
    async addProduct(newProduct) {
      try {
        const response = await addProductService(newProduct);
        this.products.push(response.data);
        alert('Product added successfully');
      } catch (error) {
        console.error('There was an error adding the product!', error);
        alert('Failed to add product');
      }
    },
    async editProduct(updatedProduct) {
      try {
        if (!updatedProduct._id) {
          throw new Error('Product ID is missing');
        }
        const response = await editProductService(updatedProduct._id, updatedProduct);
        this.products = this.products.map(p => (p._id === updatedProduct._id ? response.data : p));
        alert('Product updated successfully');
      } catch (error) {
        console.error('There was an error updating the product!', error);
        alert('Failed to update product');
      }
    },
    async deleteProduct(productId) {
      try {
        await deleteProductService(productId);
        this.products = this.products.filter(product => product._id !== productId);
        alert('Product deleted successfully');
      } catch (error) {
        console.error('There was an error deleting the product!', error);
        alert('Failed to delete product');
      }
    }
  }
});
