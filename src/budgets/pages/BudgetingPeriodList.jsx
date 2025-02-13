import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
    DataGrid,
    GridActionsCellItem,
    GridRowEditStopReasons,
    GridRowModes,
} from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Alert from '@mui/material/Alert';
import {AlertContext} from "../../app_infrastructure/components/AlertContext";
import {getBudgetingPeriodList, createBudgetingPeriod, updateBudgetingPeriod} from "../services/BudgetingPeriodService";
import BudgetSelector from "../../app_infrastructure/components/BudgetSelector";
import {BudgetContext} from "../../app_infrastructure/components/BudgetContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from '@mui/icons-material/Close';
import SaveIcon from "@mui/icons-material/Save";
import {prepareApiInput} from "../../app_infrastructure/utils/ApiInputFormatters";
import ApiError from "../../app_infrastructure/utils/ApiError";
import AddIcon from "@mui/icons-material/Add";


const pageSizeOptions = [10, 50, 100]


/**
 * BudgetingPeriodList component to display list of Budget BudgetingPeriods.
 */
export default function BudgetingPeriodList() {
    const [rows, setRows] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [addedObjectId, setAddedObjectId] = useState(null)
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [loading, setLoading] = useState(true);
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: pageSizeOptions[0],
        page: 0,
    });
    const {alert, setAlert} = useContext(AlertContext);
    const {contextBudgetId} = useContext(BudgetContext);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    // const [budgetToDelete, setBudgetToDelete] = useState(null);

    const columns = useMemo(() => [
        {field: 'name', headerName: 'Name', flex: 3, filterable: false, sortable: false, editable: true},
        {
            field: 'date_start',
            type: 'date',
            headerName: 'Date start',
            flex: 2,
            filterable: false,
            sortable: false,
            editable: true,
            valueGetter: (value) => {
                return new Date(value);
            },
            valueFormatter: (value) => {
                return value.toLocaleDateString('en-CA')
            },
        },
        {
            field: 'date_end',
            type: 'date',
            headerName: 'Date end',
            flex: 2,
            filterable: false,
            sortable: false,
            editable: true,
            valueGetter: (value) => {
                return new Date(value);
            },
            valueFormatter: (value) => {
                return value.toLocaleDateString('en-CA')
            },
        },
        {
            field: 'is_active',
            type: 'boolean',
            headerName: 'Active',
            flex: 1,
            filterable: false,
            sortable: false,
            editable: true
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            flex: 2,
            cellClassName: 'actions',
            getActions: (params) => {
                const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            key={params.id}
                            icon={<SaveIcon/>}
                            label="Save"
                            sx={{"& .MuiSvgIcon-root": {color: "#BD0000"}}}
                            onClick={handleSaveClick(params.row)}
                        />,
                        <GridActionsCellItem
                            key={params.id}
                            icon={<CancelIcon/>}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(params.row.id)}
                            sx={{"& .MuiSvgIcon-root": {color: "#BD0000"}}}
                        />,
                    ];
                } else {
                    return [
                        <GridActionsCellItem key={params.id} icon={<EditIcon/>} label="Edit"
                                             onClick={handleEditClick(params.row)}
                                             sx={{"& .MuiSvgIcon-root": {color: "#BD0000"}}}
                        />,
                        <GridActionsCellItem key={params.id} icon={<DeleteIcon/>} label="Delete"
                                             onClick={() => handleDeleteClick(params.row)}
                                             sx={{"& .MuiSvgIcon-root": {color: "#BD0000"}}}
                        />,
                    ]
                }
            }
        },
    ], [rowModesModel]);

    /**
     * Tries to fetch BudgetingPeriods for selected Budget.
     */
    useEffect(() => {
        const loadData = async () => {
            if (!contextBudgetId) {
                setLoading(false);
                return
            }
            try {
                const rowsResponse = await getBudgetingPeriodList(contextBudgetId, paginationModel);
                setRows(rowsResponse.results);
                setRowCount(rowsResponse.count);
            } catch (err) {
                setAlert({type: 'error', message: "Failed to load periods"});
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [contextBudgetId, paginationModel, addedObjectId]);

    /**
     * Function to update DataGrid pagination model.
     * @param {object} updatedPaginationModel - updated pagination model.
     */
    function updatePagination(updatedPaginationModel) {
        setPaginationModel(updatedPaginationModel);
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
        const id = 0
        setRows((oldRows) => {
            return [
                {id, name: '', age: '', role: '', isNew: true},
                ...oldRows,
            ]
        });
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: {mode: GridRowModes.Edit, fieldToFocus: 'name'},
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
        const processedRow = prepareApiInput(row)
        if (processedRow.isNew) {
            const createResponse = await createBudgetingPeriod(contextBudgetId, processedRow);
            setAlert({type: 'success', message: `Period ${createResponse.name} created successfully.`})
            setAddedObjectId(createResponse.id)
            return createResponse;
        } else {
            const updateResponse = await updateBudgetingPeriod(contextBudgetId, processedRow);
            setAlert({type: 'success', message: `Period ${updateResponse.name} updated successfully.`})
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
                } else {
                    const column = columns.find(column => column.field === key)
                    message = message + `\n• "${column.headerName}" field - ${error.data.detail[key]}`
                }

            });
            setAlert({type: 'error', message: message});
        }
        else {
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
        // TODO: After ADD function
        // setBudgetToDelete(row);
        console.log(row)
        setDeleteDialogOpen(true);
    };

    /**
     * Function to close delete row Dialog.
     */
    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        // setBudgetToDelete(null);
    };

    // /**
    //  * Function to perform API call for deleting selected Budget.
    //  */
    // const handleDeleteBudget = async () => {
    //     try {
    //         const deleteResponse = await deleteBudget(budgetToDelete.id);
    //         if (deleteResponse.errorOccurred) {
    //             setAlert({
    //                 type: 'error',
    //                 message: `Budget was not deleted because of an error: ${deleteResponse.detail}`
    //             });
    //         } else {
    //             const listResponse = await getBudgetList(paginationModel);
    //             setRows(listResponse.results);
    //             setRowCount(listResponse.count);
    //             setAlert({type: 'success', message: "Budget deleted successfully"});
    //         }
    //
    //     } catch (err) {
    //         setAlert({type: 'error', message: "Failed to delete budget."});
    //     } finally {
    //         handleCloseDeleteDialog();
    //     }
    // };

    return (
        <>
            <Paper elevation={24} sx={{
                padding: 2, bgColor: "#F1F1F1", width: '100%', maxWidth: '100%',
                '& .datagrid--header': {
                    backgroundColor: '#BD0000',
                }
            }}>
                <Typography variant="h4" gutterBottom
                                    sx={{display: 'block', color: '#BD0000'}}>Periods</Typography>
                <Divider />
                {alert && <Alert sx={{marginTop: 2, whiteSpace: 'pre-wrap'}} severity={alert.type}
                                 onClose={() => setAlert(null)}>{alert.message}</Alert>}
                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "end"}}>
                    <BudgetSelector/>
                    <Button startIcon={<AddIcon/>} onClick={handleAddClick} sx={{color: "#BD0000"}}>Add</Button>
                </Box>
                <Box sx={{flexGrow: 1, marginTop: 2, width: '100%'}}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        paginationMode="server"
                        rowCount={rowCount}
                        paginationModel={paginationModel}
                        onPaginationModelChange={updatePagination}
                        pageSizeOptions={pageSizeOptions}
                        disableColumnResize={true}
                        editMode="row"
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={handleRowModesModelChange}
                        onRowEditStop={handleRowEditStop}
                        processRowUpdate={processRowUpdate}
                        onProcessRowUpdateError={handleProcessRowUpdateError}
                        sx={{
                            backgroundColor: "#EEEEEE",
                            "& .MuiDataGrid-columnHeader": {
                                backgroundColor: "#252525",
                                color: "#F1F1F1",
                            },
                            '.MuiDataGrid-columnHeaderTitle': {
                                fontWeight: 'bold !important',
                            },
                            "& .MuiDataGrid-footerContainer": {
                                backgroundColor: "#252525",
                                color: "#F1F1F1"
                            },
                            "& .MuiSvgIcon-root": {
                                color: "#F1F1F1"
                            },
                            "& .MuiInputBase-root": {color: "#F1F1F1"},
                            "& .MuiTablePagination-selectLabel": {color: "#F1F1F1"},
                            "& .MuiTablePagination-displayedRows": {color: "#F1F1F1"},
                            '& .MuiDataGrid-row': {backgroundColor: "#d0d0d0"},
                            '& .MuiDataGrid-cell--editing': {backgroundColor: "red"},
                            "& .MuiDataGrid-row.Mui-selected": {backgroundColor: "#d0d0d0"},
                            "& .MuiDataGrid-row.Mui-selected:hover": {backgroundColor: "#d0d0d0"},
                            '& .MuiDataGrid-cell:hover': {color: "#252525", fontWeight: "bold"},
                            '& .MuiInputBase-input': {color: "#252525"},
                        }}
                    />
                </Box>
            </Paper>
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCancelDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{color: '#BD0000'}}>
                    {"Are you sure you want to delete this budget?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Period and all of its related objects will be removed.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCancelDelete}
                        sx={{color: '#BD0000'}}
                    >
                        Cancel
                    </Button>
                    <Button
                        // onClick={handleDeleteBudget}
                        sx={{color: '#BD0000'}}
                        autoFocus
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}