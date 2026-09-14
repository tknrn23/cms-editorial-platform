import React, { useState } from 'react';
import {
  Container,
  Paper,
  Button,
  Box,
  Alert,
  Typography,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
} from '@mui/material';
import { importAPI } from '../services/api';
import { LoadingWrapper } from '../components/common/LoadingWrapper';

interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{ row: number; error: string }>;
  importedIds: string[];
}

export const ImportPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [fileContent, setFileContent] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setFileContent(content);
        setError(null);
      } catch (err) {
        setError('Erreur lors de la lecture du fichier');
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    try {
      if (!fileContent) {
        setError('Veuillez sélectionner un fichier JSON');
        return;
      }

      const data = JSON.parse(fileContent);
      setLoading(true);
      const importResult = await importAPI.importArticles(data);
      setResult(importResult);
      setSuccess(
        `Import terminé: ${importResult.success} article(s) importé(s), ${importResult.failed} échec(s)`
      );
      setError(null);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Fichier JSON invalide');
      } else {
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        title: 'Article importé',
        content: 'Contenu de l\'article avec au moins 50 caractères...',
        excerpt: 'Résumé de l\'article',
        author: 'Nom de l\'auteur',
        category: 'nom-categorie',
        network: 'nom-reseau',
      },
    ];
    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'articles-template.json';
    link.click();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <h1>📥 Import de Données</h1>
        <Typography color="textSecondary" sx={{ mb: 2 }}>
          Importez des articles en masse depuis un fichier JSON
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          📂 Sélectionner un fichier JSON
        </Typography>

        <Box sx={{ mb: 3, p: 3, backgroundColor: '#f5f5f5', borderRadius: 2, textAlign: 'center' }}>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="file-input"
          />
          <label htmlFor="file-input">
            <Button
              variant="contained"
              component="span"
              size="large"
              sx={{ mb: 2 }}
            >
              📁 Choisir un fichier
            </Button>
          </label>
          {fileContent && (
            <Typography color="success" sx={{ mt: 2 }}>
              ✅ Fichier chargé avec succès
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button variant="contained" color="primary" onClick={handleImport} disabled={!fileContent || loading}>
            🚀 Importer
          </Button>
          <Button variant="outlined" onClick={downloadTemplate}>
            📥 Télécharger le modèle JSON
          </Button>
        </Stack>

        {loading && <LinearProgress />}
      </Paper>

      {/* Format Information */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          📋 Format JSON Attendu
        </Typography>
        <Box
          component="pre"
          sx={{
            backgroundColor: '#f5f5f5',
            p: 2,
            borderRadius: 1,
            overflow: 'auto',
            fontSize: '12px',
          }}
        >
          {`[
  {
    "title": "Titre de l'article (minimum 5 caractères)",
    "content": "Contenu détaillé (minimum 50 caractères)...",
    "excerpt": "Résumé court de l'article",
    "author": "Nom de l'auteur",
    "category": "Nom de la catégorie",
    "network": "Nom du réseau"
  }
]`}
        </Box>
      </Paper>

      {/* Import Results */}
      {result && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            📊 Résultats de l'Import
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={2}>
              <Card sx={{ flex: 1, backgroundColor: '#F0FDF4' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Succès
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#10B981' }}>
                    {result.success}
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ flex: 1, backgroundColor: '#FEF2F2' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Échecs
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#EF4444' }}>
                    {result.failed}
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ flex: 1, backgroundColor: '#F5F3FF' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total traité
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#8B5CF6' }}>
                    {result.success + result.failed}
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Box>

          {result.failed > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#EF4444', mb: 2 }}>
                ❌ Articles en erreur ({result.failed})
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Ligne</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Erreur</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {result.errors.map((err, idx) => (
                      <TableRow key={idx}>
                        <TableCell>#{err.row}</TableCell>
                        <TableCell>
                          <Chip label={err.error} size="small" color="error" variant="outlined" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
      )}
    </Container>
  );
};
