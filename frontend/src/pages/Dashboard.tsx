import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dashboardAPI, notificationAPI } from '../../services/api';
import type { DashboardStats } from '../../types/index';
import { LoadingWrapper } from '../../components/common/LoadingWrapper';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CategoryBadges } from '../../components/common/CategoryBadges';

const COLORS = ['#3B82F6', '#EC4899', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!stats) return <LoadingWrapper isLoading={loading} error={error} children={<></> } />;

  const categoryData = stats.articlesByCategory;
  const networkData = stats.articlesByNetwork;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        📊 Tableau de Bord
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary" gutterBottom>
              Total Articles
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3B82F6' }}>
              {stats.articles.total}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary" gutterBottom>
              Publiés
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#10B981' }}>
              {stats.articles.published}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary" gutterBottom>
              Brouillons
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#F59E0B' }}>
              {stats.articles.draft}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary" gutterBottom>
              Mis en avant
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#EC4899' }}>
              {stats.articles.featured}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              📈 Articles par Catégorie
            </Typography>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="textSecondary">Aucune donnée disponible</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              🎯 Articles par Réseau
            </Typography>
            {networkData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={networkData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, count }) => `${name}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {networkData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="textSecondary">Aucune donnée disponible</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Latest Articles */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              📰 5 Derniers Articles Publiés
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {stats.latestArticles.map((article) => (
                <Card key={article.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {article.title}
                      </Typography>
                      <StatusBadge status={article.status} />
                    </Box>
                    <Typography color="textSecondary" sx={{ mb: 1 }}>
                      Par <strong>{article.author}</strong> • {new Date(article.publishedAt || '').toLocaleDateString('fr-FR')}
                    </Typography>
                    <CategoryBadges categories={article.categories} />
                    <Typography sx={{ mt: 1 }}>📝 {article.excerpt}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Latest Notifications */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              📧 Dernières Notifications Envoyées
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {stats.latestNotifications.length > 0 ? (
                stats.latestNotifications.map((notif) => (
                  <Card key={notif.id} sx={{ backgroundColor: notif.status === 'sent' ? '#F0FDF4' : '#FEF2F2' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {notif.status === 'sent' ? '✅' : '❌'} {notif.subject}
                          </Typography>
                          <Typography color="textSecondary" variant="body2">
                            À {notif.recipients.length} destinataires • {new Date(notif.sentAt).toLocaleDateString('fr-FR')}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography color="textSecondary">Aucune notification envoyée</Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
