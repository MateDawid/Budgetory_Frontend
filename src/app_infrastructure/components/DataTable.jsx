import React, {useContext, useEffect, useState} from 'react';
import {
    DataGrid,
    GridActionsCellItem,
    GridRowEditStopReasons,
    GridRowModes,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from '@mui/icons-material/Close';
import SaveIcon from "@mui/icons-material/Save";
import ApiError from "../../app_infrastructure/utils/ApiError";
import AddIcon from "@mui/icons-material/Add";
import {AlertContext} from "./AlertContext";
import {BudgetContext} from "./BudgetContext";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {prepareApiInput} from "../utils/DataTable/ApiInputFormatters";
import BudgetSelector from "./BudgetSelector";
import {white, black, red, lightGrey} from "../utils/Colors";
import {formatFilterModel, mappedFilterOperators} from "../utils/DataTable/FilterHandlers";
import {createApiObject, deleteApiObject, getApiObjectsList, updateApiObject} from "../services/APIService";

const pageSizeOptions = [10, 50, 100]

const gridActionsCellItemStyle = {"& .MuiSvgIcon-root": {color: black}}
const dataGridStyle = {
    backgroundColor: white,
    '& .MuiSvgIcon-root': {color: white},
    '& .MuiInputBase-root': {color: white},
    '& .MuiInputBase-input': {color: black, display: "flex"},
    '& .MuiCheckbox-root .MuiSvgIcon-root': {color: black},
    '& .MuiInputBase-root .MuiSvgIcon-root': {color: black},
    '& .MuiDataGrid-columnHeader': {backgroundColor: black, color: white},
    '& .MuiDataGrid-columnHeaderTitle': {fontWeight: 'bold !important'},
    '& .MuiDataGrid-footerContainer': {backgroundColor: black, color: white},
    '& .MuiDataGrid-row': {backgroundColor: lightGrey},
    '& .MuiDataGrid-row.Mui-selected': {backgroundColor: lightGrey},
    '& .MuiDataGrid-row.Mui-selected:hover': {backgroundColor: lightGrey},
    '& .MuiDataGrid-cell:hover': {color: black, fontWeight: "bold"},
    '& .MuiTablePagination-select': {color: white},
    '& .MuiTablePagination-selectIcon': {color: white},
    '& .MuiTablePagination-selectLabel': {color: white},
    '& .MuiTablePagination-displayedRows': {color: white},
}

/**
 * DataTable component for displaying DataGrid with data fetched from API.
 * @param {object} columns - Displayed columns settings.
 * @param {string} apiUrl - Base API url for fetching data.
 * @param {boolean} useContextBudget - indicates if contextBudget is needed to perform API calls. Displays BudgetSelector if so.
 */
const DataTable = ({columns, apiUrl, useContextBudget = true}) => {
    const [rows, setRows] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [addedObjectId, setAddedObjectId] = useState(null)
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [loading, setLoading] = useState(true);
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: pageSizeOptions[0],
        page: 0,
    });
    const [sortModel, setSortModel] = React.useState({});
    const [filterModel, setFilterModel] = React.useState({items: []});
    const {setAlert} = useContext(AlertContext);
    const {contextBudgetId} = useContext(BudgetContext);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [objectToDelete, setObjectToDelete] = useState(null);
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
                        <GridActionsCellItem
                            key={params.id}
                            icon={<SaveIcon/>}
                            label="Save"
                            sx={gridActionsCellItemStyle}
                            onClick={handleSaveClick(params.row)}
                        />,
                        <GridActionsCellItem
                            key={params.id}
                            icon={<CancelIcon/>}
                            label="Cancel"
                            sx={gridActionsCellItemStyle}
                            onClick={handleCancelClick(params.row.id)}
                        />,
                    ];
                } else {
                    return [
                        <GridActionsCellItem
                            key={params.id}
                            icon={<EditIcon/>}
                            label="Edit"
                            sx={gridActionsCellItemStyle}
                            onClick={handleEditClick(params.row)}
                        />,
                        <GridActionsCellItem
                            key={params.id}
                            icon={<DeleteIcon/>}
                            label="Delete"
                            onClick={() => handleDeleteClick(params.row)}
                            sx={gridActionsCellItemStyle}
                        />,
                    ]
                }
            }
        },
    ]

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
                setAlert({type: 'error', message: "Failed to load table rows."});
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [contextBudgetId, paginationModel, sortModel, filterModel, addedObjectId]);

    /**
     * Fetches singleSelect choices from API.
     * In case of nullChoice (choice saving null value in API) extends valueOptions with such choice.
     */
    useEffect(() => {
        const loadSingleSelectChoices = async () => {
            for (const column of extendedColumns) {
                if (column.type !== 'singleSelect') {
                    continue;
                }
                try {
                    const choicesResponse = await getApiObjectsList(column.valueOptionsApiUrl)
                    column.valueOptionsSetter(column.nullChoice ? [column.nullChoice, ...choicesResponse.results] : choicesResponse.results);
                } catch (err) {
                    setAlert({type: 'error', message: "Failed to load choices for select field.\n" + err});
                }
            }
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
            setSortModel({
                ordering: updatedSortModel[0].sort === 'desc' ? '-' + updatedSortModel[0].field : updatedSortModel[0].field
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
            if (column.type === 'date') {
                emptyRow[column.field] = new Date().toISOString().split('T')[0];
            } else {
                emptyRow[column.field] = '';
            }

            return emptyRow;
        }, {}))

        setRows((oldRows) => {
            if (oldRows.length !== 0) {
                id = oldRows.reduce((maxId, row) => row.id > maxId ? row.id : maxId, oldRows[0].id) + 1
            }
            else {
                id = 1
            }
            return [
                {id, ...emptyCells, isNew: true},
                ...oldRows,
            ]
        });
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: {mode: GridRowModes.Edit, fieldToFocus: columns[0].field},
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
            [row.id]: {mode: GridRowModes.Edit},
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
            [row.id]: {mode: GridRowModes.View},
        }));
    };

    /**
     * Function performed after saving changes in DataGrid row.
     * Makes call to API to update particular row.
     * @param {object} row - DataGrid row content.
     * @return {object} - Created/updated object content.
     */
    const processRowUpdate = async (row) => {
        const processedRow = prepareApiInput(row, columns)
        if (processedRow.isNew) {
            const createResponse = await createApiObject(apiUrl, processedRow);
            setAlert({type: 'success', message: `Object created successfully.`})
            setAddedObjectId(createResponse.id)
            return createResponse;
        } else {
            const updateResponse = await updateApiObject(apiUrl, processedRow);
            setAlert({type: 'success', message: `Object updated successfully.`})
            return updateResponse;
        }
    };

    /**
     * Function performed in case of error during processing row update.
     * @param {Error | ApiError} error - Error occurred during row update.
     */
    const handleProcessRowUpdateError = (error) => {
        if (error instanceof ApiError) {
            let message = 'Invalid data provided:'
            Object.keys(error.data.detail).forEach(key => {
                if (key === 'non_field_errors') {
                    message = message + `\n• ${error.data.detail[key]}`
                }
                else {
                    const column = columns.find(column => column.field === key)
                    if (column) {
                        message = message + `\n• "${column.headerName}" field - ${error.data.detail[key]}`
                    }
                    else {
                        message = message + `\n• "${key}" API field - ${error.data.detail[key]}`
                    }
                }

            });
            setAlert({type: 'error', message: message});
        } else {
            console.error(error)
            setAlert({type: 'error', message: "Unexpected error occurred."});
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
            [id]: {mode: GridRowModes.View, ignoreModifications: true},
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
     * Function to open delete row Dialog for selected row.
     * @param {object} row - DataGrid row to be marked as "to delete".
     */
    const handleDeleteClick = (row) => {
        setObjectToDelete(row);
        setDeleteDialogOpen(true);
    };

    /**
     * Function to close delete row Dialog.
     */
    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setObjectToDelete(null);
    };

    /**
     * Function to perform API call to delete selected object.
     */
    const handleApiDelete = async () => {
        try {
            const deleteResponse = await deleteApiObject(apiUrl, objectToDelete.id);
            if (deleteResponse.errorOccurred) {
                setAlert({
                    type: 'error',
                    message: `Object was not deleted because of an error: ${deleteResponse.detail}`
                });
            } else {
                const rowsResponse = await getApiObjectsList(
                    apiUrl, paginationModel, sortModel, formatFilterModel(filterModel, columns)
                )
                setRows(rowsResponse.results);
                setRowCount(rowsResponse.count);
                setAlert({type: 'success', message: "Object deleted successfully"});
            }

        } catch (err) {
            setAlert({type: 'error', message: "Failed to delete object."});
        } finally {
            handleCloseDeleteDialog();
        }
    };

    return (
        <>
            <Box
                sx={{display: "flex", justifyContent: useContextBudget ? "space-between" : "right", alignItems: "end"}}>
                {useContextBudget && <BudgetSelector/>}
                <Button startIcon={<AddIcon/>} onClick={handleAddClick} sx={{color: red}}>Add</Button>
            </Box>
            <Box sx={{flexGrow: 1, marginTop: 2, width: '100%'}}>
                <DataGrid
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
                    sx={dataGridStyle}
                />
            </Box>
            <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
                <DialogTitle sx={{color: red}}>
                    {"Are you sure you want to delete this object?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Object and all of its related content will be removed.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} sx={{color: red}}>
                        Cancel
                    </Button>
                    <Button onClick={handleApiDelete} sx={{color: red}} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
export default DataTable;