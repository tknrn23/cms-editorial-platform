import React from 'react';
import { Chip, Box } from '@mui/material';
import type { Category } from '../../types/index';

interface CategoryBadgesProps {
  categories: string[];
  categoryMap?: Map<string, Category>;
}

export const CategoryBadges: React.FC<CategoryBadgesProps> = ({ categories, categoryMap }) => {
  return (
    <Box display="flex" gap={1} flexWrap="wrap">
      {categories.map((catId) => {
        const category = categoryMap?.get(catId);
        return (
          <Chip
            key={catId}
            label={category?.name || catId}
            size="small"
            sx={{
              backgroundColor: category?.color || '#ccc',
              color: '#fff',
              fontWeight: 500,
            }}
          />
        );
      })}
    </Box>
  );
};
