import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Avatar,
  Tooltip,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Google as GoogleIcon
} from '@mui/icons-material';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../../services/api';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    roles: ['USER']
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Estados para busca e paginação
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const rowsPerPage = 50;

  const handleSearch = () => {
    setActiveSearchQuery(searchQuery);
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveSearchQuery('');
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredUsuarios = usuarios.filter((user) => {
    if (!activeSearchQuery) return true;
    const query = activeSearchQuery.toLowerCase();
    const rolesStr = user.roles?.join(', ') || '';
    return (
      user.nome?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      rolesStr.toLowerCase().includes(query)
    );
  });

  const paginatedUsuarios = filteredUsuarios.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await getUsuarios();
      setUsuarios(response.data);
    } catch (error) {
      showSnackbar('Erro ao carregar usuários', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpen = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        senha: '',
        roles: Array.isArray(user.roles) ? user.roles : ['USER']
      });
    } else {
      setSelectedUser(null);
      setFormData({
        nome: '',
        email: '',
        senha: '',
        roles: ['USER']
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        ...formData,
        roles: Array.isArray(formData.roles) ? formData.roles : [formData.roles]
      };
      
      if (selectedUser) {
        await updateUsuario(selectedUser.id, { ...selectedUser, ...payload });
        showSnackbar('Usuário atualizado com sucesso');
      } else {
        await createUsuario(payload);
        showSnackbar('Usuário criado com sucesso');
      }
      handleClose();
      fetchUsuarios();
    } catch (error) {
      showSnackbar('Erro ao salvar usuário', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await deleteUsuario(id);
        showSnackbar('Usuário excluído com sucesso');
        fetchUsuarios();
      } catch (error) {
        showSnackbar('Erro ao excluir usuário', 'error');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Pesquisar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            sx={{ width: 250 }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{ textTransform: 'none', height: 40 }}
          >
            Pesquisar
          </Button>
          {activeSearchQuery && (
            <Button
              variant="text"
              onClick={handleClearSearch}
              sx={{ textTransform: 'none' }}
            >
              Limpar
            </Button>
          )}
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ borderRadius: 2, textTransform: 'none', px: 3, height: 40 }}
        >
          Novo Usuário
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Usuário</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Funções</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsuarios.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={user.profilePicture} sx={{ bgcolor: '#103795' }}>
                      {!user.profilePicture && (user.nome ? user.nome.charAt(0) : <PersonIcon />)}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {user.nome || 'Sem nome'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.googleId ? (
                    <Tooltip title="Login via Google">
                      <Chip 
                        icon={<GoogleIcon sx={{ fontSize: '1rem !important' }} />} 
                        label="Google" 
                        size="small" 
                        variant="outlined" 
                        color="primary"
                      />
                    </Tooltip>
                  ) : (
                    <Chip label="Interno" size="small" variant="outlined" />
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {user.roles?.map((role) => (
                      <Chip key={role} label={role} size="small" sx={{ backgroundColor: '#e8f0fe', color: '#103795' }} />
                    ))}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(user)} color="primary" size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)} color="error" size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {paginatedUsuarios.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[50]}
        component="div"
        count={filteredUsuarios.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        sx={{ borderTop: '1px solid #e0e0e0' }}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 700, color: '#103795' }}>
            {selectedUser ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Nome"
                fullWidth
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {!selectedUser && (
                <TextField
                  label="Senha"
                  type="password"
                  fullWidth
                  required
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                />
              )}
              {selectedUser && !selectedUser.googleId && (
                <TextField
                  label="Nova Senha (deixe em branco para não alterar)"
                  type="password"
                  fullWidth
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                />
              )}
              
              <FormControl fullWidth required>
                <InputLabel>Função (Perfil)</InputLabel>
                <Select
                  value={formData.roles[0] || 'USER'}
                  label="Função (Perfil)"
                  onChange={(e) => setFormData({ ...formData, roles: [e.target.value] })}
                >
                  <MenuItem value="USER">Usuário (USER)</MenuItem>
                  <MenuItem value="ADMIN">Administrador (ADMIN)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleClose} sx={{ textTransform: 'none' }}>Cancelar</Button>
            <Button type="submit" variant="contained" sx={{ textTransform: 'none', px: 3 }}>
              Salvar
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UsuariosPage;