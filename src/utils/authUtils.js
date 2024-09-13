// src/utils/authUtils.js

// Récupérer le token stocké dans localStorage
export const getAuthToken = () => {
    return localStorage.getItem('token');
  };
  
  // Supprimer le token de localStorage lors de la déconnexion
  export const removeAuthToken = () => {
    localStorage.removeItem('token');
  };
 
  // Stocker un nouveau token dans localStorage
  export const setAuthToken = (token) => {
    localStorage.setItem('token', token);
  };
  