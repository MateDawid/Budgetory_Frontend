import React, {useContext, useEffect, useState} from 'react';
import Typography from "@mui/material/Typography";
import {Box, Paper, Stack} from "@mui/material";
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';
import {AlertContext} from "../../app_infrastructure/components/AlertContext";
import {BudgetContext} from "../../app_infrastructure/components/BudgetContext";
import {getApiObjectsList} from "../../app_infrastructure/services/APIService";
import BudgetingPeriodCard from "../components/BudgetingPeriodCard";
import BudgetingPeriodAddButton from "../components/BudgetingPeriodAddButton";


/**
 * BudgetingPeriodList component to display list of Budget BudgetingPeriods.
 */
export default function BudgetingPeriodList() {
    const {contextBudgetId} = useContext(BudgetContext);
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/periods/`
    const {alert, setAlert} = useContext(AlertContext);
    const [addedObjectId, setAddedObjectId] = useState(null);
    const [deletedObjectId, setDeletedObjectId] = useState(null);
    const [objects, setObjects] = useState([]);

    /**
     * Fetches Budgeting Periods list from API.
     */
    useEffect(() => {
        const loadData = async () => {
            try {
                const listResponse = await getApiObjectsList(apiUrl)
                setObjects(listResponse);
            } catch (err) {
                setAlert({type: 'error', message: "Failed to load Periods."});
            }
        }
        loadData();
    }, [contextBudgetId, addedObjectId, deletedObjectId]);

    return (
        <Paper elevation={24} sx={{
            padding: 2, bgColor: "#F1F1F1"
        }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1}>
                <Typography variant="h4"
                            sx={{display: 'block', color: '#BD0000'}}>Periods</Typography>
                <BudgetingPeriodAddButton apiUrl={apiUrl} setAddedObjectId={setAddedObjectId}/>
            </Stack>
            <Divider/>
            {alert && <Alert sx={{marginTop: 2, whiteSpace: 'pre-wrap'}} severity={alert.type}
                             onClose={() => setAlert(null)}>{alert.message}</Alert>}
            <Box sx={{display: "flex", flexWrap: 'wrap', justifyContent: 'flex-start'}}>
                {objects.map(object => (
                    <Box key={object.id} sx={{width: 330, m: 1}}>
                        <BudgetingPeriodCard apiUrl={apiUrl} object={object} setDeletedObjectId={setDeletedObjectId}/>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}