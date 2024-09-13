import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const registerService = (registerData) => {
  return axios.post(API_URL + '/register', registerData);
};

export const loginSerive = (loginData) => {
  return axios.post(API_URL + '/login', loginData);
};

// export const getUser = () => {
//   return JSON.parse(localStorage.getItem('user'));
// };

export const logout = () => {
  localStorage.removeItem('user');
};

export const getUsers = () => {
  return axios.get(API_URL + '/users');
};

// Nouvelle fonction pour supprimer un utilisateur

export const deleteUserService = async (id) => {
    return axios.delete(`${API_URL}/users/${id}`);
  };


  // edit user 

  export const editUserService = async (id, updatedData) => {
    return axios.put(`${API_URL}/users/${id}`, updatedData);
  };


