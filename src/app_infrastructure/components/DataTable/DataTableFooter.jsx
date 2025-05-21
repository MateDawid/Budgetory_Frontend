import React, {useContext, useEffect} from 'react';
import {GridPagination} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import StyledButton from "../StyledButton";
import {bulkDeleteApiObjects} from "../../services/APIService";
import {AlertContext} from "../AlertContext";

/**
 * DataTableFooterButtons component that displays buttons basing on selected rows.
 * @param {string} apiUrl - Base API url for fetching data.
 * @param {function} handleAddClick - Function to handle Add button click.
 * @param {array} selectedRows - Array containing ids of selected rows.
 * @param {function} setRemovedRows - Function to set new value of removedRows to refresh DataTable.
 */
const DataTableFooterButtons = ({apiUrl, handleAddClick, selectedRows, setRemovedRows}) => {
    const {setAlert} = useContext(AlertContext);

    /**
     * Used to rerender component on rows selection.
     */
    useEffect(() => {}, [selectedRows]);

    /**
     * Function to handle clicking "Delete selected" toolbar button.
     */
    const handleDeleteSelectedClick = async () => {
        try {
            await bulkDeleteApiObjects(apiUrl, selectedRows);
            setAlert({type: 'success', message: `Selected objects deleted successfully.`})
            setRemovedRows(selectedRows)
        } catch (error) {
            setAlert({type: 'error', message: 'Deleting objects failed.'})
            console.error(error)
        }
    };

    return <>
        {selectedRows.length > 0 ?
            <StyledButton variant="outlined" startIcon={<DeleteIcon/>} onClick={handleDeleteSelectedClick}
                          sx={{marginLeft: 1}}>
                Delete selected
            </StyledButton> :
            <StyledButton variant="outlined" startIcon={<AddIcon/>} onClick={handleAddClick} sx={{marginLeft: 1}}>
                Add
            </StyledButton>
        }
    </>

}


/**
 * DataTableFooter component for DataTable custom footer.
 * @param {string} apiUrl - Base API url for fetching data.
 * @param {function} handleAddClick - Function to handle Add button click.
 * @param {array} selectedRows - Array containing ids of selected rows.
 * @param {function} setRemovedRows - Function to set new value of removedRows to refresh DataTable.
 * @param {object} props - Other properties.
 */
const DataTableFooter = ({apiUrl, handleAddClick, selectedRows, setRemovedRows, ...props}) => {
    return <>
        <DataTableFooterButtons apiUrl={apiUrl} handleAddClick={handleAddClick} selectedRows={selectedRows}
                                setRemovedRows={setRemovedRows}/>
        <GridPagination {...props} />
    </>
}

export default DataTableFooter;