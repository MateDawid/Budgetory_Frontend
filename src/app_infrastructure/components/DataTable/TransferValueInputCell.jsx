import {InputAdornment, TextField} from "@mui/material";
import React, {useContext} from "react";
import {BudgetContext} from "../../store/BudgetContext";

/**
 * TransferValueInputCell component to display Transfer value edit field in DataGrid cell.
 * @param {object} params - Params for field. Contains:
 *  - {number} id - Edited object id.
 *  - {string} field - Edited field name.
 *  - {number} value - Current value of field.
 */
export default function TransferValueInputCell(params) {
    const {contextBudgetCurrency} = useContext(BudgetContext);

    return <TextField
        fullWidth
        sx={{
            '& .MuiInputBase-root': {
                fontSize: "0.875rem",
                height: '100%',
            },
            '& .MuiTextField-root': {
                height: '100%',
            },
        }}
        type="number"
        value={params.value ?? ''}
        onChange={(event) => {
            const newValue = parseFloat(event.target.value);
            params.api.setEditCellValue({id: params.id, field: params.field, value: newValue}, event);
        }}
        slotProps={{
            input: {endAdornment: <InputAdornment position="end">{contextBudgetCurrency}</InputAdornment>}
        }}
    />
}