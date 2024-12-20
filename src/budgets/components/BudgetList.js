import React, {useState} from 'react';
import {getAccessToken, isLoggedIn} from "../../app_users/services/LoginService";
import {DataGrid} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Paper} from "@mui/material";
import {Navigate} from "react-router-dom";

// TODO:
// * tokenRefresh
// * BudgetListService
// * Table styling

const columns = [
    {field: 'name', headerName: 'NAME', flex: 1, filterable: false, sortable: false, hidable: false},
    {field: 'description', headerName: 'DESCRIPTION', flex: 7, filterable: false, sortable: false},
];

const pageSizeOptions = [1, 10, 50, 100]


/**
 * BudgetList component to display list of User Budgets.
 */
function BudgetList() {
    const token = getAccessToken();
    const [tableRefresh, setTableRefresh] = useState(true)
    const [rows, setRows] = useState([])
    const [rowCount, setRowCount] = useState(0)
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: pageSizeOptions[0],
        page: 0,
    });

    if (!isLoggedIn()) {
        return <Navigate to='/login'/>;
    }

    /**
     * Function to fetch Budgets list from API and update DataGrid rows.
     */
    function updateRows() {
        const url = `${process.env.BACKEND_URL}/api/budgets/?` + new URLSearchParams({
            page: paginationModel.page + 1,
            page_size: paginationModel.pageSize,
        }).toString()

        fetch(url, {
            method: 'GET',
            headers: {Authorization: `Bearer ${token}`},
        }).then((data) => data.json()).then((data) => {
            setRows(data.results);
            setRowCount(data.count);
        })
    }

    /**
     * Function to update DataGrid paginationModel.
     * @param {object} updatedPaginationModel - object containing new paginationModel data.
     */
    function updatePagination(updatedPaginationModel) {
        setPaginationModel(updatedPaginationModel);
        setTableRefresh(true);
    }

    if (tableRefresh) {
        updateRows();
        setTableRefresh(false);
    }

    return (
        <>
            <Paper elevation={10} sx={{padding: 2, bgColor: "#F1F1F1", width: '100%', maxWidth: '100%'}}>
                <Typography>BUDGETS</Typography>
                <Box sx={{width: '100%'}}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        paginationMode="server"
                        paginationModel={paginationModel}
                        onPaginationModelChange={updatePagination}
                        pageSizeOptions={pageSizeOptions}
                        rowCount={rowCount}
                        disableColumnResize={true}
                    />
                </Box>
            </Paper>
        </>);
}

export default BudgetList;