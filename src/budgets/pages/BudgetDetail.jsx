import {getBudgetDetail} from "../services/BudgetService";
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import {InputLabel, Paper, TextField} from "@mui/material";
import Grid from '@mui/material/Grid2';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

/**
 * BudgetList component to display list of User Budgets.
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

    console.log(budget)

    return (
        <>
            <Paper elevation={24} sx={{
                padding: 2, bgColor: "#F1F1F1", width: '100%', maxWidth: '100%'
            }}>
                {error ? (
                    <Alert sx={{marginTop: 2}} severity="error">{error}</Alert>
                ) : (
                    <>
                        <Typography variant="h4" gutterBottom
                                    sx={{display: 'block', color: '#BD0000'}}>Budget detail</Typography>
                        <Divider/>
                        <Box sx={{flexGrow: 1, padding: 2, width: '100%'}}>
                            <Grid container spacing={2}>
                                <Grid size={4}>
                                    <InputLabel sx={{display: "flex", fontWeight: 700,}}>Name</InputLabel>
                                    <TextField
                                        disabled={true} // use variable
                                        autoFocus={false} // use variable
                                        id="name"
                                        name="name"
                                        size="small"
                                        autoComplete="off"
                                        variant="outlined"
                                        fullWidth
                                        value={budget.name}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <InputLabel sx={{display: "flex", fontWeight: 700,}}>
                                        Description
                                    </InputLabel>
                                    <TextField
                                        disabled={true} // use variable
                                        autoFocus={false} // use variable
                                        id="description"
                                        name="description"
                                        size="small"
                                        multiline
                                        rows={4}
                                        autoComplete="off"
                                        variant="outlined"
                                        fullWidth
                                        value={budget.description}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <InputLabel sx={{display: "flex", fontWeight: 700,}}>
                                        Currency
                                    </InputLabel>
                                    <TextField
                                        disabled={true} // use variable
                                        autoFocus={false} // use variable
                                        id="currency"
                                        name="currency"
                                        size="small"
                                        autoComplete="off"
                                        variant="outlined"
                                        fullWidth
                                        value={budget.currency}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </>
                )}
            </Paper>
        </>)
        ;
}
