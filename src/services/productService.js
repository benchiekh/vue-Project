import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; 

export const getProducts = () => {
  return axios.get(`${API_URL}/products`);
};

export const addProduct = (productData) => {
  return axios.post(`${API_URL}/products`, productData);
};

export const editProduct = (id, productData) => {
  return axios.put(`${API_URL}/products/${id}`, productData);
};

export const deleteProduct = (id) => {
  return axios.delete(`${API_URL}/products/${id}`);
};
