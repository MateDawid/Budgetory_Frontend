import { Card, Collapse, Typography, IconButton, Grid, Divider, Tooltip, Stack } from "@mui/material"
import React, { useContext, useState } from "react";
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import { BudgetContext } from "../../app_infrastructure/store/BudgetContext";
import PeriodStatuses from "../utils/PeriodStatuses";
import { deleteApiObject, updateApiObject } from "../../app_infrastructure/services/APIService";
import FormModal from "../../app_infrastructure/components/FormModal/FormModal";
import NumericProgressWithLabel from "../../app_infrastructure/components/CustomLinearProgress/NumericProgressWithLabel";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const MESSAGES = {
    CURRENT_PREDICTION_RESULT: 'Expenses for current Period in Category / Expense Prediction for current Period in Category.',
    PREVIOUS_PREDICTION_RESULT: 'Expenses for previous Period in Category / Expense Prediction for previous Period in Category.',
    NO_DESCRIPTION_PROVIDED: 'No description provided.',
    INITIAL_PLAN_UNCHANGED: 'Current prediction the same as planned initially. Current prediction: {current_plan}\u00A0{currency}.',
    INITIAL_PLAN_CHANGED: 'Prediction changed during Period. Current prediction: {current_plan}\u00A0{currency}.',
}

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

const TypographyWithTooltip = ({ value }) => {
    return (
        <Tooltip title={value} placement="top">
            <Typography
                sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%',
                }}
            >
                {value}
            </Typography>
        </Tooltip>
    )
}

/**
 * Component to display single Expense Prediction Card.
 * @param {object} prediction - Expense Prediction data.
 * @param {string} periodStatus - Status of Period.
 * @param {function} setAlert - Function to set Alerts.
 * @param {object} updateFields - Form fields for Expense Prediction update form.
 */
