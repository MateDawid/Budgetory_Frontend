import React from 'react';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import Divider from '@mui/material/Divider';
import CategoryDataGrid from '../components/CategoryDataGrid';

/**
 * TransferCategoryList component to display list of Budget TransferCategories.
 */
export default function TransferCategoryList() {
  return (
    <Paper
      elevation={24}
      sx={{
        padding: 2,
        bgColor: '#F1F1F1',
      }}
    >
      <Typography
        variant="h4"
        sx={{ display: 'block', color: '#BD0000', mb: 1 }}
      >
        Transfer Categories
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <CategoryDataGrid />
    </Paper>
  );
}
