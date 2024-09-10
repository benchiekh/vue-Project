import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/'; 

export const getProducts = () => {
  return axios.get(API_URL);
};

export const addProduct = (productData) => {
  return axios.post(API_URL, productData);
};

export const editProduct = (id, productData) => {
  return axios.put(`${API_URL}${id}`, productData);
};

export const deleteProduct = (id) => {
  return axios.delete(`${API_URL}${id}`);
};
