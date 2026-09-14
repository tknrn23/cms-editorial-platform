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
  Chip,
} from '@mui/material';
import { categoryAPI } from '../../services/api';
import type { Category } from '../../types/index';
import { LoadingWrapper } from '../../components/common/LoadingWrapper';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    description: '',
    color: '#3B82F6',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryAPI.getAll();
      setCategories(data);
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
        await categoryAPI.update(editingId, newCategory as any);
      } else {
        await categoryAPI.create(newCategory as any);
      }
      setEditingId(null);
      setNewCategory({ name: '', description: '', color: '#3B82F6' });
      loadCategories();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await categoryAPI.delete(deleteId);
      setDeleteId(null);
      loadCategories();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <h1>🏷️ Gestion des Catégories</h1>
        <Button variant="contained" onClick={() => setEditingId('new')}>
          ➕ Nouvelle Catégorie
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <LoadingWrapper isLoading={loading} children={
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Couleur</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nom</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Slug</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: category.color,
                        borderRadius: 1,
                        border: '1px solid #ddd',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <Chip label={category.slug} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setEditingId(category.id);
                          setNewCategory(category);
                        }}
                      >
                        ✏️
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => setDeleteId(category.id)}
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
        <DialogTitle>{editingId === 'new' ? '➕ Nouvelle Catégorie' : '✏️ Éditer Catégorie'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nom"
              value={newCategory.name || ''}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Description"
              value={newCategory.description || ''}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              multiline
              rows={3}
            />
            <Box>
              <label htmlFor="color">Couleur:</label>
              <input
                id="color"
                type="color"
                value={newCategory.color || '#3B82F6'}
                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                style={{ marginLeft: 10, cursor: 'pointer' }}
              />
            </Box>
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
        title="Supprimer la catégorie"
        message="Êtes-vous sûr de vouloir supprimer cette catégorie ?"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Container>
  );
};
