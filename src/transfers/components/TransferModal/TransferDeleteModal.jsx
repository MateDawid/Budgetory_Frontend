

import React, { useContext } from "react";
import { AlertContext } from "../../../app_infrastructure/store/AlertContext";
import { BudgetContext } from "../../../app_infrastructure/store/BudgetContext";
import { deleteApiObject } from "../../../app_infrastructure/services/APIService";
import TransferTypes from "../../utils/TransferTypes";
import { Box, Typography, Button } from "@mui/material";
import StyledModal from "../../../app_infrastructure/components/StyledModal";

/**
 * TransferDeleteModal component for displaying delete Transfer form.
 * @param {object} props
 * @param {string} props.apiUrl - URL to be called on form submit.
 * @param {number} props.transferType - Type of Transfer. Options: TransferTypes.INCOME, TransferTypes.EXPENSE.
 * @param {boolean} props.formOpen - Flag indicating if form is opened or not.
 * @param {function} props.setFormOpen - Setter for formOpen flag.
 * @param {string} [props.deletedTransferId] - Transfer object to be deleted id value.
 * @param {function} [props.setDeletedTransferId] - Setter for deletedTransferId value.
 */
export default function TransferDeleteModal({ apiUrl, transferType, formOpen, setFormOpen, deletedTransferId, setDeletedTransferId }) {
    const { updateRefreshTimestamp } = useContext(BudgetContext);
    const { setAlert } = useContext(AlertContext);

    /**
    * Function to handle deleting object in API.
    */
    const handleDelete = async () => {
        try {
            await deleteApiObject(apiUrl, deletedTransferId);
            updateRefreshTimestamp()
            setAlert({ type: 'success', message: `${transferType === TransferTypes.EXPENSE ? 'Expense' : 'Income'} deleted successfully.` })
        } catch (error) {
            setAlert({ type: 'error', message: error.message });
        }
    };

    return (
        <StyledModal open={formOpen} onClose={() => {setFormOpen(false), setDeletedTransferId(undefined)}}>
            <Box
                width={400}
                bgcolor="#F1F1F1"
                p={3}
                borderRadius={5}
            >
                <Typography variant="h6" component="h2" textAlign="center">
                    Delete {transferType === TransferTypes.INCOME ? 'Income' : 'Expense'}
                </Typography>
                <Box component="form" onSubmit={handleDelete} noValidate sx={{ mt: 1 }}>
                    <Typography>Are you sure you want to delete {transferType === TransferTypes.EXPENSE ? 'Expense' : 'Income'}?</Typography>
                    <Box display="flex" justifyContent="space-between">
                        <Button onClick={() => setFormOpen(false)}
                            variant="contained" fullWidth sx={{
                                width: "45%",
                                mt: 2,
                                backgroundColor: "#FFFFFF",
                                color: "#BD0000",
                            }}>
                            Cancel
                        </Button>
                        <Button type="submit"
                            variant="contained"
                            fullWidth sx={{
                                width: "45%",
                                mt: 2,
                                backgroundColor: "#BD0000",
                                color: "#FFFFFF",
                            }}>
                            Delete
                        </Button>
                    </Box>
                </Box>
            </Box>
        </StyledModal>
    )
}