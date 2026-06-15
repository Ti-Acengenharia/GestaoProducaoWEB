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
  MenuItem,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Place as PlaceIcon,
  FileUpload as ImportIcon,
  CloudUpload as CloudUploadIcon,
  Help as HelpIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { getLocaisServico, createLocalServico, updateLocalServico, deleteLocalServico, getCentrosDeCusto, deleteLocaisServico } from '../../services/api';

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

  // Estados para importação em lote
  const [openImport, setOpenImport] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importErrors, setImportErrors] = useState([]);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [importCentroCustoId, setImportCentroCustoId] = useState('');

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

  const handleDeleteAll = async () => {
    const password = window.prompt("Para confirmar a exclusão de TODOS os locais de serviço, insira a senha:");
    if (password === null) return;
    if (password === '030206sexta') {
      if (window.confirm("ATENÇÃO: Isso excluirá permanentemente TODOS os locais de serviço. Deseja continuar?")) {
        try {
          await deleteLocaisServico();
          showSnackbar('Todos os locais de serviço foram excluídos com sucesso.');
          fetchLocais();
        } catch (error) {
          const message = error.response?.data?.message || 'Erro ao excluir locais de serviço (pode haver produções vinculadas).';
          showSnackbar(message, 'error');
        }
      }
    } else {
      showSnackbar('Senha incorreta! Operação cancelada.', 'error');
    }
  };

  // Funções de manipulação do drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImportFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0]);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `"Local";"Percentual inspecionado";"Percentual concluído";"Percentual executado";"NC totais";"NC abertas"\n` +
      `"Salão de Festas - W.C./Masculino ";"7.14";"7.14";"7.14";"0";"0"\n` +
      `"Torre 1 - Panorama";"100.00";"100.00";"100.00";"0";"0"\n` +
      `"Torre 1 - Panorama - Barrilete ";"0.00";"0.00";"0.00";"0";"0"\n` +
      `"Torre 1 - Panorama - Barrilete  - Parede de concreto ";"0.00";"0.00";"0.00";"0";"0"\n` +
      `"Torre 1 - Panorama - Barrilete  - Parede de concreto  - Ciclo 1";"0.00";"0.00";"0.00";"0";"0"`;

    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "modelo_locais.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportSubmit = async () => {
    if (!importFile) {
      showSnackbar('Por favor, selecione um arquivo primeiro.', 'warning');
      return;
    }
    if (!importCentroCustoId) {
      showSnackbar('Por favor, selecione o Centro de Custo.', 'warning');
      return;
    }

    setImporting(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const lines = text.split(/\r?\n/);
        if (lines.length === 0) {
          showSnackbar('Arquivo vazio.', 'error');
          setImporting(false);
          return;
        }

        const headerRowIndex = lines.findIndex(line => line && line.toLowerCase().includes('local'));
        if (headerRowIndex === -1) {
          showSnackbar('Cabeçalho "Local" não encontrado no CSV.', 'error');
          setImporting(false);
          return;
        }

        const dataLines = lines.slice(headerRowIndex + 1);
        const errors = [];
        const validData = [];
        const seenCombinations = new Set();

        dataLines.forEach((line, index) => {
          const lineNum = headerRowIndex + 2 + index;
          if (!line.trim()) return;

          const cols = line.split(';').map(col => {
            let val = col.trim();
            if (val.startsWith('"') && val.endsWith('"')) {
              val = val.substring(1, val.length - 1);
            }
            return val.trim();
          });

          const localString = cols[0];
          if (!localString) return;

          // Split por " - " tolerando múltiplos espaços
          const parts = localString.split(/\s*-\s*/).map(p => p.trim()).filter(Boolean);
          if (parts.length === 0) return;

          let nivel01 = '';
          let nivel02 = null;
          let nivel03 = null;

          // Se começar com "Torre" (case-insensitive) e tiver pelo menos 2 partes
          if (parts[0].toLowerCase().startsWith('torre') && parts.length > 1) {
            nivel01 = parts[0] + ' - ' + parts[1];
            const remaining = parts.slice(2);
            if (remaining.length === 1) {
              nivel02 = remaining[0];
            } else if (remaining.length === 2) {
              nivel02 = remaining[0];
              nivel03 = remaining[1];
            } else if (remaining.length > 2) {
              nivel02 = remaining[0];
              nivel03 = remaining.slice(1).join(' - ');
            }
          } else {
            nivel01 = parts[0];
            const remaining = parts.slice(1);
            if (remaining.length === 1) {
              nivel02 = remaining[0];
            } else if (remaining.length === 2) {
              nivel02 = remaining[0];
              nivel03 = remaining[1];
            } else if (remaining.length > 2) {
              nivel02 = remaining[0];
              nivel03 = remaining.slice(1).join(' - ');
            }
          }

          if (!nivel01) {
            errors.push({ line: lineNum, name: localString, reason: 'Nível 1 é obrigatório.' });
            return;
          }

          const combinationKey = `${nivel01.toLowerCase()}|${(nivel02 || '').toLowerCase()}|${(nivel03 || '').toLowerCase()}`;
          if (seenCombinations.has(combinationKey)) {
            errors.push({ line: lineNum, name: localString, reason: 'Registro duplicado no arquivo.' });
            return;
          }
          seenCombinations.add(combinationKey);

          const alreadyExists = locais.some(l => 
            l.centroDeCustoId === Number(importCentroCustoId) &&
            l.nivel01.toLowerCase() === nivel01.toLowerCase() &&
            (l.nivel02 || '').toLowerCase() === (nivel02 || '').toLowerCase() &&
            (l.nivel03 || '').toLowerCase() === (nivel03 || '').toLowerCase()
          );

          if (alreadyExists) {
            errors.push({ line: lineNum, name: localString, reason: 'Local já cadastrado para este Centro de Custo.' });
            return;
          }

          validData.push({
            nivel01,
            nivel02,
            nivel03,
            centroDeCustoId: Number(importCentroCustoId)
          });
        });

        if (validData.length > 0) {
          let count = 0;
          for (const item of validData) {
            try {
              await createLocalServico(item);
              count++;
            } catch (err) {
              errors.push({ line: 'API', name: `${item.nivel01}${item.nivel02 ? ' - ' + item.nivel02 : ''}`, reason: 'Erro de comunicação com o servidor.' });
            }
          }
          showSnackbar(`${count} locais de serviço importados com sucesso!`);
          fetchLocais();
        } else if (errors.length === 0) {
          showSnackbar('Nenhum registro válido para importação.', 'warning');
        }

        if (errors.length > 0) {
          setImportErrors(errors);
          setOpenErrorModal(true);
        }

        setOpenImport(false);
        setImportFile(null);
        setImportCentroCustoId('');
      } catch (err) {
        showSnackbar('Erro ao ler o arquivo CSV.', 'error');
      } finally {
        setImporting(false);
      }
    };

    reader.readAsText(importFile, 'ISO-8859-1');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#103795' }}>
          Locais de Serviço
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteAll}
            sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
          >
            Excluir Tudo
          </Button>
          <Button
            variant="outlined"
            startIcon={<ImportIcon />}
            onClick={() => setOpenImport(true)}
            sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
          >
            Importar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
          >
            Novo Local
          </Button>
        </Box>
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

      {/* Modal de Importação */}
      <Dialog 
        open={openImport} 
        onClose={() => {
          setOpenImport(false);
          setImportFile(null);
          setImportCentroCustoId('');
        }} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#103795', display: 'flex', alignItems: 'center', gap: 1 }}>
          <ImportIcon />
          Importação de Locais de Serviço em Lote
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={4}>
            {/* Instruções */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <HelpIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Instruções</Typography>
              </Box>
              <Typography variant="body2" paragraph>
                Selecione o Centro de Custo de destino e envie um arquivo CSV com os locais.
              </Typography>
              <Typography variant="body2" paragraph>
                O arquivo deve conter a coluna <strong>Local</strong> contendo os níveis separados por <strong>" - "</strong>.
              </Typography>
              <Box component="ul" sx={{ pl: 2, mb: 3 }}>
                <li><Typography variant="body2"><strong>Nível 1</strong>: ex: "Torre 1 - Panorama"</Typography></li>
                <li><Typography variant="body2"><strong>Nível 2</strong>: ex: "Cobertura" (Opcional)</Typography></li>
                <li><Typography variant="body2"><strong>Nível 3</strong>: ex: "Parede de concreto" (Opcional)</Typography></li>
              </Box>
              <Button 
                variant="outlined" 
                startIcon={<DownloadIcon />}
                size="small"
                sx={{ textTransform: 'none' }}
                onClick={downloadTemplate}
              >
                Baixar Modelo de CSV
              </Button>
            </Grid>

            {/* Form e Dropzone */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
                <TextField
                  select
                  label="Centro de Custo de Destino"
                  fullWidth
                  required
                  value={importCentroCustoId}
                  onChange={(e) => setImportCentroCustoId(e.target.value)}
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

                <Box
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  sx={{
                    border: '2px dashed',
                    borderColor: dragActive ? '#103795' : '#ccc',
                    borderRadius: 4,
                    p: 4,
                    textAlign: 'center',
                    backgroundColor: dragActive ? 'rgba(16, 55, 149, 0.05)' : '#fafafa',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '180px'
                  }}
                  onClick={() => document.getElementById('import-file-input').click()}
                >
                  <input
                    id="import-file-input"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <CloudUploadIcon sx={{ fontSize: 48, color: dragActive ? '#103795' : '#888', mb: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {importFile ? importFile.name : 'Arraste seu arquivo CSV aqui'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ou clique para selecionar do seu computador
                  </Typography>
                  {importFile && (
                    <Typography variant="caption" display="block" sx={{ mt: 1, color: 'green', fontWeight: 600 }}>
                      Arquivo selecionado com sucesso!
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => {
            setOpenImport(false);
            setImportFile(null);
            setImportCentroCustoId('');
          }} sx={{ textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button 
            onClick={handleImportSubmit} 
            variant="contained" 
            disabled={!importFile || !importCentroCustoId || importing}
            sx={{ textTransform: 'none', px: 4 }}
          >
            {importing ? <CircularProgress size={24} color="inherit" /> : 'Processar Importação'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Erro/Aviso de Importação */}
      <Dialog open={openErrorModal} onClose={() => setOpenErrorModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#d32f2f', display: 'flex', alignItems: 'center', gap: 1 }}>
          <HelpIcon />
          Registros Ignorados na Importação
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Os seguintes registros foram ignorados por estarem duplicados ou apresentarem erros:
          </Typography>
          <List dense>
            {importErrors.map((err, idx) => (
              <ListItem key={idx} sx={{ borderBottom: '1px solid #eee' }}>
                <ListItemIcon>
                  <Alert severity="warning" variant="filled" sx={{ p: 0, minWidth: 24, height: 24, '& .MuiAlert-icon': { mr: 0 } }} icon={false}>!</Alert>
                </ListItemIcon>
                <ListItemText 
                  primary={<strong>{err.name}</strong>}
                  secondary={`Linha ${err.line}: ${err.reason}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenErrorModal(false)} variant="contained" sx={{ textTransform: 'none' }}>
            Entendi
          </Button>
        </DialogActions>
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