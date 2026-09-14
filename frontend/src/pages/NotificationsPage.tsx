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
  Typography,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import { notificationAPI, articleAPI } from '../services/api';
import type { EmailNotification, Article } from '../types/index';
import { LoadingWrapper } from '../components/common/LoadingWrapper';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<EmailNotification[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [recipientsText, setRecipientsText] = useState('');
  const [subject, setSubject] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<EmailNotification | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [notifData, articlesData] = await Promise.all([
        notificationAPI.getAll(),
        articleAPI.getAll({ limit: 100 }),
      ]);
      setNotifications(notifData);
      setArticles(articlesData.data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!sendingId) return;
    try {
      const recipients = recipientsText
        .split(',')
        .map((email) => email.trim())
        .filter((email) => email.length > 0);

      if (recipients.length === 0) {
        setError('Veuillez entrer au moins un destinataire');
        return;
      }

      const result = await notificationAPI.send(sendingId, {
        recipients,
        subject: subject || 'Nouvel article publié',
      });

      setNotifications([result.notification, ...notifications]);
      setSendingId(null);
      setRecipientsText('');
      setSubject('');
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const getArticleTitle = (articleId: string) => {
    return articles.find((a) => a.id === articleId)?.title || 'Article inconnu';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <h1>📧 Gestion des Notifications Email</h1>
        <Typography color="textSecondary" sx={{ mb: 2 }}>
          Envoyez des notifications email aux lecteurs pour de nouveaux articles
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <LoadingWrapper
        isLoading={loading}
        children={
          <>
            {/* Historique des notifications */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                📋 Historique des Notifications Envoyées
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Article</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Sujet</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Destinataires</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Statut</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {notifications.map((notif) => (
                      <TableRow key={notif.id}>
                        <TableCell>{getArticleTitle(notif.articleId)}</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{notif.subject}</TableCell>
                        <TableCell>
                          <Chip label={`${notif.recipients.length} destinataire(s)`} size="small" />
                        </TableCell>
                        <TableCell>
                          {new Date(notif.sentAt).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={notif.status === 'sent' ? '✅ Envoyé' : '❌ Échoué'}
                            size="small"
                            variant="outlined"
                            color={notif.status === 'sent' ? 'success' : 'error'}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setSelectedNotification(notif)}
                          >
                            🔍 Voir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {notifications.length === 0 && (
                <Typography color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
                  Aucune notification envoyée pour le moment
                </Typography>
              )}
            </Paper>

            {/* Formulaire d'envoi */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                📨 Envoyer une Nouvelle Notification
              </Typography>
              <Stack spacing={3}>
                <TextField
                  select
                  fullWidth
                  label="Sélectionner un article"
                  value={sendingId || ''}
                  onChange={(e) => {
                    setSendingId(e.target.value);
                    const article = articles.find((a) => a.id === e.target.value);
                    if (article) {
                      setSubject(`Nouvel article: ${article.title}`);
                    }
                  }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">-- Sélectionnez un article --</option>
                  {articles.map((article) => (
                    <option key={article.id} value={article.id}>
                      {article.title}
                    </option>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Sujet de l'email"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: Nouvel article publié"
                />

                <TextField
                  fullWidth
                  label="Destinataires"
                  placeholder="email1@example.com, email2@example.com, ..."
                  value={recipientsText}
                  onChange={(e) => setRecipientsText(e.target.value)}
                  multiline
                  rows={3}
                  helperText="Séparez les adresses email par des virgules"
                />

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    onClick={() => setShowPreview(true)}
                    disabled={!sendingId || !subject || !recipientsText}
                  >
                    🔍 Prévisualiser
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSendNotification}
                    disabled={!sendingId || !subject || !recipientsText}
                  >
                    📧 Envoyer
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </>
        }
      />

      {/* Preview Dialog */}
      <Dialog open={showPreview} onClose={() => setShowPreview(false)} maxWidth="md" fullWidth>
        <DialogTitle>🔍 Prévisualisation de l'Email</DialogTitle>
        <DialogContent>
          {sendingId && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Sujet:</strong> {subject}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Destinataires ({recipientsText.split(',').length}):</strong>
              </Typography>
              <Box sx={{ mb: 2, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                {recipientsText.split(',').map((email) => (
                  <Chip key={email.trim()} label={email.trim()} size="small" sx={{ m: 0.5 }} />
                ))}
              </Box>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                <strong>Aperçu HTML:</strong>
              </Typography>
              <Card>
                <CardContent>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h2 style="color: #667eea;">Nouvel Article</h2>
                        <p>Un nouvel article a été publié</p>
                        <h3>${articles.find((a) => a.id === sendingId)?.title || 'Article'}</h3>
                        <p>${articles.find((a) => a.id === sendingId)?.excerpt || 'Extrait'}</p>
                      </div>`,
                    }}
                  />
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Notification Detail Dialog */}
      <Dialog open={selectedNotification !== null} onClose={() => setSelectedNotification(null)} maxWidth="md" fullWidth>
        <DialogTitle>📧 Détails de la Notification</DialogTitle>
        <DialogContent>
          {selectedNotification && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Sujet:</Typography>
                <Typography>{selectedNotification.subject}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Destinataires:</Typography>
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedNotification.recipients.map((email) => (
                    <Chip key={email} label={email} />
                  ))}
                </Box>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Statut:</Typography>
                <Chip
                  label={selectedNotification.status === 'sent' ? '✅ Envoyé' : '❌ Échoué'}
                  color={selectedNotification.status === 'sent' ? 'success' : 'error'}
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Date d'envoi:</Typography>
                <Typography>{new Date(selectedNotification.sentAt).toLocaleString('fr-FR')}</Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedNotification(null)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
