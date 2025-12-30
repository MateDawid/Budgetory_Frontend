import React from 'react';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import Divider from '@mui/material/Divider';
import EntityDataGrid, { EntityTypes } from '../components/EntityDataGrid';

/**
 * DepositList component to display list of Budget Deposits.
 */
export default function DepositList() {
  document.title = 'Deposits';

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
        Deposits
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <EntityDataGrid entityType={EntityTypes.DEPOSIT} />
    </Paper>
  );
}
