import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';
import { AlertContext } from '../../app_infrastructure/store/AlertContext';
import { WalletContext } from '../../app_infrastructure/store/WalletContext';
import StyledDataGrid from '../../app_infrastructure/components/DataGrid/StyledDataGrid';
import {
  formatFilterModel,
  mappedFilterOperators,
} from '../../app_infrastructure/components/DataGrid/utils/FilterHandlers';
import getSortFieldMapping from '../../app_infrastructure/components/DataGrid/utils/getSortFieldMapping';
import StyledGridActionsCellItem from '../../app_infrastructure/components/DataGrid/StyledGridActionsCellItem';

const pageSizeOptions = [10, 50, 100];

/**
 * WalletDepositsDataGrid component for displaying DataGrid with data fectched from API.
 */
const WalletDepositsDataGrid = () => {
  const navigate = useNavigate();
  const { contextWalletId, contextWalletCurrency } = useContext(WalletContext);
  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/deposits/?fields=id,name,description,balance,wallet_percentage`;
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: pageSizeOptions[0],
    page: 0,
  });
  const [sortModel, setSortModel] = React.useState({});
  const [filterModel, setFilterModel] = React.useState({ items: [] });
  const { setAlert } = useContext(AlertContext);

  const columns = [
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
      field: 'balance',
      type: 'number',
      headerName: 'Balance',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      filterable: true,
      sortable: true,
      valueFormatter: (value) => {
        return value !== undefined ? `${value} ${contextWalletCurrency}` : '';
      },
    },
    {
      field: 'wallet_percentage',
      type: 'number',
      headerName: 'Wallet %',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      filterable: true,
      sortable: true,
      valueFormatter: (value) => {
        return value !== undefined ? `${value} %` : '';
      },
    },
  ];

  const visibleColumns = columns.filter((column) => !column.hide);

  const extendedColumns = [
    ...visibleColumns.map((column) => ({
      ...column,
      filterOperators:
        column.type in mappedFilterOperators
          ? mappedFilterOperators[column.type]
          : undefined,
    })),
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      cellClassName: 'actions',
      getActions: (params) => {
        return [
          <StyledGridActionsCellItem
            key={params.id}
            icon={<OpenInNewIcon />}
            label="Open"
            onClick={() => navigate(`/deposits/${params.id}`)}
          />,
        ];
      },
    },
  ];
  const sortFieldMapping = getSortFieldMapping(extendedColumns);

  /**
   * Fetches objects list from API.
   */
  useEffect(() => {
    const loadData = async () => {
      if (!contextWalletId) {
        setLoading(false);
        return;
      }
      try {
        const rowsResponse = await getApiObjectsList(
          apiUrl,
          paginationModel,
          sortModel,
          formatFilterModel(filterModel, visibleColumns)
        );
        setRows(rowsResponse.results);
        setRowCount(rowsResponse.count);
      } catch {
        setAlert({ type: 'error', message: 'Failed to load Wallet Deposits.' });
      } finally {
        setLoading(false);
      }
    };
    if (!contextWalletId) {
      return;
    }
    loadData();
  }, [contextWalletId, paginationModel, sortModel, filterModel]);

  /**
   * Function to update DataGrid pagination model.
   * @param {object} updatedPaginationModel - updated pagination model.
   */
  function updatePagination(updatedPaginationModel) {
    setPaginationModel(updatedPaginationModel);
  }

  /**
   * Function to update DataGrid sort model.
   * @param {Array} updatedSortModel - updated sort model.
   */
  function updateSorting(updatedSortModel) {
    if (updatedSortModel.length === 0) {
      setSortModel({});
    } else {
      const sortField =
        sortFieldMapping[updatedSortModel[0].field] ||
        updatedSortModel[0].field;
      setSortModel({
        ordering:
          updatedSortModel[0].sort === 'desc' ? '-' + sortField : sortField,
      });
    }
  }

  /**
   * Function to update DataGrid filter model.
   * @param {object} updatedFilterModel - updated filter model.
   */
  function updateFiltering(updatedFilterModel) {
    setFilterModel(updatedFilterModel);
  }

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          marginTop: 2,
          width: '100%',
          maxWidth: '100%',
          height: 300,
        }}
      >
        <StyledDataGrid
          rows={rows}
          columns={extendedColumns}
          loading={loading}
          rowCount={rowCount}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={updatePagination}
          pageSizeOptions={pageSizeOptions}
          sortingMode="server"
          onSortModelChange={updateSorting}
          filterMode="server"
          filterModel={filterModel}
          onFilterModelChange={updateFiltering}
          disableColumnResize={true}
          disableRowSelectionOnClick
        />
      </Box>
    </>
  );
};
export default WalletDepositsDataGrid;
