import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import DataGridFooterWithAdd from '../../app_infrastructure/components/DataGrid/DataGridFooterWithAdd';
import StyledDataGrid from '../../app_infrastructure/components/DataGrid/StyledDataGrid';
import StyledGridActionsCellItem from '../../app_infrastructure/components/DataGrid/StyledGridActionsCellItem';
import {
  mappedFilterOperators,
  formatFilterModel,
} from '../../app_infrastructure/components/DataGrid/utils/FilterHandlers';
import getSortFieldMapping from '../../app_infrastructure/components/DataGrid/utils/getSortFieldMapping';
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';
import { AlertContext } from '../../app_infrastructure/store/AlertContext';
import { WalletContext } from '../../app_infrastructure/store/WalletContext';
import EntityAddModal from './EntityModal/EntityAddModal';
import EntityEditModal from './EntityModal/EntityEditModal';
import EntityDeleteModal from './EntityModal/EntityDeleteModal';

const pageSizeOptions = [10, 50, 100];

export const EntityTypes = {
  ENTITY: 1,
  DEPOSIT: 2,
};

/**
 * DataTable component for displaying DataGrid with data fetched from API.
 */
const EntityDataGrid = ({ entityType }) => {
  const navigate = useNavigate();
  // Contexts
  const { setAlert } = useContext(AlertContext);
  const { contextWalletId, contextWalletCurrency, refreshTimestamp } =
    useContext(WalletContext);

  // API URL
  let apiUrl;
  let detailUrl;
  switch (entityType) {
    case EntityTypes.ENTITY:
      apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/entities/?is_deposit=false`;
      detailUrl = '/entities/';
      break;
    case EntityTypes.DEPOSIT:
      apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/deposits/?fields=id,name,description,is_active,balance`;
      detailUrl = '/deposits/';
      break;
  }

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

  // Forms handlers
  const [editedEntity, setEditedEntity] = useState();
  const [deletedEntityId, setDeletedEntityId] = useState();
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
      flex: 1,
      filterable: true,
      sortable: true,
    },
    {
      field: 'description',
      type: 'string',
      headerName: 'Description',
      headerAlign: 'center',
      align: 'left',
      flex: 2,
      filterable: true,
      sortable: false,
    },
    {
      field: 'is_active',
      type: 'singleSelect',
      headerName: 'Status',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      valueOptions: [
        {
          value: true,
          label: '🟢 Active',
        },
        {
          value: false,
          label: '🔴 Inactive',
        },
      ],
      filterable: true,
      sortable: false,
    },
  ];

  if (entityType === EntityTypes.DEPOSIT) {
    columns.push({
      field: 'balance',
      type: 'number',
      headerName: 'Balance',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      filterable: true,
      sortable: true,
      renderCell: (params) => (
        <span
          style={{
            color: params.value < 0 ? '#BD0000' : '#008000',
          }}
        >
          {params.value} {contextWalletCurrency}
        </span>
      ),
    });
  }

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
            onClick={() => navigate(`${detailUrl}${params.id}`)}
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
          formatFilterModel(filterModel, columns)
        );
        setRows(rowsResponse.results);
        setRowCount(rowsResponse.count);
      } catch {
        setAlert({ type: 'error', message: 'Failed to load Entities.' });
      } finally {
        setLoading(false);
      }
    };
    if (!contextWalletId) {
      return;
    }
    loadData();
  }, [
    contextWalletId,
    paginationModel,
    sortModel,
    filterModel,
    refreshTimestamp,
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
    setEditedEntity(row);
    setEditFormOpen(true);
  };

  /**
   * Function performed after clicking row Delete button.
   * @param {object} row - DataGrid row.
   */
  const handleDeleteClick = async (row) => {
    setDeletedEntityId(row.id);
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
          onFilterModelChange={updateFiltering}
          disableColumnResize={true}
          disableRowSelectionOnClick
          slots={{
            pagination: DataGridFooterWithAdd,
          }}
          slotProps={{ pagination: { handleAddClick } }}
        />
      </Box>
      <EntityAddModal
        apiUrl={apiUrl}
        entityType={entityType}
        formOpen={addFormOpen}
        setFormOpen={setAddFormOpen}
      />
      <EntityEditModal
        apiUrl={apiUrl}
        entityType={entityType}
        formOpen={editFormOpen}
        setFormOpen={setEditFormOpen}
        editedEntity={editedEntity}
        setEditedEntity={setEditedEntity}
      />
      <EntityDeleteModal
        apiUrl={apiUrl}
        entityType={entityType}
        formOpen={deleteFormOpen}
        setFormOpen={setDeleteFormOpen}
        deletedEntityId={deletedEntityId}
        setDeletedEntityId={setDeletedEntityId}
      />
    </>
  );
};
export default EntityDataGrid;
