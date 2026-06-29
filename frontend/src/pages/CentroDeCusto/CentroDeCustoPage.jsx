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
  AccountTree as CostCenterIcon
} from '@mui/icons-material';
import { getCentrosDeCusto, createCentroDeCusto, updateCentroDeCusto, deleteCentroDeCusto } from '../../services/api';

const CentroDeCustoPage = () => {
  const [centros, setCentros] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCentro, setSelectedCentro] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    nome: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
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

  const filteredCentros = centros.filter((c) => {
    if (!activeSearchQuery) return true;
    const query = activeSearchQuery.toLowerCase();
    return (
      c.nome?.toLowerCase().includes(query) ||
      c.id?.toString().includes(query)
    );
  });

  const paginatedCentros = filteredCentros.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    fetchCentros();
  }, []);

  const fetchCentros = async () => {
    try {
      const response = await getCentrosDeCusto();
      setCentros(response.data);
    } catch (error) {
      showSnackbar('Erro ao carregar centros de custo', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpen = (centro = null) => {
    if (centro) {
      setSelectedCentro(centro);
      setFormData({
        id: centro.id.toString(),
        nome: centro.nome || ''
      });
    } else {
      setSelectedCentro(null);
      setFormData({
        id: '',
        nome: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCentro(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        id: parseInt(formData.id),
        nome: formData.nome
      };

      if (selectedCentro) {
        await updateCentroDeCusto(selectedCentro.id, payload);
        showSnackbar('Centro de Custo atualizado com sucesso');
      } else {
        await createCentroDeCusto(payload);
        showSnackbar('Centro de Custo criado com sucesso');
      }
      handleClose();
      fetchCentros();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar centro de custo';
      showSnackbar(message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este centro de custo?')) {
      try {
        await deleteCentroDeCusto(id);
        showSnackbar('Centro de Custo excluído com sucesso');
        fetchCentros();
      } catch (error) {
        showSnackbar('Erro ao excluir centro de custo', 'error');
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
          Novo Centro
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, width: '150px' }}>Código (ID)</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Nome do Centro de Custo</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, width: '120px' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCentros.map((centro) => (
              <TableRow key={centro.id} hover>
                <TableCell sx={{ fontWeight: 500, color: '#103795' }}>{centro.id}</TableCell>
                <TableCell>{centro.nome}</TableCell>
                <TableCell align="right">
                   <IconButton onClick={() => handleOpen(centro)} color="primary" size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(centro.id)} color="error" size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {paginatedCentros.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  Nenhum centro de custo encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[50]}
        component="div"
        count={filteredCentros.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        sx={{ borderTop: '1px solid #e0e0e0' }}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 700, color: '#103795', display: 'flex', alignItems: 'center', gap: 1 }}>
            <CostCenterIcon />
            {selectedCentro ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Código (ID)"
                type="number"
                fullWidth
                required
                disabled={!!selectedCentro}
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                helperText={selectedCentro ? "O código não pode ser alterado" : "Insira o código numérico do centro de custo"}
              />
              <TextField
                label="Nome do Centro de Custo"
                fullWidth
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
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

export default CentroDeCustoPage;