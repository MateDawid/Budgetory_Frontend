import React, { useContext, useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import { AlertContext } from '../../app_infrastructure/store/AlertContext';
import { Typography, Paper, Box, Stack } from '@mui/material';
import { getApiObjectDetails } from '../../app_infrastructure/services/APIService';
import { useNavigate, useParams } from 'react-router-dom';
import EditableTextField from '../../app_infrastructure/components/EditableTextField';
import DeleteButton from '../../app_infrastructure/components/DeleteButton';
import onEditableFieldSave from '../../app_infrastructure/utils/onEditableFieldSave';
import { WalletContext } from '../../app_infrastructure/store/WalletContext';
import WalletDepositsTable from '../components/WalletDepositsDataGrid';
import DepositsInPeriodsChart from '../../charts/components/DepositsInPeriodsChart';

/**
 * WalletDetail component to display details of single Wallet.
 */
export default function WalletDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/wallets/`;
  const [updatedObjectParam, setUpdatedObjectParam] = useState(null);
  const { updateRefreshTimestamp } = useContext(WalletContext);
  const { setAlert } = useContext(AlertContext);
  const [walletData, setWalletData] = useState([]);
  const depositsColumns = [
    {
      field: 'name',
      type: 'string',
      headerName: 'Name',
      headerAlign: 'center',
      align: 'left',
      flex: 2,
      filterable: true,
      sortable: true,
    },
    {
      field: 'description',
      type: 'string',
      headerName: 'Description',
      headerAlign: 'center',
      align: 'left',
      flex: 3,
      filterable: true,
      sortable: false,
    },
    {
      field: 'is_active',
      type: 'boolean',
      headerName: 'Active',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      filterable: true,
      sortable: false,
    },
    {
      field: 'balance',
      type: 'number',
      headerName: 'Balance',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      filterable: true,
      sortable: true,
      valueFormatter: (value) => {
        return value !== undefined ? `${value} ${walletData.currency}` : '';
      },
    },
  ];

  /**
   * Fetches Wallet details from API.
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        const walletResponse = await getApiObjectDetails(apiUrl, id);
        setWalletData(walletResponse);
        document.title = `Wallet • ${walletResponse.name}`;
      } catch {
        setAlert({ type: 'error', message: 'Wallet details loading failed.' });
        navigate('/wallets');
      }
    };
    loadData();
  }, [updatedObjectParam]);

  /**
   * Function to save updated object via API call.
   * @param {string} apiFieldName - Name of updated API field.
   * @param {object} value - New value for updated API field.
   * @return {object} - JSON data with API response.
   */
  const onSave = async (apiFieldName, value) => {
    await onEditableFieldSave(
      id,
      apiFieldName,
      value,
      apiUrl,
      setUpdatedObjectParam,
      setAlert
    );
    updateRefreshTimestamp();
  };

  return (
    <Paper
      elevation={24}
      sx={{
        padding: 2,
        paddingBottom: 0,
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
          {walletData.name}
        </Typography>
        <DeleteButton
          apiUrl={apiUrl}
          objectId={id}
          objectDisplayName="Wallet"
          redirectOnSuccess={'/wallets'}
          rightbarWalletsRefresh
        />
      </Stack>
      <Divider />
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h5" sx={{ display: 'block', color: '#BD0000' }}>
          Details
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <EditableTextField
            label="Name"
            initialValue={walletData.name}
            apiFieldName="name"
            onSave={onSave}
            fullWidth
          />
          <EditableTextField
            label="Currency"
            initialValue={walletData.currency}
            apiFieldName="currency"
            onSave={onSave}
            fullWidth
          />
        </Stack>
        <EditableTextField
          multiline
          rows={4}
          label="Description"
          initialValue={walletData.description}
          apiFieldName="description"
          onSave={onSave}
          fullWidth
        />
      </Box>
      <Box>
        <Typography variant="h5" sx={{ display: 'block', color: '#BD0000' }}>
          Deposits
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <DepositsInPeriodsChart />
        <WalletDepositsTable
          columns={depositsColumns}
          apiUrl={`${process.env.REACT_APP_BACKEND_URL}/api/wallets/${id}/deposits/`}
          clientUrl="/deposits/"
          height={300}
        />
      </Box>
    </Paper>
  );
}
