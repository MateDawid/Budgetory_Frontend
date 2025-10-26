import React, { useContext, useEffect, useState } from 'react';
import {
    GridActionsCellItem,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from "react-router-dom";
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';
import { AlertContext } from '../../app_infrastructure/store/AlertContext';
import { BudgetContext } from '../../app_infrastructure/store/BudgetContext';
import StyledDataGrid from '../../app_infrastructure/components/DataTable/StyledDataGrid';
import { formatFilterModel, mappedFilterOperators } from '../../app_infrastructure/components/DataTable/utils/FilterHandlers';
import getSortFieldMapping from '../../app_infrastructure/components/DataTable/utils/getSortFieldMapping';


const pageSizeOptions = [10, 50, 100]

const gridActionsCellItemStyle = { "& .MuiSvgIcon-root": { color: "#252525" } }


/**
 * DataTable component for displaying DataGrid with data fectched from API.
 * @param {object} props
 * @param {object} props.columns - Columns settings.
 * @param {object} props.apiUrl - Base API url for fetching data.
 * @param {object} props.clientUrl - Frontend base url for redirects in readOnly mode.
 * @param {object} props.height - Height of DataTable.
 */
const BudgetDepositsDataGrid = ({
    columns,
    apiUrl,
    clientUrl = null,
    height = 600,
}) => {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: pageSizeOptions[0],
        page: 0,
    });
    const [sortModel, setSortModel] = React.useState({});
    const [filterModel, setFilterModel] = React.useState({ items: [] });
    const { setAlert } = useContext(AlertContext);
    const { contextBudgetId } = useContext(BudgetContext);

    const visibleColumns = columns.filter(column => !column.hide);

    const extendedColumns = [
        ...visibleColumns.map((column) => ({
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
                return [
                    <GridActionsCellItem
                        key={params.id}
                        icon={<OpenInNewIcon />}
                        label="Open"
                        sx={gridActionsCellItemStyle}
                        onClick={() => navigate(`${clientUrl}${params.id}`)}
                    />,
                ];
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
                    apiUrl, paginationModel, sortModel, formatFilterModel(filterModel, visibleColumns)
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
    }, [contextBudgetId, paginationModel, sortModel, filterModel]);

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

    return (
        <>
            <Box sx={{ flexGrow: 1, marginTop: 2, width: '100%', maxWidth: '100%', height: height }}>
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
                />
            </Box>
        </>
    )
}
export default BudgetDepositsDataGrid;
