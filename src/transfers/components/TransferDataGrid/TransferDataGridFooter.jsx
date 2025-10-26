import React, { useContext, useEffect } from 'react';
import { GridPagination } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { BudgetContext } from '../../../app_infrastructure/store/BudgetContext';
import StyledButton from '../../../app_infrastructure/components/StyledButton';
import { bulkDeleteApiObjects, copyApiObjects } from '../../../app_infrastructure/services/APIService';
import { AlertContext } from '../../../app_infrastructure/store/AlertContext';

/**
 * DataTableFooterButtons component that displays buttons basing on selected rows.
 * @param {object} props
 * @param {string} props.apiUrl - Base API url for fetching data.
 * @param {function} props.handleAddClick - Function to handle Add button click.
 * @param {array} props.selectedRows - Array containing ids of selected rows.
 * @param {function} props.setRemovedRows - Function to set new value of removedRows to refresh DataTable.
 * @param {function} props.setCopiedRows - Function to set new value of copiedRows to refresh DataTable.
 * @param {boolean} props.rightbarDepositsRefresh - Indicates if Rightbar Budgets should be refreshed after deleting an object
 * @param {boolean} props.copySelectedDisabled - Indicates if footer 'copy selected' button should be visible or not
 * @param {boolean} props.deleteSelectedDisabled - Indicates if footer 'delete selected' button should be visible or not
 */
const TransferDataGridFooterButtons = ({ apiUrl, handleAddClick, selectedRows, setRemovedRows, setCopiedRows, rightbarDepositsRefresh, copySelectedDisabled, deleteSelectedDisabled }) => {
    const { setAlert } = useContext(AlertContext);
    const { updateRefreshTimestamp } = useContext(BudgetContext);

    /**
     * Used to rerender component on rows selection.
     */
    useEffect(() => { }, [selectedRows]);

    /**
     * Function to handle clicking "Delete" toolbar button.
     */
    const handleDeleteClick = async () => {
        try {
            await bulkDeleteApiObjects(apiUrl, selectedRows);
            setAlert({ type: 'success', message: `Selected Transfers deleted successfully.` })
            setRemovedRows(selectedRows)
            if (rightbarDepositsRefresh) {
                updateRefreshTimestamp()
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Transfers deleting failed.' })
            console.error(error)
        }
    };

    /**
     * Function to handle clicking "Copy" toolbar button.
     */
    const handleCopyClick = async () => {
        try {
            const copyResponse = await copyApiObjects(apiUrl, selectedRows);
            setAlert({ type: 'success', message: `Selected Transfers copied successfully.` })
            setCopiedRows(copyResponse.ids)
            if (rightbarDepositsRefresh) {
                updateRefreshTimestamp()
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Transfers copying failed.' })
            console.error(error)
        }
    };

    return <>
        {selectedRows.length > 0 ?
            <>
                {!deleteSelectedDisabled &&
                    <StyledButton variant="outlined" startIcon={<DeleteIcon />} onClick={handleDeleteClick} sx={{ marginLeft: 1 }}>
                        Delete
                    </StyledButton>
                }
                {!copySelectedDisabled &&
                    <StyledButton variant="outlined" startIcon={<ContentCopyIcon />} onClick={handleCopyClick} sx={{ marginLeft: 1 }}>
                        Copy
                    </StyledButton>
                }
            </>
            :
            <StyledButton variant="outlined" startIcon={<AddIcon />} onClick={handleAddClick} sx={{ marginLeft: 1 }}>
                Add
            </StyledButton>
        }
    </>

}


/**
 * DataTableFooter component for DataTable custom footer.
 * @param {object} props
 * @param {boolean} props.readOnly - Indicates if DataTable is read only or editable.
 * @param {string} props.apiUrl - Base API url for fetching data.
 * @param {function} props.handleAddClick - Function to handle Add button click.
 * @param {array} props.selectedRows - Array containing ids of selected rows.
 * @param {function} props.setRemovedRows - Function to set new value of removedRows to refresh DataTable.
 * @param {function} props.setCopiedRows - Function to set new value of copiedRows to refresh DataTable.
 * @param {boolean} props.rightbarDepositsRefresh - Indicates if Rightbar Budgets should be refreshed after deleting an object
 * @param {boolean} props.copySelectedDisabled - Indicates if footer 'copy selected' button should be visible or not
 * @param {boolean} props.deleteSelectedDisabled - Indicates if footer 'delete selected' button should be visible or not
 * @param {object} props.props - Other properties.
 */
const TransferDataGridFooter = ({ readOnly, apiUrl, handleAddClick, selectedRows, setRemovedRows, setCopiedRows, rightbarDepositsRefresh, copySelectedDisabled, deleteSelectedDisabled, ...props }) => {
    return <>
        {(!readOnly) && <TransferDataGridFooterButtons
            apiUrl={apiUrl}
            handleAddClick={handleAddClick}
            selectedRows={selectedRows}
            setRemovedRows={setRemovedRows}
            setCopiedRows={setCopiedRows}
            rightbarDepositsRefresh={rightbarDepositsRefresh}
            copySelectedDisabled={copySelectedDisabled}
            deleteSelectedDisabled={deleteSelectedDisabled}
        />}
        <GridPagination {...props} />
    </>
}

export default TransferDataGridFooter;