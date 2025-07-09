import { Card, Collapse, CardContent, Typography, IconButton, Grid } from "@mui/material"
import React, { useContext, useState } from "react";
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PercentageProgressWithLabel } from "./PercentageProgressWithLabel";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import { BudgetContext } from "../../app_infrastructure/store/BudgetContext";
import PeriodStatuses from "../utils/PeriodStatuses";
import { deleteApiObject, updateApiObject } from "../../app_infrastructure/services/APIService";
import FormModal from "../../app_infrastructure/components/FormModal/FormModal";

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

/**
 * Component to display single Expense Prediction Card.
 * @param {object} prediction - Expense Prediction data.
 * @param {string} periodStatus - Status of Period.
 * @param {function} setAlert - Function to set Alerts.
 * @param {object} updateFields - Form fields for Expense Prediction update form.
 */
export const ExpensePredictionCardComponent = ({ prediction, periodStatus, setAlert, updateFields }) => {
    const { contextBudgetId, contextBudgetCurrency, setObjectChange } = useContext(BudgetContext);
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
            setObjectChange({ operation: 'delete', objectId: prediction.id, objectType: 'Expense prediction' })
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
                    <Grid size={1}>
                        {periodStatus === PeriodStatuses.DRAFT &&
                            <>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Previous result</Typography>
                                <Typography>{prediction.previous_result}&nbsp;{contextBudgetCurrency}</Typography>
                            </>
                        }
                        {periodStatus !== PeriodStatuses.DRAFT &&
                            <>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Initial plan</Typography>
                                <Typography>{prediction.initial_plan}&nbsp;{contextBudgetCurrency}</Typography>
                            </>
                        }
                    </Grid>
                    <Grid size={1}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Current plan</Typography>
                        <Typography>{prediction.previous_result}&nbsp;{contextBudgetCurrency}</Typography>
                    </Grid>
                    <Grid size={1}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Result</Typography>
                        <Typography>{prediction.previous_result}&nbsp;{contextBudgetCurrency}</Typography>
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
                            <IconButton onClick={handleEdit}><EditIcon /></IconButton>
                        }
                        {periodStatus === PeriodStatuses.DRAFT &&
                            <IconButton onClick={handleDelete}><DeleteIcon /></IconButton>
                        }
                    </Grid>
                </Grid>

                <Collapse in={expanded} timeout="auto" unmountOnExit sx={{ border: "#D0D0D0" }}>
                    <CardContent>
                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>{prediction.description}</Typography>
                    </CardContent>
                </Collapse>
            </Card >
            <FormModal
                fields={updateFields}
                objectType={"Expense Prediction - Edit"}
                operation={'update'}
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