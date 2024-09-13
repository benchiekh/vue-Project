import axios from 'axios';
import { getAuthToken } from '@/utils/authUtils';

const API_URL = 'http://localhost:5000/api/auth'; 

export const getProducts = () => {
  const token = getAuthToken();
  return axios.get(`${API_URL}/products`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
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
