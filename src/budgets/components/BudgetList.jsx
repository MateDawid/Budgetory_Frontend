import React, {useEffect, useState} from 'react';
import {getAccessToken} from "../../app_users/services/LoginService";
import {DataGrid} from "@mui/x-data-grid";
import {useNavigate} from "react-router-dom";
import Typography from "@mui/material/Typography";
import {Paper} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

// TODO:
// * tokenRefresh
// * BudgetListService
// * Table styling

const columns = [
    {field: 'name', headerName: 'NAME', flex: 1, filterable: false, sortable: false},
    {field: 'description', headerName: 'DESCRIPTION', flex: 7, filterable: false, sortable: false},
];

const pageSizeOptions = [10, 50, 100]


/**
 * BudgetList component to display list of User Budgets.
 */
export default function BudgetList() {
    const [token, setToken] = useState(null)
    const [rows, setRows] = useState([])
    const [rowCount, setRowCount] = useState(0)
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: pageSizeOptions[0],
        page: 0,
    });
    const navigate = useNavigate();

    /**
     * useEffect updating DataGrid data or redirecting to login page.
     */
    useEffect(() => {
        const getToken = async () => {
            setToken(await getAccessToken())
        }
        getToken()
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/?` + new URLSearchParams({
            page: paginationModel.page + 1,
            page_size: paginationModel.pageSize,
        }).toString();

        fetch(url, {
            method: 'GET',
            headers: {Authorization: `Bearer ${token}`},
        }).then((data) => data.json()).then((data) => {
            setRows(data.results);
            setRowCount(data.count);
        });

    }, [paginationModel, token, navigate]);


    /**
     * Function to update DataGrid paginationModel.
     * @param {object} updatedPaginationModel - object containing new paginationModel data.
     */
    function updatePagination(updatedPaginationModel) {
        setPaginationModel(updatedPaginationModel);
    }

    return (
        <>
            <Paper elevation={24} sx={{padding: 2, bgColor: "#F1F1F1", width: '100%', maxWidth: '100%'}}>
                <Typography variant="h4" gutterBottom sx={{ display: 'block', color: '#BD0000'}}>
                    Budgets
                </Typography>
                <Divider />
                <Box sx={{padding: 2, width: '100%'}}>
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
