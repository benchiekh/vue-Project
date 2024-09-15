import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';
const getAuthToken = () => localStorage.getItem('token');

export const registerService = (registerData) => {
  return axios.post(API_URL + '/register', registerData);
};

export const loginService = (loginData) => {  // Nom corrigé
  return axios.post(API_URL + '/login', loginData);
};

export const logout = () => {
  localStorage.removeItem('token'); // Suppression du token
};

export const getUsers = () => {
  return axios.get(API_URL + '/users', {
    headers: { Authorization: `Bearer ${getAuthToken()}` }
  });
};

export const deleteUserService = async (id) => {
  return axios.delete(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${getAuthToken()}` }
  });
};

export const editUserService = async (id, updatedData) => {
  return axios.put(`${API_URL}/users/${id}`, updatedData, {
    headers: { Authorization: `Bearer ${getAuthToken()}` }
  });
};

 
export const fetchAuthenticatedUser = async () => {
  const token = getAuthToken();
  return axios.get(`${API_URL}/user`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

export const updateUserService = async (updatedData) => {
  const token = getAuthToken();
  return axios.put(API_URL + '/user', updatedData, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
};