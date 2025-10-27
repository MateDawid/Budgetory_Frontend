import React, { useContext, useEffect, useState } from 'react';
import {
    GridRowEditStopReasons,
    GridRowModes,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from '@mui/icons-material/Close';
import SaveIcon from "@mui/icons-material/Save";
import TransferDataGridFooter from './TransferDataGridFooter';
import { prepareApiInput } from '../../../app_infrastructure/components/DataGrid/utils/ApiInputFormatters';
import { mappedFilterOperators, formatFilterModel } from '../../../app_infrastructure/components/DataGrid/utils/FilterHandlers';
import { getApiObjectsList, createApiObject, updateApiObject, deleteApiObject } from '../../../app_infrastructure/services/APIService';
import { AlertContext } from '../../../app_infrastructure/store/AlertContext';
import { BudgetContext } from '../../../app_infrastructure/store/BudgetContext';
import ApiError from '../../../app_infrastructure/utils/ApiError';
import StyledDataGrid from '../../../app_infrastructure/components/DataGrid/StyledDataGrid';
import getSortFieldMapping from '../../../app_infrastructure/components/DataGrid/utils/getSortFieldMapping';
import StyledGridActionsCellItem from '../../../app_infrastructure/components/DataGrid/StyledGridActionsCellItem';
import AutocompleteCell from './AutocompleteCell';
import TransferValueInputCell from './TransferValueInputCell';


const pageSizeOptions = [10, 50, 100]

/**
 * Mapping of TransferTypes.
 */
const TransferTypes = {
    INCOME: 1,
    EXPENSE: 2,
};


/**
 * DataTable component for displaying DataGrid with data fetched from API.
 * @param {object} props
 * @param {string} props.apiUrl - Base API url for fetching data.
 */
const TransferDataGrid = ({apiUrl}) => {
    const transferType = apiUrl.endsWith('expenses/') ? TransferTypes.EXPENSE : TransferTypes.INCOME
    const [rows, setRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [removedRows, setRemovedRows] = useState([]);
    const [copiedRows, setCopiedRows] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [loading, setLoading] = useState(true);
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: pageSizeOptions[0],
        page: 0,
    });
    const [sortModel, setSortModel] = React.useState({});
    const [filterModel, setFilterModel] = React.useState({ items: [] });
    const { setAlert } = useContext(AlertContext);
    const { contextBudgetId, contextBudgetCurrency, updateRefreshTimestamp } = useContext(BudgetContext);

    const [periodOptions, setPeriodOptions] = useState([]);
    const [entityOptions, setEntityOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [depositOptions, setDepositOptions] = useState([]);

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
            editable: true,
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
            editable: true,
            valueOptions: periodOptions,
            valueOptionsSetter: setPeriodOptions,
            valueOptionsApiUrl: `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/periods/`,
            renderEditCell: (params) => <AutocompleteCell{...params} />
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
            editable: true,
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
            editable: true,
            valueOptions: depositOptions,
            valueOptionsSetter: setDepositOptions,
            valueOptionsApiUrl: `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits/`,
            renderEditCell: (params) => <AutocompleteCell{...params} />
        },
        {
            field: 'entity',
            type: 'singleSelect',
            headerName: transferType === TransferTypes.EXPENSE ? 'Receiver' : 'Sender',
            headerAlign: 'center',
            align: 'center',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: true,
            valueOptions: entityOptions,
            valueOptionsSetter: setEntityOptions,
            valueOptionsApiUrl: `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/entities/?ordering=is_deposit,name`,
            renderEditCell: (params) => <AutocompleteCell {...params} groupBy={(option) => option.is_deposit ? 'Deposits' : 'Entities'} />

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
            editable: true,
            valueOptions: categoryOptions,
            valueOptionsSetter: setCategoryOptions,
            valueOptionsApiUrl: `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/categories/?ordering=owner,name&category_type=${transferType === TransferTypes.EXPENSE ? '2' : '1'}`,
            renderEditCell: (params) => <AutocompleteCell {...params} groupBy={(option) => option.owner_display} />
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
            editable: true,
            valueFormatter: (value) => `${value} ${contextBudgetCurrency}`,
            renderEditCell: (params) => <TransferValueInputCell {...params} />,
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
            editable: true,
        },
    ]

    const extendedColumns = [
        ...columns.map((column) => ({
            ...column,
            filterOperators: column.type in mappedFilterOperators ? mappedFilterOperators[column.type] : undefined,
        }
        )),
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            cellClassName: 'actions',
            getActions: (params) => {
                const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                if (isInEditMode) {
                    return [
                        <StyledGridActionsCellItem
                            key={params.id}
                            icon={<SaveIcon />}
                            label="Save"
                            onClick={handleSaveClick(params.row)}
                        />,
                        <StyledGridActionsCellItem
                            key={params.id}
                            icon={<CancelIcon />}
                            label="Cancel"
                            onClick={handleCancelClick(params.row.id)}
                        />,
                    ];
                } else {
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
                            onClick={() => handleApiDelete(params.row)}
                        />,
                    ]
                }
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
    }, [contextBudgetId, paginationModel, sortModel, filterModel, removedRows, copiedRows]);

    /**
     * Fetches singleSelect choices from API.
     * In case of nullChoice (choice saving null value in API) extends valueOptions with such choice.
     */
    useEffect(() => {
        const loadSingleSelectChoices = async () => {
            for (const column of columns) {
                if (column.type !== 'singleSelect') {
                    continue;
                }
                try {
                    const choicesResponse = await getApiObjectsList(column.valueOptionsApiUrl)
                    column.valueOptionsSetter(column.nullChoice ? [column.nullChoice, ...choicesResponse] : choicesResponse);
                } catch (err) {
                    setAlert({ type: 'error', message: "Failed to load choices for select field.\n" + err });
                }
            }
        }
        if (!contextBudgetId) {
            return
        }
        loadSingleSelectChoices();
    }, [contextBudgetId])

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
     * Function to handle events that interrupts editing row.
     * @param {object} params - Edited row parameters.
     * @param {object} event - Event preventing row editing.
     */
    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    /**
     * Function to handle clicking "Add" toolbar button.
     */
    const handleAddClick = () => {
        let id = 0
        const emptyCells = (columns.reduce((emptyRow, column) => {
            // Handle hidden columns with default values
            if (column.hide && column.defaultValue !== undefined) {
                emptyRow[column.field] = column.defaultValue;
            } else if (column.type === 'date') {
                emptyRow[column.field] = new Date().toISOString().split('T')[0];
            } else {
                emptyRow[column.field] = '';
            }
            return emptyRow;
        }, {}))

        setRows((oldRows) => {
            if (oldRows.length !== 0) {
                id = oldRows.reduce((maxId, row) => row.id > maxId ? row.id : maxId, oldRows[0].id) + 100
            } else {
                id = 1
            }
            return [
                ...oldRows,
                { id, ...emptyCells, isNew: true },
            ]
        });

        // Find the first visible, editable column for focus
        const firstEditableColumn = columns.find(col => col.editable);

        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: firstEditableColumn?.field || columns[0]?.field },
        }));

    };

    /**
     * Function performed after clicking row Edit button.
     * Changes particular row mode to "Edit".
     * @param {object} row - Row data.
     */
    const handleEditClick = (row) => () => {
        setRowModesModel((prevModel) => ({
            ...prevModel,
            [row.id]: { mode: GridRowModes.Edit },
        }));
    };

    /**
     * Function performed after clicking row Save button.
     * Changes particular row mode to "View" and keeps done modifications,
     * which leads to perform processRowUpdate function.
     * @param {object} row - Row data.
     */
    const handleSaveClick = (row) => () => {
        setRowModesModel((prevModel) => ({
            ...prevModel,
            [row.id]: { mode: GridRowModes.View },
        }));
    };

    /**
     * Function performed after saving changes in DataGrid row.
     * Makes call to API to update particular row.
     * @param {object} row - DataGrid row content.
     * @return {object} - Created/updated object content.
     */
    const processRowUpdate = async (row) => {
        const rowWithHiddenFields = { ...row };
        columns.forEach(column => {
            if (column.hide && column.defaultValue !== undefined && !rowWithHiddenFields[column.field]) {
                rowWithHiddenFields[column.field] = column.defaultValue;
            }
        });

        const processedRow = prepareApiInput(rowWithHiddenFields, columns)
        if (processedRow.isNew) {
            const temporaryRowId = processedRow.id;
            delete processedRow.id;
            const createResponse = await createApiObject(apiUrl, processedRow);
            setAlert({ type: 'success', message: `Object created successfully.` })
            setRows((oldRows) => {
                return [...oldRows.filter(row => row.id !== temporaryRowId), createResponse]
                    .sort((a, b) => {
                        // If a doesn't have isNew and b has it, a comes first
                        if (!('isNew' in a) && 'isNew' in b) return -1;
                        // If b doesn't have isNew and a has it, b comes first
                        if (!('isNew' in b) && 'isNew' in a) return 1;
                        // Otherwise maintain original order
                        return 0;
                    });
            });
            updateRefreshTimestamp()
            return createResponse;
        } else {
            const updateResponse = await updateApiObject(apiUrl, processedRow);
            setAlert({ type: 'success', message: `Object updated successfully.` })
            updateRefreshTimestamp()
            return updateResponse;
        }

    };

    /**
     * Function performed in case of error during processing row update.
     * @param {Error | ApiError} error - Error occurred during row update.
     */
    const handleProcessRowUpdateError = (error) => {
        if (error instanceof ApiError && typeof error.data === 'object') {
            let message = 'Invalid data provided:'
            Object.keys(error.data.detail).forEach(key => {
                if (key === 'non_field_errors') {
                    message = message + `\n• ${error.data.detail[key]}`
                } else {
                    const column = columns.find(column => column.field === key)
                    if (column) {
                        message = message + `\n• "${column.headerName}" field - ${error.data.detail[key]}`
                    } else {
                        message = message + `\n• "${key}" API field - ${error.data.detail[key]}`
                    }
                }

            });
            setAlert({ type: 'error', message: message });
        } else {
            console.error(error)
            setAlert({ type: 'error', message: "Unexpected error occurred." });
        }
    };

    /**
     * Function performed after clicking row Cancel button.
     * Changes particular row mode to "View" and removes done modifications.
     * @param {number} id - Edited object id.
     */
    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
        setAlert(null);
    };

    /**
     * Function performed after double-clicking row to be edited.
     * Changes particular row mode to "Edit".
     * @param {number} newRowModesModel - Data of updated row.
     */
    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    /**
     * Function to perform API call to delete selected object.
     * @param {object} row - DataGrid row.
     */
    const handleApiDelete = async (row) => {
        try {
            await deleteApiObject(apiUrl, row.id);
            setRemovedRows([row.id])
            updateRefreshTimestamp()
            setAlert({ type: 'success', message: "Object deleted successfully" });
        } catch (error) {
            setAlert({ type: 'error', message: error.message });
        }
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
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    onProcessRowUpdateError={handleProcessRowUpdateError}
                    checkboxSelection
                    disableRowSelectionOnClick
                    onRowSelectionModelChange={(selectedRowsIds) => setSelectedRows(selectedRowsIds)}
                    isRowSelectable={(params) => params.row.isNew !== true}
                    slots={{
                        pagination: TransferDataGridFooter,
                    }}
                    slotProps={{
                        pagination: {
                            apiUrl,
                            handleAddClick,
                            selectedRows,
                            setRemovedRows,
                            setCopiedRows,
                        },
                    }}
                />
            </Box>
        </>
    )
}
export default TransferDataGrid;