import { Card, Collapse, CardContent, Typography, IconButton, Grid } from "@mui/material"
import React, { useContext, useState } from "react";
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PercentageProgressWithLabel } from "./PercentageProgressWithLabel";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import { BudgetContext } from "../../app_infrastructure/components/BudgetContext";
import PeriodStatuses from "../utils/PeriodStatuses";
import { deleteApiObject } from "../../app_infrastructure/services/APIService";

const ExpandMoreButton = styled((props) => {
    const { expand, ...other } = props; // eslint-disable-line no-unused-vars
    return <IconButton {...other} />;
})(({ theme }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
    variants: [
        {
            props: ({ expand }) => !expand,
            style: {
                transform: 'rotate(0deg)',
            },
        },
        {
            props: ({ expand }) => !!expand,
            style: {
                transform: 'rotate(180deg)',
            },
        },
    ],
}));

export const ExpensePredictionCardComponent = ({ prediction, periodStatus, setUpdatedObject, setAlert }) => {
    const { contextBudgetId, contextBudgetCurrency } = useContext(BudgetContext);
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/expense_predictions/`
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleDelete = async () => {
        try {
            await deleteApiObject(apiUrl, prediction.id);
            setUpdatedObject(`${prediction.id}_delete`)
        } catch (error) {
            console.error(error)
            setAlert({ type: 'error', message: error.message });
        }
    };

    const handleEdit = () => {
        setExpanded(!expanded);
    };

    return (
        <Card variant="outlined" sx={{ marginTop: 2, borderColor: "#D0D0D0" }}>
            <Grid container spacing={2} mt={1} mb={1} ml={2} mr={2} sx={{
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <Grid size={1} display="flex" justifyContent="left" alignItems="center">
                    <Typography>{prediction.category_owner}</Typography>
                </Grid>
                <Grid size={2} display="flex" justifyContent="left" alignItems="center">
                    <Typography>{prediction.category_display}</Typography>
                </Grid>
                <Grid size={5} display="flex" justifyContent="center" alignItems="center">
                    <Table
                        size="small"
                        sx={{
                            border: '1px solid #D0D0D0',
                            '& th, & td': {
                                border: '1px solid #D0D0D0'
                            }
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                {periodStatus === PeriodStatuses.DRAFT && <TableCell align="center" sx={{ width: '33.33%' }}><b>Previous result</b></TableCell>}
                                {periodStatus !== PeriodStatuses.DRAFT && <TableCell align="center" sx={{ width: '33.33%' }}><b>Initial plan</b></TableCell>}
                                <TableCell align="center" sx={{ width: '33.33%' }}><b>Current plan</b></TableCell>
                                <TableCell align="center" sx={{ width: '33.33%' }}><b>Result</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                {periodStatus === PeriodStatuses.DRAFT && <TableCell align="center">{prediction.previous_result}&nbsp;{contextBudgetCurrency}</TableCell>}
                                {periodStatus !== PeriodStatuses.DRAFT && <TableCell align="center">{prediction.initial_plan}&nbsp;{contextBudgetCurrency}</TableCell>}
                                <TableCell align="center">{prediction.current_plan}&nbsp;{contextBudgetCurrency}</TableCell>
                                <TableCell align="center">{prediction.current_result}&nbsp;{contextBudgetCurrency}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Grid>
                <Grid size={2} display="flex" justifyContent="center" alignItems="center">
                    <PercentageProgressWithLabel currentValue={prediction.current_result} maxValue={prediction.current_plan} />
                </Grid>
                <Grid size={1} display="flex" justifyContent="right" alignItems="center">
                    {prediction.description &&
                        <ExpandMoreButton expand={expanded} onClick={handleExpandClick}>
                            <ExpandMoreIcon />
                        </ExpandMoreButton>}
                    {periodStatus !== PeriodStatuses.CLOSED &&
                        <>
                            <IconButton onClick={handleEdit}><EditIcon /></IconButton>
                            <IconButton onClick={handleDelete}><DeleteIcon /></IconButton>
                        </>
                    }
                </Grid>
            </Grid>

            <Collapse in={expanded} timeout="auto" unmountOnExit sx={{ border: "#D0D0D0" }}>
                <CardContent>
                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>{prediction.description}</Typography>
                </CardContent>
            </Collapse>
        </Card >
    )
}