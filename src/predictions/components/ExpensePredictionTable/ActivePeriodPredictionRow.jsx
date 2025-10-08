import { TableRow, TableCell, Stack, Typography, IconButton, Tooltip } from "@mui/material";
import React, { useContext, useState } from "react";
import ColouredLinearProgress from "../../../app_infrastructure/components/CustomLinearProgress/ColouredLinearProgress";
import { BudgetContext } from "../../../app_infrastructure/store/BudgetContext";
import EditIcon from '@mui/icons-material/Edit';
import { getCategoryCellContent, getFontColor } from './utils';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PredictionEditModal from "./PredictionEditModal";

/**
 * DraftPeriodPredictionRow component to display ExpensePrediction data row with data suitable for ACTIVE Period.
 * @param {object} props
 * @param {object} props.row - Table row object.
 */
export default function ActivePeriodPredictionRow({ row }) {
    const [editOpen, setEditOpen] = useState(false);
    const { contextBudgetCurrency } = useContext(BudgetContext);

    const fontColor = getFontColor(row.current_result, row.current_plan);

    return (
        <>
            <TableRow>
                <TableCell align='center'>{row.category_owner}</TableCell>
                <TableCell align='center'>
                    {getCategoryCellContent(row)}
                </TableCell>
                <TableCell align='center'>
                    <Stack direction="row" spacing={1} display="flex" alignItems="center" justifyContent="center">
                        <Typography variant="body2" color={fontColor}>
                            {row.current_result}{`\u00A0${contextBudgetCurrency}`} / {row.current_plan}{`\u00A0${contextBudgetCurrency}`}
                        </Typography>
                        {row.current_plan !== row.initial_plan &&
                            <Tooltip title={`Initial prediction value: ${row.initial_plan}\u00A0${contextBudgetCurrency}`} placement="top">
                                <HelpOutlineIcon />
                            </Tooltip>
                        }
                    </Stack>
                </TableCell>
                <TableCell align='center' sx={{ color: fontColor }}>{row.current_funds_left}{`\u00A0${contextBudgetCurrency}`}</TableCell>
                <TableCell align='center'>
                    <Stack gap={1} sx={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <Typography variant="body2" color={fontColor}>
                            {row.current_progress}&nbsp;%
                        </Typography>

                        <ColouredLinearProgress currentValue={row.current_result} maxValue={row.current_plan} />
                    </Stack>
                </TableCell>
                <TableCell sx={{ maxWidth: 300 }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', textAlign: 'justify', width: "100%" }}>
                        {row.description}
                    </Typography>
                </TableCell>
                <TableCell align='right'>
                    <IconButton onClick={() => setEditOpen(!editOpen)}>
                        <EditIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            <PredictionEditModal
                prediction={row}
                editOpen={editOpen}
                setEditOpen={setEditOpen}
            />
        </>
    );
}
