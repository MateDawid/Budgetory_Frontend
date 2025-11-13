import React, { useContext, useState } from 'react';
import { GridPagination } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { BudgetContext } from '../../../app_infrastructure/store/BudgetContext';
import StyledButton from '../../../app_infrastructure/components/StyledButton';
import { AlertContext } from '../../../app_infrastructure/store/AlertContext';
import TransferBulkDeleteModal from '../TransferModal/TransferBulkDeleteModal';
import { copyApiObjects } from '../../../app_infrastructure/services/APIService';


/**
 * DataTableFooter component for DataTable custom footer.
 * @param {object} props
 * @param {string} props.apiUrl - Base API url for fetching data.
 * @param {number} props.transferType - Type of Transfer. Options: TransferTypes.INCOME, TransferTypes.EXPENSE.
 * @param {function} props.handleAddClick - Function to handle Add button click.
 * @param {array} props.selectedRows - Array containing ids of selected rows.
 * @param {object} props.props - Other properties.
 */
const TransferDataGridFooter = ({ apiUrl, transferType, handleAddClick, selectedRows, ...props }) => {
    const { setAlert } = useContext(AlertContext);
    const { updateRefreshTimestamp } = useContext(BudgetContext);
    const [bulkDeleteFormOpen, setBulkDeleteFormOpen] = useState(false);

    /**
     * Function to handle clicking "Delete" toolbar button.
     */
    const handleDeleteClick = async () => {
        setBulkDeleteFormOpen(true)
    };

    /**
     * Function to handle clicking "Copy" toolbar button.
     */
    const handleCopyClick = async () => {
        try {
            await copyApiObjects(apiUrl, selectedRows);
            setAlert({ type: 'success', message: `Selected Transfers copied successfully.` })
            updateRefreshTimestamp()
        } catch (error) {
            setAlert({ type: 'error', message: 'Transfers copying failed.' })
            console.error(error)
        }
    };

    return <>
        {selectedRows.length > 0 ?
            <>
                <StyledButton variant="outlined" startIcon={<DeleteIcon />} onClick={handleDeleteClick} sx={{ marginLeft: 1 }}>
                    Delete
                </StyledButton>

                <StyledButton variant="outlined" startIcon={<ContentCopyIcon />} onClick={handleCopyClick} sx={{ marginLeft: 1 }}>
                    Copy
                </StyledButton>

            </>
            :
            <StyledButton variant="outlined" startIcon={<AddIcon />} onClick={handleAddClick} sx={{ marginLeft: 1 }}>
                Add
            </StyledButton>
        }
        <GridPagination {...props} />
        <TransferBulkDeleteModal
            apiUrl={apiUrl}
            transferType={transferType}
            formOpen={bulkDeleteFormOpen}
            setFormOpen={setBulkDeleteFormOpen}
            selectedRows={selectedRows}
        />
    </>
}

export default TransferDataGridFooter;