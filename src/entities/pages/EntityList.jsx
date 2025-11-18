import React, { useContext, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Box, Paper, Stack } from '@mui/material';
import Divider from '@mui/material/Divider';
import { AlertContext } from '../../app_infrastructure/store/AlertContext';
import { BudgetContext } from '../../app_infrastructure/store/BudgetContext';
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';
import EntityCard from '../components/EntityCard';
import CreateButton from '../../app_infrastructure/components/CreateButton';

/**
 * EntityList component to display list of Budget Entities.
 */
export default function EntityList() {
  const { contextBudgetId, refreshTimestamp } = useContext(BudgetContext);
  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/entities/?is_deposit=false`;
  const { setAlert } = useContext(AlertContext);
  const [updatedObjectId, setUpdatedObjectId] = useState(null);
  const [deletedObjectId, setDeletedObjectId] = useState(null);
  const [objects, setObjects] = useState([]);
  const createFields = {
    name: {
      type: 'string',
      label: 'Name',
      autoFocus: true,
      required: true,
    },
    description: {
      type: 'string',
      label: 'Description',
      required: false,
      multiline: true,
      rows: 4,
    },
    is_active: {
      type: 'select',
      select: true,
      label: 'Status',
      defaultValue: true,
      required: true,
      options: [
        {
          value: true,
          label: '🟢 Active',
        },
        {
          value: false,
          label: '🔴 Inactive',
        },
      ],
    },
  };

  /**
   * Fetches Entities list from API.
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        const listResponse = await getApiObjectsList(apiUrl);
        setObjects(listResponse);
      } catch {
        setAlert({ type: 'error', message: 'Failed to load Entities.' });
      }
    };
    if (!contextBudgetId) {
      return;
    }
    loadData();
  }, [contextBudgetId, refreshTimestamp, updatedObjectId, deletedObjectId]);

  return (
    <Paper
      elevation={24}
      sx={{
        padding: 2,
        bgColor: '#F1F1F1',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        mb={1}
      >
        <Typography variant="h4" sx={{ display: 'block', color: '#BD0000' }}>
          Entities
        </Typography>
        <CreateButton
          fields={createFields}
          apiUrl={apiUrl}
          objectType={'Entity'}
        />
      </Stack>
      <Divider />
      <Box
        sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}
      >
        {objects.map((object) => (
          <Box key={object.id} sx={{ width: 330, m: 1 }}>
            <EntityCard
              apiUrl={apiUrl}
              object={object}
              setUpdatedObjectId={setUpdatedObjectId}
              setDeletedObjectId={setDeletedObjectId}
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
