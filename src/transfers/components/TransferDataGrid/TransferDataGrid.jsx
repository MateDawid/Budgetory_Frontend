import React, { useContext, useEffect, useState } from 'react';
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TransferDataGridFooter from './TransferDataGridFooter';
import { mappedFilterOperators, formatFilterModel } from '../../../app_infrastructure/components/DataGrid/utils/FilterHandlers';
import { getApiObjectsList } from '../../../app_infrastructure/services/APIService';
import { AlertContext } from '../../../app_infrastructure/store/AlertContext';
import { BudgetContext } from '../../../app_infrastructure/store/BudgetContext';
import StyledDataGrid from '../../../app_infrastructure/components/DataGrid/StyledDataGrid';
import getSortFieldMapping from '../../../app_infrastructure/components/DataGrid/utils/getSortFieldMapping';
import StyledGridActionsCellItem from '../../../app_infrastructure/components/DataGrid/StyledGridActionsCellItem';
import TransferTypes from '../../utils/TransferTypes';
import TransferAddModal from '../TransferModal/TransferAddModal';
import TransferEditModal from '../TransferModal/TransferEditModal';
import TransferDeleteModal from '../TransferModal/TransferDeleteModal';
import renderHyperlink from '../../../app_infrastructure/components/DataGrid/utils/renderHyperlink';


const pageSizeOptions = [10, 50, 100]



/**
 * DataTable component for displaying DataGrid with data fetched from API.
 * @param {object} props
 * @param {number} props.transferType - Type of Transfer. Options: TransferTypes.INCOME, TransferTypes.EXPENSE.
 */
