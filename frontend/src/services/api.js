import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Usuários
export const getUsuarios = () => api.get('/usuarios');
export const getUsuarioById = (id) => api.get(`/usuarios/${id}`);
export const createUsuario = (usuario) => api.post('/usuarios', usuario);
export const updateUsuario = (id, usuario) => api.put(`/usuarios/${id}`, usuario);
export const deleteUsuario = (id) => api.delete(`/usuarios/${id}`);
export const getMe = () => api.get('/usuarios/me');

export default api;