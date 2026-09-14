import React from 'react';
import { Box, Chip } from '@mui/material';

interface StatusBadgeProps {
  status: 'draft' | 'published' | 'archived';
}

const statusColors = {
  draft: { bg: '#FEF3C7', text: '#92400E' },
  published: { bg: '#DBEAFE', text: '#0C4A6E' },
  archived: { bg: '#E5E7EB', text: '#374151' },
};

const statusLabels = {
  draft: '📝 Brouillon',
  published: '✅ Publié',
  archived: '🗂️ Archivé',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const colors = statusColors[status];
  return (
    <Chip
      label={statusLabels[status]}
      sx={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontWeight: 600,
      }}
    />
  );
};
