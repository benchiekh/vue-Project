import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

export const register = (firstName, lastName, email, password, role = 'user') => {
    return axios.post(API_URL + 'register', { firstName, lastName, email, password, role });
  };  
  

export const login = (email, password) => {
  return axios.post(API_URL + 'login', { email, password });
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export const logout = () => {
  localStorage.removeItem('user');
};
export const getUsers = () => {
    return axios.get(API_URL + 'users');
  };
