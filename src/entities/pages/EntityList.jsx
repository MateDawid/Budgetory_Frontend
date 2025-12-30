import React from 'react';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import Divider from '@mui/material/Divider';
import EntityDataGrid, { EntityTypes } from '../components/EntityDataGrid';

/**
 * EntityList component to display list of Budget Entities.
 */
export default function EntityList() {
  document.title = 'Entities';

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
        Entities
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <EntityDataGrid entityType={EntityTypes.ENTITY} />
    </Paper>
  );
}
