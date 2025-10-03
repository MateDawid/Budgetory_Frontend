import { TableRow, TableCell, Stack, Typography, IconButton } from "@mui/material";
import React, { useState, useContext } from "react";
import ColouredLinearProgress from "../../../app_infrastructure/components/CustomLinearProgress/ColouredLinearProgress";
import { BudgetContext } from "../../../app_infrastructure/store/BudgetContext";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import { getFontColor } from './utils';
import PredictionDeleteModal from "./PredictionDeleteModal";

export default function DraftPeriodPredictionRow(props) {
    const { row } = props;
    const [deleteOpen, setDeleteOpen] = useState(false);
    const { contextBudgetCurrency } = useContext(BudgetContext);

    const previousResultsFontColor = getFontColor(row.previous_result, row.previous_plan);
    const currentResultsFontColor = getFontColor(row.current_result, row.current_plan);

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell align='center'>{row.category_owner}</TableCell>
                <TableCell align='center'>{row.category_display}</TableCell>
                <TableCell align='center' sx={{ color: previousResultsFontColor }}>{row.previous_result}{`\u00A0${contextBudgetCurrency}`} / {row.previous_plan}{`\u00A0${contextBudgetCurrency}`}</TableCell>
                <TableCell align='center' sx={{ color: currentResultsFontColor }}>{row.current_result}{`\u00A0${contextBudgetCurrency}`} / {row.current_plan}{`\u00A0${contextBudgetCurrency}`}</TableCell>
                <TableCell align='center' sx={{ color: currentResultsFontColor }}>{row.current_funds_left}{`\u00A0${contextBudgetCurrency}`}</TableCell>
                <TableCell align='center'>
                    <Stack gap={1} sx={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <Typography variant="body2" color={currentResultsFontColor}>
                            {row.current_progress}&nbsp;%
                        </Typography>

                        <ColouredLinearProgress currentValue={row.current_result} maxValue={row.current_plan} />
                    </Stack>
                </TableCell>
                <TableCell>
                    <Typography padding={1} variant="body2" sx={{ whiteSpace: 'pre-wrap', textAlign: 'justify', maxWidth: 300 }}>
                        {row.description}
                    </Typography>
                </TableCell>
                <TableCell sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <IconButton
                    // onClick={handleEdit}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => setDeleteOpen(!deleteOpen)}>
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            <PredictionDeleteModal
                predictionId={row.id}
                deleteOpen={deleteOpen}
                setDeleteOpen={setDeleteOpen}
            />
        </>
    );
}
