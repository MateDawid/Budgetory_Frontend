import React, {useContext, useEffect, useMemo, useState} from 'react';
import {DataGrid} from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import {Grid, Paper} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import {AlertContext} from "../../app_infrastructure/components/AlertContext";
import {getBudgetingPeriodList} from "../services/BudgetingPeriodService";
import BudgetSelector from "../../app_infrastructure/components/BudgetSelector";
import {BudgetContext} from "../../app_infrastructure/components/BudgetContext";


const pageSizeOptions = [10, 50, 100]


/**
 * BudgetingPeriodList component to display list of Budget BudgetingPeriods.
 */
export default function BudgetingPeriodList() {
    const [rows, setRows] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: pageSizeOptions[0],
        page: 0,
    });
    const {alert, setAlert} = useContext(AlertContext);
    const {contextBudgetId} = useContext(BudgetContext);
    // const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    // const [budgetToDelete, setBudgetToDelete] = useState(null);

    const columns = useMemo(() => [
        {field: 'name', headerName: 'Name', flex: 2, filterable: false, sortable: false, editable: true},
        {
            field: 'date_start',
            type: 'date',
            headerName: 'Date start',
            flex: 7,
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
            flex: 7,
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
        {field: 'is_active', headerName: 'Active', flex: 1, filterable: false, sortable: false, editable: true}
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     headerName: 'Actions',
        //     flex: 1,
        //     cellClassName: 'actions',
        //     getActions: (params) => [
        //         <GridActionsCellItem key={params.row.id} icon={<EditIcon/>} label="Edit" component={Link}
        //                              onClick={() => {
        //                                  window.location = `/budgets/${contextBudgetId}/periods/${params.row.id}`;
        //                              }}
        //                              sx={{"& .MuiSvgIcon-root": {color: "#BD0000"}}}
        //         />,
        //         <GridActionsCellItem key={params.row.id} icon={<DeleteIcon/>} label="Delete" component={Link}
        //                              onClick={() => handleOpenDeleteDialog(params.row)}
        //                              sx={{"& .MuiSvgIcon-root": {color: "#BD0000"}}}
        //         />,
        //     ]
        // },
    ], []);

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
    }, [contextBudgetId, paginationModel]);

    /**
     * Function to update DataGrid pagination model.
     * @param {object} updatedPaginationModel - updated pagination model.
     */
    function updatePagination(updatedPaginationModel) {
        setPaginationModel(updatedPaginationModel);
    }

    const handleEditCellChange = (params) => {
        console.log(params)
        const updatedRows = rows.map((row) =>
            row.id === params.id ? {...row, [params.field]: params.value} : row
        );
        setRows(updatedRows);
    };

    const handleSubmit = async () => {
        console.log(rows)
        // try {
        //     // Replace with your API endpoint
        //     const response = await axios.post('https://your-api-endpoint.com/data', rows);
        //     if (response.status === 200) {
        //         console.log('Data submitted successfully');
        //     }
        // } catch (error) {
        //     console.error('Error submitting data:', error);
        // }
    };

    // /**
    //  * Function to open delete row Dialog for selected Budget row.
    //  * @param {object} row - DataGrid row to be marked as "to delete".
    //  */
    // const handleOpenDeleteDialog = (row) => {
    //     setBudgetToDelete(row);
    //     setDeleteDialogOpen(true);
    // };
    //
    // /**
    //  * Function to close delete row Dialog.
    //  */
    // const handleCloseDeleteDialog = () => {
    //     setDeleteDialogOpen(false);
    //     setBudgetToDelete(null);
    // };

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
                <Grid container direction="row" sx={{justifyContent: "space-between", alignItems: "center"}}>
                    <Grid size={1}>
                        <Typography variant="h4" gutterBottom
                                    sx={{display: 'block', color: '#BD0000'}}>Periods</Typography>
                    </Grid>
                    <Grid size={1}>
                        <Button startIcon={<AddIcon/>} onClick={() => {
                            window.location = `/budgets/${contextBudgetId}/add`;
                        }} sx={{color: "#BD0000"}}>Add period</Button>
                    </Grid>
                </Grid>
                <Divider />
                {alert && <Alert sx={{marginTop: 2}} severity={alert.type}
                                 onClose={() => setAlert(null)}>{alert.message}</Alert>}
                <BudgetSelector/>
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
                        onEditCellChangeCommitted={handleEditCellChange}
                        sx={{
                            backgroundColor: "#EEEEEE",
                            "& .MuiDataGrid-columnHeader": {
                                backgroundColor: "#BD0000",
                                color: "#F1F1F1",
                            },
                            '.MuiDataGrid-columnHeaderTitle': {
                                fontWeight: 'bold !important',
                            },
                            "& .MuiDataGrid-footerContainer": {
                                backgroundColor: "#BD0000",
                                color: "#F1F1F1"
                            },
                            "& .MuiSvgIcon-root": {
                                color: "#F1F1F1"
                            },
                            "& .MuiInputBase-root": {color: "#F1F1F1"},
                            "& .MuiTablePagination-selectLabel": {color: "#F1F1F1"},
                            "& .MuiTablePagination-displayedRows": {color: "#F1F1F1"},
                            "& .MuiDataGrid-row.Mui-selected": {backgroundColor: "#d0d0d0"},
                            "& .MuiDataGrid-row.Mui-selected:hover": {backgroundColor: "#d0d0d0"},
                            '& .MuiDataGrid-cell:hover': {color: "#BD0000",},
                        }}
                    />
                </Box>
            </Paper>
            <Button variant="contained" color="primary" onClick={handleSubmit} style={{marginBottom: 16}}>
                Submit
            </Button>
            {/*<Dialog*/}
            {/*    open={deleteDialogOpen}*/}
            {/*    onClose={handleCloseDeleteDialog}*/}
            {/*    aria-labelledby="alert-dialog-title"*/}
            {/*    aria-describedby="alert-dialog-description"*/}
            {/*>*/}
            {/*    <DialogTitle id="alert-dialog-title" sx={{color: '#BD0000'}}>*/}
            {/*        {"Are you sure you want to delete this budget?"}*/}
            {/*    </DialogTitle>*/}
            {/*    <DialogContent>*/}
            {/*        <DialogContentText id="alert-dialog-description">*/}
            {/*            Period and all of its related objects will be removed.*/}
            {/*        </DialogContentText>*/}
            {/*    </DialogContent>*/}
            {/*    <DialogActions>*/}
            {/*        <Button onClick={handleCloseDeleteDialog} sx={{color: '#BD0000'}}>*/}
            {/*            Cancel*/}
            {/*        </Button>*/}
            {/*        <Button onClick={handleDeleteBudget} sx={{color: '#BD0000'}} autoFocus>*/}
            {/*            Confirm*/}
            {/*        </Button>*/}
            {/*    </DialogActions>*/}
            {/*</Dialog>*/}
        </>
    );
}