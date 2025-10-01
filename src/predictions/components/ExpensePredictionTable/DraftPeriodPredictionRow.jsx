import { TableRow, TableCell, Stack, Typography, IconButton, Collapse, Box } from "@mui/material";
import React, { useState, useContext } from "react";
import ColouredLinearProgress from "../../../app_infrastructure/components/CustomLinearProgress/ColouredLinearProgress";
import { BudgetContext } from "../../../app_infrastructure/store/BudgetContext";
import PeriodStatuses from "../../../budgets/utils/PeriodStatuses";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import { getFontColor } from './utils';
import PredictionDeleteModal from "./PredictionDeleteModal";

export default function DraftPeriodPredictionRow(props) {
    const { row, periodStatus } = props;
    const [collapseOpen, setCollapseOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const { contextBudgetCurrency } = useContext(BudgetContext);

    const fontColor = getFontColor(row.current_result, row.current_plan);

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell align='center'>{row.category_owner}</TableCell>
                <TableCell align='center'>{row.category_display}</TableCell>
                <TableCell align='center' sx={{ color: fontColor }}>{row.current_result}{`\u00A0${contextBudgetCurrency}`} / {row.current_plan}{`\u00A0${contextBudgetCurrency}`}</TableCell>
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
                <TableCell sx={{ display: "flex", justifyContent: "center" }}>
                    {periodStatus !== PeriodStatuses.CLOSED &&
                        <IconButton
                        // onClick={handleEdit}
                        ><EditIcon /></IconButton>
                    }
                    {periodStatus === PeriodStatuses.DRAFT &&
                        <IconButton
                            onClick={() => setDeleteOpen(!deleteOpen)}
                        >
                            <DeleteIcon /></IconButton>
                    }
                    {row.description &&
                        <IconButton
                            size="small"
                            onClick={() => setCollapseOpen(!collapseOpen)}
                        >
                            {collapseOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    }
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            {row.description}
                        </Box>
                    </Collapse>
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