export const ExpensePredictionCardComponent = ({ prediction, periodStatus, setAlert, updateFields }) => {
    const { contextBudgetId, contextBudgetCurrency, updateRefreshTimestamp } = useContext(BudgetContext);
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/expense_predictions/`
    const [expanded, setExpanded] = useState(false);
    const [editFormOpen, setEditFormOpen] = useState(false)

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    /**
    * Function to handle deleting object in API.
    */
    const handleDelete = async () => {
        try {
            await deleteApiObject(apiUrl, prediction.id);
            updateRefreshTimestamp()
        } catch (error) {
            console.error(error)
            setAlert({ type: 'error', message: error.message });
        }
    };

    const handleEdit = () => {
        setEditFormOpen(!editFormOpen);
    };

    /**
    * Function to handle editing object in API.
    * @param {object} data - Data collected from Edit form.
    * @returns {Promise<object>} - API response.
    */
    const callApiOnEdit = async (data) => {
        delete data.category
        data['id'] = prediction.id
        const updateResponse = await updateApiObject(apiUrl, data);
        setAlert({ type: 'success', message: `Object updated successfully.` })
        return updateResponse
    }

    return (
        <>
            <Card variant="outlined" sx={{ marginTop: 2, background: "#F1F1F1" }}>
                <Grid container spacing={2} mt={1} mb={1} ml={2} mr={2} sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    <Grid size={2} display="flex" justifyContent="center" alignItems="center">
                        <Stack width="100%" alignItems="center" justifyContent="center" spacing={1} mb={1}>
                            <Typography fontSize={14} fontWeight="bold" color="secondary">Category owner</Typography>
                            <TypographyWithTooltip value={prediction.category_owner} />
                        </Stack>
                    </Grid>
                    <Divider orientation="vertical" flexItem />
                    <Grid size={2} display="flex" justifyContent="left" alignItems="center">
                        <Stack width="100%" alignItems="center" justifyContent="center" spacing={1} mb={1}>
                            <Typography fontSize={14} fontWeight="bold" color="secondary">Category</Typography>
                            <TypographyWithTooltip value={prediction.category_display} />
                        </Stack>
                    </Grid>
                    <Divider orientation="vertical" flexItem />
                    <Grid size={4} display="flex" justifyContent="center" alignItems="center" alignContent="center">
                        <Stack width="100%" alignItems="center" justifyContent="center" spacing={1} mb={1}>
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mb={1}>
                                <Tooltip title={MESSAGES.CURRENT_PREDICTION_RESULT} placement="top">
                                    <HelpOutlineIcon />
                                </Tooltip>
                                <Typography fontSize={14} fontWeight="bold" color="secondary">Current result</Typography>
                            </Stack>
                            <NumericProgressWithLabel currentValue={prediction.current_result} maxValue={prediction.current_plan} withCurrency />
                        </Stack>
                    </Grid>
                    <Divider orientation="vertical" flexItem />
                    <Grid size={1} display="flex" justifyContent="right" alignItems="center">
                        {periodStatus !== PeriodStatuses.CLOSED &&
                            <IconButton onClick={handleEdit}><EditIcon /></IconButton>
                        }
                        {periodStatus === PeriodStatuses.DRAFT &&
                            <IconButton onClick={handleDelete}><DeleteIcon /></IconButton>
                        }
                        <ExpandMoreButton expand={expanded} onClick={handleExpandClick}>
                            <ExpandMoreIcon />
                        </ExpandMoreButton>
                    </Grid>
                </Grid>
                <Collapse in={expanded} timeout="auto" unmountOnExit sx={{ border: "#3E3E3E", background: "#fff" }}>
                    <Divider orientation="horizontal" flexItem />
                    <Grid container spacing={2} mt={1} mb={1} ml={2} mr={2} sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        <Grid size={5}>
                            <Stack width="100%" alignItems="center" justifyContent="center" spacing={1} mb={1}>
                                <Typography fontSize={14} fontWeight="bold" color="secondary">Description</Typography>
                                <Typography sx={{ whiteSpace: 'pre-wrap', width: "100%" }}>
                                    {prediction.description ? prediction.description : MESSAGES.NO_DESCRIPTION_PROVIDED}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Divider orientation="vertical" flexItem />
                        <Grid size={4}>
                            <Stack width="100%" alignItems="center" justifyContent="center" spacing={1} mb={1}>
                                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mb={1}>
                                    <Tooltip title={MESSAGES.PREVIOUS_PREDICTION_RESULT} placement="top">
                                        <HelpOutlineIcon />
                                    </Tooltip>
                                    <Typography fontSize={14} fontWeight="bold" color="secondary">Previous result</Typography>
                                </Stack>
                                <NumericProgressWithLabel currentValue={prediction.previous_result} maxValue={prediction.previous_plan} withCurrency />
                            </Stack>
                        </Grid>
                        <Divider orientation="vertical" flexItem />
                        <Grid size={1} display="flex">
                            <Stack alignItems="center" justifyContent="center" spacing={1} mb={1}>
                                <Typography fontSize={14} fontWeight="bold" color="secondary">Initial plan</Typography>
                                <Tooltip
                                    title={
                                        prediction.initial_plan !== prediction.current_plan ? 
                                        MESSAGES.INITIAL_PLAN_CHANGED.replace("{current_plan}", prediction.current_plan).replace('{currency}', contextBudgetCurrency) : 
                                        MESSAGES.INITIAL_PLAN_UNCHANGED.replace("{current_plan}", prediction.current_plan).replace('{currency}', contextBudgetCurrency)
                                    }
                                    placement="top"
                                >
                                    <Typography sx={{ whiteSpace: 'pre-wrap' }} fontWeight={prediction.initial_plan !== prediction.current_plan ? 'bold' : 'normal'}>
                                        {prediction.initial_plan}&nbsp;{contextBudgetCurrency}
                                    </Typography>
                                </Tooltip>
                            </Stack>
                        </Grid>
                    </Grid>
                </Collapse>
            </Card >
            <FormModal
                fields={updateFields}
                objectType={"Expense Prediction - Edit"}
                open={editFormOpen}
                setOpen={setEditFormOpen}
                callApi={callApiOnEdit}
                setAlert={setAlert}
                updatedObject={prediction}
                disabledFields={['category']}
            />
        </>

    )
}