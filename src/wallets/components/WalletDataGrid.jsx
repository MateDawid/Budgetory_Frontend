import { Box } from '@mui/material';
import React, { useContext, useState, useEffect } from 'react';
import StyledDataGrid from '../../app_infrastructure/components/DataGrid/StyledDataGrid';
import {
  mappedFilterOperators,
  formatFilterModel,
} from '../../app_infrastructure/components/DataGrid/utils/FilterHandlers';
import getSortFieldMapping from '../../app_infrastructure/components/DataGrid/utils/getSortFieldMapping';
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';
import { AlertContext } from '../../app_infrastructure/store/AlertContext';
import StyledGridActionsCellItem from '../../app_infrastructure/components/DataGrid/StyledGridActionsCellItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import DataGridFooterWithAdd from '../../app_infrastructure/components/DataGrid/DataGridFooterWithAdd';
import WalletAddModal from './WalletModal/WalletAddModal';
import WalletEditModal from './WalletModal/WalletEditModal';
import WalletDeleteModal from './WalletModal/WalletDeleteModal';
import { WalletContext } from '../../app_infrastructure/store/WalletContext';

const pageSizeOptions = [10, 50, 100];

/**
 * DataTable component for displaying DataGrid with data fetched from API.
 */
const WalletDataGrid = () => {
  const navigate = useNavigate();
  // Contexts
  const { setAlert } = useContext(AlertContext);
  const { refreshTimestamp } = useContext(WalletContext);
  // API URL
  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/wallets/`;
  // Data rows
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);

  // Loading and pagination
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: pageSizeOptions[0],
    page: 0,
  });

  // Filtering and sorting
  const [sortModel, setSortModel] = React.useState({});
  const [filterModel, setFilterModel] = React.useState({ items: [] });
  const [currencyOptions, setCurrencyOptions] = useState([]);

  // Forms handlers
  const [editedWallet, setEditedWallet] = useState();
  const [deletedWalletId, setDeletedWalletId] = useState();
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [deleteFormOpen, setDeleteFormOpen] = useState(false);

  const columns = [
    {
      field: 'name',
      type: 'string',
      headerName: 'Name',
      headerAlign: 'center',
      align: 'center',
      flex: 2,
      filterable: true,
      sortable: true,
    },
    {
      field: 'currency',
      type: 'singleSelect',
      headerName: 'Currency',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      filterable: false,
      sortable: false,
      valueOptions: currencyOptions,
    },
  ];

  const extendedColumns = [
    // Map column type to proper filter operators
    ...columns.map((column) => ({
      ...column,
      filterOperators:
        column.type in mappedFilterOperators
          ? mappedFilterOperators[column.type]
          : undefined,
    })),
    // Extend columns with Actions column
    {
      field: 'actions',
      type: 'actions',
      flex: 1,
      headerName: 'Actions',
      cellClassName: 'actions',
      getActions: (params) => {
        return [
          <StyledGridActionsCellItem
            key={params.id}
            icon={<OpenInNewIcon />}
            label="Open"
            onClick={() => navigate(`/wallets/${params.id}`)}
          />,

          <StyledGridActionsCellItem
            key={params.id}
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(params.row)}
          />,
          <StyledGridActionsCellItem
            key={params.id}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(params.row)}
          />,
        ];
      },
    },
  ];
  const sortFieldMapping = getSortFieldMapping(extendedColumns);

  /**
   * Fetches select options for Wallet currency from API.
   */
  useEffect(() => {
    async function getCurrencies() {
      const response = await getApiObjectsList(
        `${process.env.REACT_APP_BACKEND_URL}/api/currencies/`
      );
      setCurrencyOptions(response);
    }
    getCurrencies();
  }, []);

  /**
   * Fetches objects list from API.
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        const rowsResponse = await getApiObjectsList(
          apiUrl,
          paginationModel,
          sortModel,
          formatFilterModel(filterModel, columns)
        );
        setRows(rowsResponse.results);
        setRowCount(rowsResponse.count);
      } catch {
        setAlert({ type: 'error', message: 'Failed to load Wallets.' });
      } finally {
        setLoading(false);
      }
    };
    if (currencyOptions.length < 1) return;
    loadData();
  }, [
    paginationModel,
    sortModel,
    filterModel,
    refreshTimestamp,
    currencyOptions,
  ]);

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

  /**
   * Function to handle clicking "Add" toolbar button.
   */
  const handleAddClick = () => {
    setAddFormOpen(true);
  };

  /**
   * Function performed after clicking row Edit button.
   * @param {object} row - Row data.
   */
  const handleEditClick = (row) => () => {
    setEditedWallet(row);
    setEditFormOpen(true);
  };

  /**
   * Function performed after clicking row Delete button.
   * @param {object} row - DataGrid row.
   */
  const handleDeleteClick = async (row) => {
    setDeletedWalletId(row.id);
    setDeleteFormOpen(true);
  };

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          marginTop: 2,
          width: '100%',
          maxWidth: '100%',
          height: 600,
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
          disableRowSelectionOnClick
          onFilterModelChange={updateFiltering}
          disableColumnResize={true}
          slots={{
            pagination: DataGridFooterWithAdd,
          }}
          slotProps={{
            pagination: { handleAddClick },
          }}
        />
      </Box>
      <WalletAddModal
        apiUrl={apiUrl}
        formOpen={addFormOpen}
        setFormOpen={setAddFormOpen}
      />
      <WalletEditModal
        apiUrl={apiUrl}
        formOpen={editFormOpen}
        setFormOpen={setEditFormOpen}
        editedWallet={editedWallet}
        setEditedWallet={setEditedWallet}
      />
      <WalletDeleteModal
        apiUrl={apiUrl}
        formOpen={deleteFormOpen}
        setFormOpen={setDeleteFormOpen}
        deletedWalletId={deletedWalletId}
        setDeletedWalletId={setDeletedWalletId}
      />
    </>
  );
};
export default WalletDataGrid;
