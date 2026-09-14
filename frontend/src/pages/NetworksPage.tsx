import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Box,
  Alert,
} from '@mui/material';
import { networkAPI } from '../services/api';
import type { Network } from '../types/index';
import { LoadingWrapper } from '../components/common/LoadingWrapper';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const NetworksPage: React.FC = () => {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newNetwork, setNewNetwork] = useState<Partial<Network>>({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadNetworks();
  }, []);

  const loadNetworks = async () => {
    try {
      setLoading(true);
      const data = await networkAPI.getAll();
      setNetworks(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await networkAPI.update(editingId, newNetwork as any);
      } else {
        await networkAPI.create(newNetwork as any);
      }
      setEditingId(null);
      setNewNetwork({ name: '', description: '' });
      loadNetworks();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await networkAPI.delete(deleteId);
      setDeleteId(null);
      loadNetworks();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <h1>🌐 Gestion des Réseaux</h1>
        <Button variant="contained" onClick={() => setEditingId('new')}>
          ➕ Nouveau Réseau
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <LoadingWrapper isLoading={loading} children={
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Nom</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Créé le</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {networks.map((network) => (
                <TableRow key={network.id}>
                  <TableCell sx={{ fontWeight: 500 }}>{network.name}</TableCell>
                  <TableCell>{network.description}</TableCell>
                  <TableCell>{new Date(network.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setEditingId(network.id);
                          setNewNetwork(network);
                        }}
                      >
                        ✏️
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => setDeleteId(network.id)}
                      >
                        🗑️
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      } />

      {/* Edit Dialog */}
      <Dialog open={editingId !== null} onClose={() => setEditingId(null)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId === 'new' ? '➕ Nouveau Réseau' : '✏️ Éditer Réseau'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nom"
              value={newNetwork.name || ''}
              onChange={(e) => setNewNetwork({ ...newNetwork, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Description"
              value={newNetwork.description || ''}
              onChange={(e) => setNewNetwork({ ...newNetwork, description: e.target.value })}
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingId(null)}>Annuler</Button>
          <Button onClick={handleSave} variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteId !== null}
        title="Supprimer le réseau"
        message="Êtes-vous sûr de vouloir supprimer ce réseau ?"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Container>
  );
};
