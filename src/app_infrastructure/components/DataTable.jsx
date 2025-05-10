import React, {useContext, useEffect, useState} from 'react';
import {
    DataGrid,
    GridActionsCellItem
} from "@mui/x-data-grid";
import PageviewIcon from '@mui/icons-material/Pageview';
import {AlertContext} from "./AlertContext";
import {BudgetContext} from "./BudgetContext";
import {white, black, lightGrey} from "../utils/Colors";
import {formatFilterModel, mappedFilterOperators} from "../utils/DataTable/FilterHandlers";
import {getApiObjectsList} from "../services/APIService";
import {useNavigate} from "react-router-dom";
import {styled} from "@mui/material/styles";
import {
    Delete as DeleteIcon,
} from "@mui/icons-material";
import DeleteModal from "./DeleteModal";
const pageSizeOptions = [10, 50, 100]


const StyledDataGrid = styled(DataGrid)({
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
});

/**
 * Function to prepare mapping of API ordering fields for DataTable columns other than column names.
 * @param {object} columns - DataTable columns definitions.
 * @return {object} - Mapping for sorting DataTable rows.
 */
const getSortFieldMapping = (columns) => {
    return columns.reduce((acc, column) => {
        if (column.sortField) {
            acc[column.field] = column.sortField;
        }
        return acc;
    }, {});
};


/**
 * DataTable component for displaying DataGrid with data fetched from API.
 * @param {object} columns - Displayed columns settings.
 * @param {string} apiUrl - Base API url for fetching data.
 * @param {string} clientUrl - Base client url for redirecting.
 * @param {string} addedObjectId - useState setter for refreshing objects list on object adding.
 * @param {boolean} editMode - Changes actions displayed on table. Displays edit and delete buttons if true.
 */
const DataTable = ({columns, apiUrl, clientUrl, addedObjectId, editMode = false}) => {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [objectToDelete, setObjectToDelete] = useState(null);
    const [deletedObjectId, setDeletedObjectId] = useState(null);
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: pageSizeOptions[0],
        page: 0,
    });
    const [sortModel, setSortModel] = React.useState({});
    const [filterModel, setFilterModel] = React.useState({items: []});
    const {setAlert} = useContext(AlertContext);
    const {contextBudgetId} = useContext(BudgetContext);
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
                return editMode ? [
                    <GridActionsCellItem
                        key={params.id}
                        icon={<DeleteIcon/>}
                        label="Delete"
                        sx={{"& .MuiSvgIcon-root": {color: black}}}
                        onClick={() => {
                            setObjectToDelete(params.row)
                            setDeleteModalOpen(true)
                        }}
                    />] : [
                    <GridActionsCellItem
                        key={params.id}
                        icon={<PageviewIcon/>}
                        label="Edit"
                        sx={{"& .MuiSvgIcon-root": {color: black}}}
                        onClick={() => navigate(`${clientUrl}${params.id}`)}
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
                setAlert({type: 'error', message: "Failed to load table rows."});
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [contextBudgetId, paginationModel, sortModel, filterModel, addedObjectId, deletedObjectId]);

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
            />
            {objectToDelete && (<DeleteModal
                open={deleteModalOpen}
                setOpen={setDeleteModalOpen}
                objectId={objectToDelete.id}
                apiUrl={apiUrl}
                setDeletedObjectId={setDeletedObjectId}
                message={`Are you sure you want to delete this object? This action is irreversible.`}
                objectDisplayName={`"${objectToDelete.name}"`}
            />)}
        </>
    )
}
export default DataTable;