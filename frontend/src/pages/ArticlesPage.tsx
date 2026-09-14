import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
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
  Chip,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import { articleAPI, categoryAPI, networkAPI } from '../services/api';
import { useAppStore } from '../store/appStore';
import type { Article, Category, Network } from '../types/index';
import { StatusBadge } from '../components/common/StatusBadge';
import { CategoryBadges } from '../components/common/CategoryBadges';
import { LoadingWrapper } from '../components/common/LoadingWrapper';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', network: '', featured: false });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newArticle, setNewArticle] = useState<Partial<Article>>({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    categories: [],
    network: '',
    status: 'draft',
    featured: false,
  });

  const categoryMap = new Map(categories.map(c => [c.id, c]));

  useEffect(() => {
    loadData();
  }, [page, search, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [articlesData, categoriesData, networksData] = await Promise.all([
        articleAPI.getAll({
          page,
          limit: 20,
          search: search || undefined,
          status: filters.status as any,
          network: filters.network || undefined,
          featured: filters.featured || undefined,
        }),
        categoryAPI.getAll(),
        networkAPI.getAll(),
      ]);
      setArticles(articlesData.data);
      setCategories(categoriesData);
      setNetworks(networksData);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveArticle = async () => {
    try {
      if (editingId) {
        await articleAPI.update(editingId, newArticle as any);
      } else {
        await articleAPI.create(newArticle as any);
      }
      setEditingId(null);
      setNewArticle({
        title: '',
        content: '',
        excerpt: '',
        author: '',
        categories: [],
        network: '',
        status: 'draft',
        featured: false,
      });
      loadData();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await articleAPI.delete(deleteId);
      setDeleteId(null);
      loadData();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleStatusChange = async (id: string, status: 'draft' | 'published' | 'archived') => {
    try {
      await articleAPI.updateStatus(id, status);
      loadData();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <h1>📰 Gestion des Articles</h1>
        <Button variant="contained" onClick={() => setEditingId('new')}>
          ➕ Nouvel Article
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
          <TextField
            placeholder="🔍 Rechercher..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            size="small"
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Statut</InputLabel>
            <Select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              label="Statut"
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="draft">Brouillon</MenuItem>
              <MenuItem value="published">Publié</MenuItem>
              <MenuItem value="archived">Archivé</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Réseau</InputLabel>
            <Select
              value={filters.network}
              onChange={(e) => setFilters({ ...filters, network: e.target.value })}
              label="Réseau"
            >
              <MenuItem value="">Tous</MenuItem>
              {networks.map((net) => (
                <MenuItem key={net.id} value={net.id}>
                  {net.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Articles Table */}
      <LoadingWrapper isLoading={loading} children={
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Titre</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Auteur</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Statut</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Catégories</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell sx={{ fontWeight: 500 }}>{article.title}</TableCell>
                    <TableCell>{article.author}</TableCell>
                    <TableCell>
                      <StatusBadge status={article.status} />
                    </TableCell>
                    <TableCell>
                      <CategoryBadges categories={article.categories} categoryMap={categoryMap} />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button size="small" variant="outlined" onClick={() => {
                          setEditingId(article.id);
                          setNewArticle(article);
                        }}>
                          ✏️ Éditer
                        </Button>
                        <Button size="small" variant="outlined" color="error" onClick={() => setDeleteId(article.id)}>
                          🗑️ Supprimer
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Pagination count={10} page={page} onChange={(e, value) => setPage(value)} />
          </Box>
        </>
      } />

      {/* Edit Dialog */}
      <Dialog open={editingId !== null} onClose={() => setEditingId(null)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId === 'new' ? '➕ Nouvel Article' : '✏️ Éditer Article'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Titre"
              value={newArticle.title || ''}
              onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
            />
            <TextField
              fullWidth
              label="Auteur"
              value={newArticle.author || ''}
              onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
            />
            <TextField
              fullWidth
              label="Extrait"
              value={newArticle.excerpt || ''}
              onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Contenu"
              value={newArticle.content || ''}
              onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
              multiline
              rows={6}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingId(null)}>Annuler</Button>
          <Button onClick={handleSaveArticle} variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteId !== null}
        title="Supprimer l'article"
        message="Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible."
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Container>
  );
};
