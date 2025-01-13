import React, {useContext} from "react";
import Divider from "@mui/material/Divider";
import {InputLabel, Paper, TextField} from "@mui/material";
import Grid from '@mui/material/Grid2';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useForm} from "react-hook-form";
import Alert from "@mui/material/Alert";
import {createBudget} from "../services/BudgetService";
import {AlertContext} from "../../app_infrastructure/components/AlertContext";
import {useNavigate} from "react-router-dom";

/**
 * BudgetAdd component for new Budget create form.
 */
export default function BudgetAdd() {
    const {register, handleSubmit, setError, formState: {errors}} = useForm();
    const navigate = useNavigate();
    const {setAlert} = useContext(AlertContext);

    /**
     * Handles form submission.
     * Calls API to create Budget with given data.
     * @param {Object} data - Form data.
     */
    const onSubmit = async (data) => {
        const response = await createBudget(data);
        if (response.errorOccurred) {
            if ("serverError" in response.detail) {
                setError('serverError', {message: response.detail.serverError.join(', ')})
            } else {
                Object.entries(response.detail).forEach(([apiFieldName, errorValue]) => {
                    setError(apiFieldName, {message: errorValue.join(', ')})
                });
            }
        } else {
            setAlert({ type: 'success', message: `Budget "${response.name}" was created.`})
            navigate('/budgets');
        }
    };

    return (
        <>
            <Paper elevation={24} sx={{
                padding: 2, bgColor: "#F1F1F1", width: '100%', maxWidth: '100%'
            }}>
                <Typography variant="h4" gutterBottom
                            sx={{display: 'block', color: '#BD0000'}}>New Budget</Typography>
                <Divider/>
                {errors.serverError && <Alert sx={{marginTop: 2}} severity="error">{errors.serverError.message}</Alert>}
                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{flexGrow: 1, padding: 2, width: '100%'}}>
                    <Grid container spacing={2} sx={{minWidth: '250px'}}>
                        <Grid size={{mobile: 6, tablet: 4, laptop: 4}}>
                            <InputLabel sx={{display: "flex", fontWeight: 700,}}>
                                Name
                            </InputLabel>
                            <TextField
                                id="name"
                                name="name"
                                {...register('name')}
                                size="small"
                                autoComplete="off"
                                variant="outlined"
                                error={!!errors.name}
                                helperText={errors.name ? errors.name.message : ''}
                                fullWidth
                            />
                        </Grid>
                        <Grid size={12}>
                            <InputLabel sx={{display: "flex", fontWeight: 700,}}>
                                Description
                            </InputLabel>
                            <TextField
                                id="description"
                                name="description"
                                {...register('description')}
                                size="small"
                                multiline
                                minRows={4}
                                autoComplete="off"
                                variant="outlined"
                                error={!!errors.description}
                                helperText={errors.description ? errors.description.message : ''}
                                fullWidth
                            />
                        </Grid>
                        <Grid size={{mobile: 6, tablet: 4, laptop: 4}}>
                            <InputLabel sx={{display: "flex", fontWeight: 700,}}>
                                Currency
                            </InputLabel>
                            <TextField
                                id="currency"
                                name="currency"
                                {...register('currency')}
                                size="small"
                                autoComplete="off"
                                variant="outlined"
                                error={!!errors.currency}
                                helperText={errors.currency ? errors.currency.message : ''}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{minWidth: '250px'}}>
                        <Grid size={{mobile: 6, tablet: 4, laptop: 4}}>
                            <Button type="submit" variant="contained" fullWidth sx={{mt: 1, bgcolor: "#BD0000"}}>
                                Add Budget
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </>)
        ;
}
