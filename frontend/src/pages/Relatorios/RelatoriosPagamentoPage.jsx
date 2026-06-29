import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  CircularProgress,
  Divider,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Description as ExcelIcon,
  AccountBalance as BankIcon,
  Assessment as ReportIcon
} from '@mui/icons-material';
import { getCentrosDeCusto, getProducoes, getColaboradores } from '../../services/api';

const RelatoriosPagamentoPage = ({ selectedObraId }) => {
  const [obras, setObras] = useState([]);
  const [producoes, setProducoes] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros locais
  const [filterObra, setFilterObra] = useState(selectedObraId || 'all');
  const [month, setMonth] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${m}`;
  });

  useEffect(() => {
    if (selectedObraId) {
      setFilterObra(selectedObraId);
    }
  }, [selectedObraId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [obrasRes, prodRes, colabsRes] = await Promise.all([
          getCentrosDeCusto(),
          getProducoes(),
          getColaboradores()
        ]);

        if (typeof obrasRes.data === 'string' && obrasRes.data.includes('<!DOCTYPE html>')) {
          window.location.href = '/login';
          return;
        }

        setObras(Array.isArray(obrasRes.data) ? obrasRes.data : []);
        setProducoes(Array.isArray(prodRes.data) ? prodRes.data : []);
        setColaboradores(Array.isArray(colabsRes.data) ? colabsRes.data : []);
      } catch (error) {
        console.error('Erro ao carregar dados do relatório de pagamento:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Mascaramento para visualização em tela (segurança / LGPD)
  const maskCpf = (cpf) => {
    if (!cpf) return '';
    const cleaned = String(cpf).replace(/\D/g, '');
    if (cleaned.length < 3) return cleaned;
    return `${cleaned.substring(0, 3)}.***.***-**`;
  };

  const maskValue = (val, visibleStart = 1) => {
    if (!val) return '';
    const str = String(val).trim();
    if (str.length <= visibleStart) return '*'.repeat(str.length);
    return str.substring(0, visibleStart) + '*'.repeat(str.length - visibleStart);
  };

  // Agrupar dados
  const getPaymentsData = () => {
    // 1. Filtrar produções pela data (mês) e pela obra
    const filtered = producoes.filter((p) => {
      if (filterObra !== 'all' && p.centroCustoId !== filterObra) {
        return false;
      }
      // Verifica se a data da produção começa com o ano-mês selecionado (Ex: '2026-06')
      return p.data && p.data.startsWith(month);
    });

    // 2. Acumular valores a receber por colaborador
    const paymentMap = {};
    filtered.forEach((p) => {
      const ids = Array.from(p.colaboradoresIds || []);
      if (ids.length === 0) return;
      const shareValue = (p.valorTotal || 0) / ids.length;
      ids.forEach((id) => {
        paymentMap[id] = (paymentMap[id] || 0) + shareValue;
      });
    });

    // 3. Cruzar com os dados completos dos colaboradores
    const payments = [];
    colaboradores.forEach((colab) => {
      const totalReceive = paymentMap[colab.id] || 0;
      if (totalReceive > 0) {
        payments.push({
          colaborador: colab,
          totalReceive
        });
      }
    });

    return payments.sort((a, b) => b.totalReceive - a.totalReceive);
  };

  const paymentsData = getPaymentsData();
  const grandTotal = paymentsData.reduce((sum, item) => sum + item.totalReceive, 0);

  const handleExportExcel = () => {
    if (paymentsData.length === 0) return;

    // Estruturar dados brutos (desmascarados) para o Excel
    const dataRows = paymentsData.map((item) => ({
      'Nome Completo': item.colaborador.nomeCompleto,
      'CPF': item.colaborador.cpf,
      'Agência': item.colaborador.agencia || '',
      'Operação': item.colaborador.operacao || '',
      'Conta': item.colaborador.numeroConta || '',
      'Valor a Receber (R$)': item.totalReceive
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataRows);

    // Ajustar larguras das colunas
    worksheet['!cols'] = [
      { wch: 35 }, // Nome Completo
      { wch: 18 }, // CPF
      { wch: 12 }, // Agência
      { wch: 12 }, // Operação
      { wch: 18 }, // Conta
      { wch: 22 }  // Valor a Receber (R$)
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Folha de Pagamento');

    // Salvar arquivo
    const obraNome = filterObra === 'all' 
      ? 'Todas_as_Obras' 
      : (obras.find(o => o.id === filterObra)?.nome || filterObra).replace(/\s+/g, '_');
    
    XLSX.writeFile(workbook, `relatorio_pagamento_${obraNome}_${month}.xlsx`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#103795', display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReportIcon fontSize="large" />
          Relatório de Pagamento
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<ExcelIcon />}
          onClick={handleExportExcel}
          disabled={loading || paymentsData.length === 0}
          sx={{ borderRadius: 2, textTransform: 'none', px: 4, py: 1.2, fontWeight: 600 }}
        >
          Exportar para Excel
        </Button>
      </Box>

      {/* Painel de Filtros */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#455a64' }}>
          Configurações do Relatório
        </Typography>
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Obra / Centro de Custo"
              fullWidth
              value={filterObra}
              onChange={(e) => setFilterObra(e.target.value)}
            >
              <MenuItem value="all"><em>Todas as Obras</em></MenuItem>
              {obras.map((o) => (
                <MenuItem key={o.id} value={o.id}>
                  {o.id} - {o.nome}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Mês de Referência"
              type="month"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Preview do Relatório */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {/* Card de Resumo do Preview */}
          <Paper sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: '#e8f0fe', border: '1px solid #b3d1ff', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" color="textSecondary" display="block">Colaboradores a Receber</Typography>
              <Typography variant="h6" color="#103795" sx={{ fontWeight: 700 }}>{paymentsData.length} profissionais</Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
            <Box>
              <Typography variant="caption" color="textSecondary" display="block">Valor Total Folha de Pagamento</Typography>
              <Typography variant="h6" color="#103795" sx={{ fontWeight: 700 }}>{formatCurrency(grandTotal)}</Typography>
            </Box>
          </Paper>

          {/* Listagem de Colaboradores e seus valores */}
          {paymentsData.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="body1" color="textSecondary">
                Nenhum pagamento correspondente aos filtros selecionados.
              </Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <Table size="medium">
                <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Nome Completo</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>CPF</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Dados Bancários (Ag / Op / Conta)</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Valor Total a Receber</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentsData.map((item) => {
                    const c = item.colaborador;
                    return (
                      <TableRow key={c.id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{c.nomeCompleto}</TableCell>
                        <TableCell>{maskCpf(c.cpf)}</TableCell>
                        <TableCell>
                          <Tooltip title="Dados Bancários (Oculto na tela para proteção de dados)">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <BankIcon sx={{ fontSize: '1rem', color: '#666' }} />
                              <Typography variant="body2" sx={{ color: '#555' }}>
                                {maskValue(c.agencia, 1)} / {maskValue(c.operacao, 1)} / {maskValue(c.numeroConta, 2)}
                              </Typography>
                            </Box>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#103795' }}>
                          {formatCurrency(item.totalReceive)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow sx={{ bgcolor: '#f8f9fa', '& td': { fontWeight: 700, color: '#103795', fontSize: '1rem' } }}>
                    <TableCell colSpan={3} align="right">Total Geral:</TableCell>
                    <TableCell align="right">{formatCurrency(grandTotal)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}
    </Box>
  );
};

export default RelatoriosPagamentoPage;
