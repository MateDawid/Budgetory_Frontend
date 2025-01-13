import React, {useContext, useEffect, useState} from 'react';
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import {Grid, Link, Paper} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import {getBudgetList} from "../services/BudgetService";
import Alert from '@mui/material/Alert';
import {AlertContext} from "../../app_infrastructure/components/AlertContext";


const columns = [
    {
        field: 'name',
        headerClassName: '.datagrid--header',
        headerName: 'Name',
        flex: 2,
        filterable: false,
        sortable: false
    },
    {field: 'description', headerName: 'Description', flex: 7, filterable: false, sortable: false},
    {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        flex: 1,
        cellClassName: 'actions',
        getActions: (params) => {
            return [
                <GridActionsCellItem key={params.row.id} icon={<EditIcon/>} label="Edit" component={Link}
                    onClick={() => {
                        window.location = `/budgets/${params.row.id}`;
                    }}
                    sx={{
                        "& .MuiSvgIcon-root": {
                            color: "#BD0000"
                        },
                    }}
                />,
            ];
        }
    },
];

const pageSizeOptions = [10, 50, 100]


/**
 * BudgetList component to display list of User Budgets.
 */
export default function BudgetList() {
    const [rows, setRows] = useState([])
    const [rowCount, setRowCount] = useState(0)
    const [loading, setLoading] = useState(true);
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: pageSizeOptions[0],
        page: 0,
    });
    const {alert, setAlert} = useContext(AlertContext);

    /**
     * useEffect updating DataGrid data.
     */
    useEffect(() => {
        const loadBudgets = async () => {
            try {
                const apiResponse = await getBudgetList(paginationModel);
                setRows(apiResponse.results);
                setRowCount(apiResponse.count);
            } catch (err) {
                setAlert({type: 'error', message: "Failed to load budgets"})
            } finally {
                setLoading(false);
            }
        }
        loadBudgets()
    }, [paginationModel]);


    /**
     * Function to update DataGrid paginationModel.
     * @param {object} updatedPaginationModel - object containing new paginationModel data.
     */
    function updatePagination(updatedPaginationModel) {
        setPaginationModel(updatedPaginationModel);
    }

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
                                    sx={{display: 'block', color: '#BD0000'}}>Budgets</Typography>
                    </Grid>
                    <Grid size={1}>
                        <Button startIcon={<AddIcon/>} onClick={() => {
                            window.location = `/budgets/add`;
                        }} sx={{color: "#BD0000"}}>Add budget</Button>
                    </Grid>
                </Grid>
                <Divider />
                {alert && <Alert sx={{marginTop: 2}} severity={alert.type} onClose={() => setAlert(null)}>{alert.message}</Alert>}
                <Box sx={{padding: 2, width: '100%'}}>
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
        </>);
}
