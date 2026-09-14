import React from 'react';
import { Box, CircularProgress, Alert, AlertTitle } from '@mui/material';

interface LoadingProps {
  isLoading: boolean;
  error?: string | null;
  children: React.ReactNode;
}

export const LoadingWrapper: React.FC<LoadingProps> = ({ isLoading, error, children }) => {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Erreur</AlertTitle>
        {error}
      </Alert>
    );
  }

  return <>{children}</>;
};
