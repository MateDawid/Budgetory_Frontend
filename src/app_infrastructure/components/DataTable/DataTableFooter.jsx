import React, {useContext, useEffect} from 'react';
import {GridPagination} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StyledButton from "../StyledButton";
import {bulkDeleteApiObjects, copyApiObjects} from "../../services/APIService";
import {AlertContext} from "../AlertContext";

/**
 * DataTableFooterButtons component that displays buttons basing on selected rows.
 * @param {string} apiUrl - Base API url for fetching data.
 * @param {function} handleAddClick - Function to handle Add button click.
 * @param {array} selectedRows - Array containing ids of selected rows.
 * @param {function} setRemovedRows - Function to set new value of removedRows to refresh DataTable.
 * @param {function} setCopiedRows - Function to set new value of copiedRows to refresh DataTable.
 */
const DataTableFooterButtons = ({apiUrl, handleAddClick, selectedRows, setRemovedRows, setCopiedRows}) => {
    const {setAlert} = useContext(AlertContext);

    /**
     * Used to rerender component on rows selection.
     */
    useEffect(() => {}, [selectedRows]);

    /**
     * Function to handle clicking "Delete" toolbar button.
     */
    const handleDeleteClick = async () => {
        try {
            await bulkDeleteApiObjects(apiUrl, selectedRows);
            setAlert({type: 'success', message: `Selected objects deleted successfully.`})
            setRemovedRows(selectedRows)
        } catch (error) {
            setAlert({type: 'error', message: 'Deleting objects failed.'})
            console.error(error)
        }
    };

    /**
     * Function to handle clicking "Copy" toolbar button.
     */
    const handleCopyClick = async () => {
        try {
            const copyResponse = await copyApiObjects(apiUrl, selectedRows);
            setAlert({type: 'success', message: `Selected objects copied successfully.`})
            setCopiedRows(copyResponse.ids)
        } catch (error) {
            setAlert({type: 'error', message: 'Copying objects failed.'})
            console.error(error)
        }
    };

    return <>
        {selectedRows.length > 0 ?
            <>
                <StyledButton variant="outlined" startIcon={<DeleteIcon/>} onClick={handleDeleteClick} sx={{marginLeft: 1}}>
                    Delete
                </StyledButton>
                <StyledButton variant="outlined" startIcon={<ContentCopyIcon/>} onClick={handleCopyClick} sx={{marginLeft: 1}}>
                    Copy
                </StyledButton>
            </>
            :
            <StyledButton variant="outlined" startIcon={<AddIcon/>} onClick={handleAddClick} sx={{marginLeft: 1}}>
                Add
            </StyledButton>
        }
    </>

}


/**
 * DataTableFooter component for DataTable custom footer.
 * @param {boolean} readOnly - Indicates if DataTable is read only or editable.
 * @param {string} apiUrl - Base API url for fetching data.
 * @param {function} handleAddClick - Function to handle Add button click.
 * @param {array} selectedRows - Array containing ids of selected rows.
 * @param {function} setRemovedRows - Function to set new value of removedRows to refresh DataTable.
 * @param {function} setCopiedRows - Function to set new value of copiedRows to refresh DataTable.
 * @param {object} props - Other properties.
 */
const DataTableFooter = ({readOnly, apiUrl, handleAddClick, selectedRows, setRemovedRows, setCopiedRows, ...props}) => {
    return <>
        {!readOnly && <DataTableFooterButtons
            apiUrl={apiUrl}
            handleAddClick={handleAddClick}
            selectedRows={selectedRows}
            setRemovedRows={setRemovedRows}
            setCopiedRows={setCopiedRows}
        />}
        <GridPagination {...props} />
    </>
}

export default DataTableFooter;