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

// Centros de Custo
export const getCentrosDeCusto = () => api.get('/centros-de-custo');
export const getCentroDeCustoById = (id) => api.get(`/centros-de-custo/${id}`);
export const createCentroDeCusto = (centro) => api.post('/centros-de-custo', centro);
export const updateCentroDeCusto = (id, centro) => api.put(`/centros-de-custo/${id}`, centro);
export const deleteCentroDeCusto = (id) => api.delete(`/centros-de-custo/${id}`);

// Unidades de Medida
export const getUnidades = () => api.get('/unidades');
export const getUnidadeById = (id) => api.get(`/unidades/${id}`);
export const createUnidade = (unidade) => api.post('/unidades', unidade);
export const updateUnidade = (id, unidade) => api.put(`/unidades/${id}`, unidade);
export const deleteUnidade = (id) => api.delete(`/unidades/${id}`);

// Locais de Serviço
export const getLocaisServico = () => api.get('/locais-servico');
export const getLocalServicoById = (id) => api.get(`/locais-servico/${id}`);
export const createLocalServico = (local) => api.post('/locais-servico', local);
export const updateLocalServico = (id, local) => api.put(`/locais-servico/${id}`, local);
export const deleteLocalServico = (id) => api.delete(`/locais-servico/${id}`);

// Colaboradores
export const getColaboradores = () => api.get('/colaboradores');
export const getColaboradorById = (id) => api.get(`/colaboradores/${id}`);
export const createColaborador = (colaborador) => api.post('/colaboradores', colaborador);
export const updateColaborador = (id, colaborador) => api.put(`/colaboradores/${id}`, colaborador);
export const deleteColaborador = (id) => api.delete(`/colaboradores/${id}`);

// Acordos (Serviços)
export const getAcordos = () => api.get('/acordos');
export const getAcordoById = (id) => api.get(`/acordos/${id}`);
export const createAcordo = (acordo) => api.post('/acordos', acordo);
export const updateAcordo = (id, acordo) => api.put(`/acordos/${id}`, acordo);
export const deleteAcordo = (id) => api.delete(`/acordos/${id}`);

// Produções
export const getProducoes = () => api.get('/producoes');
export const createProducao = (producao) => api.post('/producoes', producao);
export const deleteProducao = (id) => api.delete(`/producoes/${id}`);

// Logout
export const logout = () => api.post('/logout');

export default api;