const TransferDataGrid = ({ transferType }) => {
    // Contexts
    const { setAlert } = useContext(AlertContext);
    const { contextBudgetId, contextBudgetCurrency, refreshTimestamp } = useContext(BudgetContext);

    // API URL
    let apiUrl;
    switch (transferType) {
        case TransferTypes.INCOME:
            apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/incomes/`
            break
        case TransferTypes.EXPENSE:
            apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/expenses/`
            break
    }

    // Data rows
    const [rows, setRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
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
    const [periodOptions, setPeriodOptions] = useState([]);
    const [entityOptions, setEntityOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [depositOptions, setDepositOptions] = useState([]);

    // Forms handlers
    const [editedTransfer, setEditedTransfer] = useState()
    const [deletedTransferId, setDeletedTransferId] = useState()
    const [addFormOpen, setAddFormOpen] = useState(false);
    const [editFormOpen, setEditFormOpen] = useState(false);
    const [deleteFormOpen, setDeleteFormOpen] = useState(false);

    /**
     * Fetches select options for Transfer select fields from API.
     */
    useEffect(() => {
        async function getPeriodsChoices() {
            try {
                const response = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/periods/`)
                setPeriodOptions(response);
            } catch (err) {
                setPeriodOptions([])
            }
        }
        async function getCategories() {
            const response = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/categories/?ordering=owner,name&category_type=${transferType === TransferTypes.EXPENSE ? '2' : '1'}`)
            setCategoryOptions([{ value: -1, label: '[Without Category]' }, ...response]);
        }
        async function getDeposits() {
            const response = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits/`)
            setDepositOptions(response);
        }
        async function getEntities() {
            const response = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/entities/?ordering=is_deposit,name`)
            setEntityOptions([{ value: -1, label: '[Without Entity]' }, ...response]);
        }
        if (!contextBudgetId) {
            return
        }
        getPeriodsChoices();
        getCategories();
        getDeposits();
        getEntities();
    }, [contextBudgetId]);

    const columns = [
        {
            field: 'date',
            type: 'date',
            headerName: 'Date',
            headerAlign: 'center',
            align: 'center',
            flex: 2,
            filterable: true,
            sortable: true,
            valueGetter: (value) => {
                return new Date(value);
            },
            valueFormatter: (value) => {
                try {
                    return value.toLocaleDateString('en-CA')
                } catch (error) {
                    return value
                }
            },
        },
        {
            field: 'period',
            type: 'singleSelect',
            headerName: 'Period',
            headerAlign: 'center',
            align: 'center',
            flex: 2,
            filterable: true,
            sortable: true,
            valueOptions: periodOptions,
            renderCell: (params) => renderHyperlink('periods/', params)
        },
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
            field: 'deposit',
            type: 'singleSelect',
            headerName: 'Deposit',
            headerAlign: 'center',
            align: 'center',
            flex: 2,
            filterable: true,
            sortable: true,
            valueOptions: depositOptions,
            renderCell: (params) => renderHyperlink('deposits/', params)
        },
        {
            field: 'entity',
            type: 'singleSelect',
            headerName: 'Entity',
            headerAlign: 'center',
            align: 'center',
            flex: 2,
            filterable: true,
            sortable: true,
            valueOptions: entityOptions,
            renderCell: (params) => renderHyperlink('entities/', params)
        },
        {
            field: 'category',
            type: 'singleSelect',
            headerName: 'Category',
            headerAlign: 'center',
            align: 'center',
            flex: 2,
            filterable: true,
            sortable: true,
            valueOptions: categoryOptions,
            renderCell: (params) => renderHyperlink('categories/', params)
        },

        {
            field: 'value',
            type: 'number',
            headerName: 'Value',
            headerAlign: 'center',
            align: 'center',
            flex: 2,
            filterable: true,
            sortable: true,
            renderCell: (params) => (
                <span style={{
                    color: transferType === TransferTypes.EXPENSE ? '#BD0000' : '#008000',
                    fontWeight: 'bold'
                }}>
                    {params.value} {contextBudgetCurrency}
                </span>
            ),
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
    ]

    const extendedColumns = [
        // Map column type to proper filter operators
        ...columns.map((column) => ({
            ...column,
            filterOperators: column.type in mappedFilterOperators ? mappedFilterOperators[column.type] : undefined,
        }
        )),
        // Extend columns with Actions column
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            cellClassName: 'actions',
            getActions: (params) => {
                return [
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
                ]
            }
        },
    ]
    const sortFieldMapping = getSortFieldMapping(extendedColumns);

    /**
     * Fetches objects list from API.
     */
    useEffect(() => {
        const loadData = async () => {
            if (!contextBudgetId) {
                setLoading(false);
                return
            }
            try {
                const rowsResponse = await getApiObjectsList(
                    apiUrl, paginationModel, sortModel, formatFilterModel(filterModel, columns)
                )
                setRows(rowsResponse.results);
                setRowCount(rowsResponse.count);
            } catch (err) {
                setAlert({ type: 'error', message: "Failed to load table rows." });
            } finally {
                setLoading(false);
            }
        }
        if (!contextBudgetId) {
            return
        }
        loadData();
    }, [contextBudgetId, paginationModel, sortModel, filterModel, refreshTimestamp]);

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
            const sortField = sortFieldMapping[updatedSortModel[0].field] || updatedSortModel[0].field;
            setSortModel({
                ordering: updatedSortModel[0].sort === 'desc' ? '-' + sortField : sortField
            });
        }
    }

    /**
     * Function to update DataGrid filter model.
     * @param {object} updatedFilterModel - updated filter model.
     */
    function updateFiltering(updatedFilterModel) {
        setFilterModel(updatedFilterModel)
    }

    /**
     * Function to handle clicking "Add" toolbar button.
     */
    const handleAddClick = () => {
        setAddFormOpen(true)
    };

    /**
     * Function performed after clicking row Edit button.
     * @param {object} row - Row data.
     */
    const handleEditClick = (row) => () => {
        setEditedTransfer(row)
        setEditFormOpen(true)
    };


    /**
     * Function performed after clicking row Delete button.
     * @param {object} row - DataGrid row.
     */
    const handleDeleteClick = async (row) => {
        setDeletedTransferId(row.id)
        setDeleteFormOpen(true)
    };

    return (
        <>
            <Box sx={{ flexGrow: 1, marginTop: 2, width: '100%', maxWidth: '100%', height: 600 }}>
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
                    checkboxSelection
                    disableRowSelectionOnClick
                    onRowSelectionModelChange={(selectedRowsIds) => setSelectedRows(selectedRowsIds)}
                    slots={{
                        pagination: TransferDataGridFooter,
                    }}
                    slotProps={{
                        pagination: {
                            apiUrl,
                            transferType,
                            handleAddClick,
                            selectedRows
                        },
                    }}
                />
            </Box>
            <TransferAddModal apiUrl={apiUrl} transferType={transferType} formOpen={addFormOpen} setFormOpen={setAddFormOpen} />
            <TransferEditModal apiUrl={apiUrl} transferType={transferType} formOpen={editFormOpen} setFormOpen={setEditFormOpen} editedTransfer={editedTransfer} setEditedTransfer={setEditedTransfer} />
            <TransferDeleteModal apiUrl={apiUrl} transferType={transferType} formOpen={deleteFormOpen} setFormOpen={setDeleteFormOpen} deletedTransferId={deletedTransferId} setDeletedTransferId={setDeletedTransferId} />
        </>
    )
}
export default TransferDataGrid;