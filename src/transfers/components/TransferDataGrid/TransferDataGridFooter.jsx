import React, { useState } from 'react';
import { GridPagination } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StyledButton from '../../../app_infrastructure/components/StyledButton';
import TransferBulkDeleteModal from '../TransferModal/TransferBulkDeleteModal';
import TransferCopyModal from '../TransferModal/TransferCopyModal';


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
    const [bulkDeleteFormOpen, setBulkDeleteFormOpen] = useState(false);
    const [copyFormOpen, setCopyFormOpen] = useState(false);

    return <>
        {selectedRows.length > 0 ?
            <>
                <StyledButton variant="outlined" startIcon={<DeleteIcon />} onClick={() => setBulkDeleteFormOpen(true)} sx={{ marginLeft: 1 }}>
                    Delete
                </StyledButton>

                <StyledButton variant="outlined" startIcon={<ContentCopyIcon />} onClick={() => setCopyFormOpen(true)} sx={{ marginLeft: 1 }}>
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
        <TransferCopyModal
            apiUrl={apiUrl}
            transferType={transferType}
            formOpen={copyFormOpen}
            setFormOpen={setCopyFormOpen}
            selectedRows={selectedRows}
        />
    </>
}

export default TransferDataGridFooter;