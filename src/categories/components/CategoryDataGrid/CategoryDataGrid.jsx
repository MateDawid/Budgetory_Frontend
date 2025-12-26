import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  mappedFilterOperators,
  formatFilterModel,
} from '../../../app_infrastructure/components/DataGrid/utils/FilterHandlers';
import { getApiObjectsList } from '../../../app_infrastructure/services/APIService';
import { AlertContext } from '../../../app_infrastructure/store/AlertContext';
import { BudgetContext } from '../../../app_infrastructure/store/BudgetContext';
import StyledDataGrid from '../../../app_infrastructure/components/DataGrid/StyledDataGrid';
import getSortFieldMapping from '../../../app_infrastructure/components/DataGrid/utils/getSortFieldMapping';
import StyledGridActionsCellItem from '../../../app_infrastructure/components/DataGrid/StyledGridActionsCellItem';
import renderHyperlink from '../../../app_infrastructure/components/DataGrid/utils/renderHyperlink';
import CategoryDataGridFooter from './CategoryDataGridFooter';
import CategoryAddModal from '../CategoryModal/CategoryAddModal';
import CategoryEditModal from '../CategoryModal/CategoryEditModal';
import CategoryDeleteModal from '../CategoryModal/CategoryDeleteModal';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { useNavigate } from 'react-router-dom';

const pageSizeOptions = [10, 50, 100];

/**
 * DataTable component for displaying DataGrid with data fetched from API.
 */
const CategoryDataGrid = () => {
  const navigate = useNavigate();
  // Contexts
  const { setAlert } = useContext(AlertContext);
  const { contextBudgetId, refreshTimestamp } = useContext(BudgetContext);

  // API URL
  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/categories/?ordering=category_type,priority,name`;

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
  const [depositOptions, setDepositOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [priorityOptions, setPriorityOptions] = useState([]);

  // Forms handlers
  const [editedCategory, setEditedCategory] = useState();
  const [deletedCategoryId, setDeletedCategoryId] = useState();
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [deleteFormOpen, setDeleteFormOpen] = useState(false);

  /**
   * Fetches select options for Category select fields from API.
   */
  useEffect(() => {
    async function getDeposits() {
      const response = await getApiObjectsList(
        `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits/`
      );
      setDepositOptions(response);
    }
    async function getCategoryTypes() {
      const typeResponse = await getApiObjectsList(
        `${process.env.REACT_APP_BACKEND_URL}/api/categories/types`
      );
      setTypeOptions(typeResponse.results);
    }
    async function getPriorities() {
      const priorityResponse = await getApiObjectsList(
        `${process.env.REACT_APP_BACKEND_URL}/api/categories/priorities`
      );
      setPriorityOptions(priorityResponse.results);
    }

    if (!contextBudgetId) {
      return;
    }
    getDeposits();
    getCategoryTypes();
    getPriorities();
  }, [contextBudgetId]);

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
      field: 'deposit',
      type: 'singleSelect',
      headerName: 'Deposit',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      filterable: true,
      sortable: true,
      valueOptions: depositOptions,
      renderCell: (params) => renderHyperlink('deposits/', params),
    },
    {
      field: 'category_type',
      type: 'singleSelect',
      headerName: 'Type',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      valueOptions: typeOptions,
      filterable: true,
      sortable: true,
    },
    {
      field: 'priority',
      type: 'singleSelect',
      headerName: 'Priority',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      valueOptions: priorityOptions,
      filterable: true,
      sortable: true,
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
            onClick={() => navigate(`/categories/${params.id}`)}
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
      if (!contextBudgetId) {
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
        setAlert({ type: 'error', message: 'Failed to load table rows.' });
      } finally {
        setLoading(false);
      }
    };
    if (!contextBudgetId) {
      return;
    }
    loadData();
  }, [
    contextBudgetId,
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
    setEditedCategory(row);
    setEditFormOpen(true);
  };

  /**
   * Function performed after clicking row Delete button.
   * @param {object} row - DataGrid row.
   */
  const handleDeleteClick = async (row) => {
    setDeletedCategoryId(row.id);
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
            pagination: CategoryDataGridFooter,
          }}
          slotProps={{ pagination: { handleAddClick } }}
        />
      </Box>
      <CategoryAddModal
        apiUrl={apiUrl}
        formOpen={addFormOpen}
        setFormOpen={setAddFormOpen}
      />
      <CategoryEditModal
        apiUrl={apiUrl}
        formOpen={editFormOpen}
        setFormOpen={setEditFormOpen}
        editedCategory={editedCategory}
        setEditedCategory={setEditedCategory}
      />
      <CategoryDeleteModal
        apiUrl={apiUrl}
        formOpen={deleteFormOpen}
        setFormOpen={setDeleteFormOpen}
        deletedCategoryId={deletedCategoryId}
        setDeletedCategoryId={setDeletedCategoryId}
      />
    </>
  );
};
export default CategoryDataGrid;
