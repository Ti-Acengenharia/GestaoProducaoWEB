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
  Alert,
  Snackbar,
  Tooltip,
  TablePagination
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  SquareFoot as UnitIcon
} from '@mui/icons-material';
import { getUnidades, createUnidade, updateUnidade, deleteUnidade } from '../../services/api';

const UnidadesPage = () => {
  const [unidades, setUnidades] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUnidade, setSelectedUnidade] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    abreviacao: ''
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

  const filteredUnidades = unidades.filter((u) => {
    if (!activeSearchQuery) return true;
    const query = activeSearchQuery.toLowerCase();
    return (
      u.nome?.toLowerCase().includes(query) ||
      u.abreviacao?.toLowerCase().includes(query)
    );
  });

  const paginatedUnidades = filteredUnidades.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    fetchUnidades();
  }, []);

  const fetchUnidades = async () => {
    try {
      const response = await getUnidades();
      setUnidades(response.data);
    } catch (error) {
      showSnackbar('Erro ao carregar unidades de medida', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpen = (unidade = null) => {
    if (unidade) {
      setSelectedUnidade(unidade);
      setFormData({
        nome: unidade.nome || '',
        abreviacao: unidade.abreviacao || ''
      });
    } else {
      setSelectedUnidade(null);
      setFormData({
        nome: '',
        abreviacao: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUnidade(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedUnidade) {
        await updateUnidade(selectedUnidade.id, formData);
        showSnackbar('Unidade atualizada com sucesso');
      } else {
        await createUnidade(formData);
        showSnackbar('Unidade criada com sucesso');
      }
      handleClose();
      fetchUnidades();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar unidade';
      showSnackbar(message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta unidade?')) {
      try {
        await deleteUnidade(id);
        showSnackbar('Unidade excluída com sucesso');
        fetchUnidades();
      } catch (error) {
        showSnackbar('Erro ao excluir unidade', 'error');
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
          Nova Unidade
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Abreviação (Sigla)</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUnidades.map((unidade) => (
              <TableRow key={unidade.id} hover>
                <TableCell>{unidade.nome}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#103795' }}>{unidade.abreviacao}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(unidade)} color="primary" size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(unidade.id)} color="error" size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {paginatedUnidades.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  Nenhuma unidade de medida encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[50]}
        component="div"
        count={filteredUnidades.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        sx={{ borderTop: '1px solid #e0e0e0' }}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 700, color: '#103795', display: 'flex', alignItems: 'center', gap: 1 }}>
            <UnitIcon />
            {selectedUnidade ? 'Editar Unidade' : 'Nova Unidade'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Nome da Unidade (ex: Metro)"
                fullWidth
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
              <TextField
                label="Abreviação (ex: m)"
                fullWidth
                required
                value={formData.abreviacao}
                onChange={(e) => setFormData({ ...formData, abreviacao: e.target.value })}
                placeholder="Ex: m, m2, kg, un"
              />
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

export default UnidadesPage;