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
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Place as PlaceIcon
} from '@mui/icons-material';
import { getLocaisServico, createLocalServico, updateLocalServico, deleteLocalServico, getCentrosDeCusto } from '../../services/api';

const LocaisServicoPage = () => {
  const [locais, setLocais] = useState([]);
  const [centrosDeCusto, setCentrosDeCusto] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [formData, setFormData] = useState({
    nivel01: '',
    nivel02: '',
    nivel03: '',
    centroDeCustoId: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchLocais();
    fetchCentrosDeCusto();
  }, []);

  const fetchLocais = async () => {
    try {
      const response = await getLocaisServico();
      setLocais(response.data);
    } catch (error) {
      showSnackbar('Erro ao carregar locais de serviço', 'error');
    }
  };

  const fetchCentrosDeCusto = async () => {
    try {
      const response = await getCentrosDeCusto();
      setCentrosDeCusto(response.data);
    } catch (error) {
      showSnackbar('Erro ao carregar centros de custo', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpen = (local = null) => {
    if (local) {
      setSelectedLocal(local);
      setFormData({
        nivel01: local.nivel01 || '',
        nivel02: local.nivel02 || '',
        nivel03: local.nivel03 || '',
        centroDeCustoId: local.centroDeCustoId ? String(local.centroDeCustoId) : ''
      });
    } else {
      setSelectedLocal(null);
      setFormData({
        nivel01: '',
        nivel02: '',
        nivel03: '',
        centroDeCustoId: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedLocal(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = {
        nivel01: formData.nivel01,
        nivel02: formData.nivel02 || null,
        nivel03: formData.nivel03 || null,
        centroDeCustoId: formData.centroDeCustoId ? Number(formData.centroDeCustoId) : null
      };

      if (selectedLocal) {
        await updateLocalServico(selectedLocal.id, dataToSave);
        showSnackbar('Local de serviço atualizado com sucesso');
      } else {
        await createLocalServico(dataToSave);
        showSnackbar('Local de serviço criado com sucesso');
      }
      handleClose();
      fetchLocais();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar local de serviço';
      showSnackbar(message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este local de serviço?')) {
      try {
        await deleteLocalServico(id);
        showSnackbar('Local de serviço excluído com sucesso');
        fetchLocais();
      } catch (error) {
        showSnackbar('Erro ao excluir local de serviço', 'error');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#103795' }}>
          Locais de Serviço
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
        >
          Novo Local
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Nível 1</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Nível 2</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Nível 3</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Centro de Custo</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locais.map((local) => (
              <TableRow key={local.id} hover>
                <TableCell sx={{ fontWeight: 500 }}>{local.nivel01}</TableCell>
                <TableCell>{local.nivel02 || '-'}</TableCell>
                <TableCell>{local.nivel03 || '-'}</TableCell>
                <TableCell>{local.centroDeCustoNome || 'Não Informado'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(local)} color="primary" size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(local.id)} color="error" size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {locais.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  Nenhum local de serviço encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 700, color: '#103795', display: 'flex', alignItems: 'center', gap: 1 }}>
            <PlaceIcon />
            {selectedLocal ? 'Editar Local' : 'Novo Local'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                select
                label="Centro de Custo"
                fullWidth
                required
                value={formData.centroDeCustoId}
                onChange={(e) => setFormData({ ...formData, centroDeCustoId: e.target.value })}
              >
                <MenuItem value="">
                  <em>Selecione um Centro de Custo</em>
                </MenuItem>
                {centrosDeCusto.map((cc) => (
                  <MenuItem key={cc.id} value={String(cc.id)}>
                    {cc.nome}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Nível 1 (ex: Bloco A)"
                fullWidth
                required
                value={formData.nivel01}
                onChange={(e) => setFormData({ ...formData, nivel01: e.target.value })}
              />
              <TextField
                label="Nível 2 (ex: Apt 101 - Opcional)"
                fullWidth
                value={formData.nivel02}
                onChange={(e) => setFormData({ ...formData, nivel02: e.target.value })}
              />
              <TextField
                label="Nível 3 (ex: Banheiro - Opcional)"
                fullWidth
                value={formData.nivel03}
                onChange={(e) => setFormData({ ...formData, nivel03: e.target.value })}
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

export default LocaisServicoPage;