import {getBudgetDetail, updateBudget} from "../services/BudgetService";
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import {Paper} from "@mui/material";
import Grid from '@mui/material/Grid2';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import EditableTextField from "../../app_infrastructure/components/EditableTextField";

/**
 * BudgetDetail component to display single Budget page.
 */
export default function BudgetDetail() {
    const {budgetId} = useParams();
    const [error, setError] = useState(null);
    const [budget, setBudget] = useState({})

    /**
     * useEffect fetching Budget object.
     */
    useEffect(() => {
        const loadBudget = async () => {
            try {
                const apiResponse = await getBudgetDetail(budgetId);
                setBudget(apiResponse);
            } catch (err) {
                setError("Budget loading failed.");
            }
        }
        loadBudget()
    }, []);


    /**
     * Function for saving Budget on save icon click.
     * @param {string} apiFieldName - Name of API field to be updated.
     * @param {object} newValue - New value for updated field.
     */
    const saveBudget = async (apiFieldName, newValue) => {
        const updateResponse = await updateBudget(budgetId, apiFieldName, newValue)
        setBudget(updateResponse)
    }

    return (
        <>
            <Paper elevation={24} sx={{
                padding: 2, bgColor: "#F1F1F1", width: '100%', maxWidth: '100%'
            }}>
                        <Typography variant="h4" gutterBottom
                                    sx={{display: 'block', color: '#BD0000'}}>Budget detail</Typography>
                        <Divider/>
                {error ? (
                    <Alert sx={{marginTop: 2}} severity="error">{error}</Alert>
                ) : (
                    <Box sx={{flexGrow: 1, padding: 2, width: '100%'}}>
                            <Grid container spacing={2} sx={{minWidth: '250px'}}>
                                <Grid size={{mobile: 6, tablet: 4, laptop: 4}}>
                                    <EditableTextField
                                        label="Name"
                                        initialValue={budget.name}
                                        apiFieldName="name"
                                        onSave={saveBudget}
                                        id="name"
                                        name="name"
                                        size="small"
                                        autoComplete="off"
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <EditableTextField
                                        label="Description"
                                        initialValue={budget.description}
                                        apiFieldName="description"
                                        onSave={saveBudget}
                                        id="description"
                                        name="description"
                                        size="small"
                                        multiline
                                        minRows={4}
                                        autoComplete="off"
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid size={{mobile: 6, tablet: 4, laptop: 4}}>
                                    <EditableTextField
                                        label="Currency"
                                        initialValue={budget.currency}
                                        apiFieldName="currency"
                                        onSave={saveBudget}
                                        id="currency"
                                        name="currency"
                                        size="small"
                                        autoComplete="off"
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                )}
            </Paper>
        </>)
        ;
}
