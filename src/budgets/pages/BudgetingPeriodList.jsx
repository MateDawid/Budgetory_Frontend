import React, {useContext, useEffect, useState} from 'react';
import Typography from "@mui/material/Typography";
import {Box, Paper, Stack} from "@mui/material";
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';
import {AlertContext} from "../../app_infrastructure/store/AlertContext";
import {BudgetContext} from "../../app_infrastructure/store/BudgetContext";
import {getApiObjectsList} from "../../app_infrastructure/services/APIService";
import BudgetingPeriodCard from "../components/BudgetingPeriodCard";
import CreateButton from "../../app_infrastructure/components/CreateButton";


/**
 * BudgetingPeriodList component to display list of Budget BudgetingPeriods.
 */
export default function BudgetingPeriodList() {
    const {contextBudgetId, refreshTimestamp} = useContext(BudgetContext);
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/periods/`
    const {alert, setAlert} = useContext(AlertContext);
    const [updatedObjectId, setUpdatedObjectId] = useState(null);
    const [deletedObjectId, setDeletedObjectId] = useState(null);
    const [objects, setObjects] = useState([]);
    const createFields = {
        name: {
            type: 'string',
            label: 'Name',
            autoFocus: true,
            required: true
        },
        date_start: {
            type: 'date',
            label: 'Date start',
            required: true,
        },
        date_end: {
            type: 'date',
            label: 'Date end',
            required: true,
        }
    }

    /**
     * Fetches Budgeting Periods list from API.
     */
    useEffect(() => {
        const loadData = async () => {
            if (!contextBudgetId) {
                return
            }
            try {
                const listResponse = await getApiObjectsList(apiUrl,{}, {ordering: '-date_start'})
                setObjects(listResponse);
            } catch (err) {
                setAlert({type: 'error', message: "Failed to load Periods."});
            }
        }
        loadData();
    }, [contextBudgetId, refreshTimestamp, updatedObjectId, deletedObjectId]);

    return (
        <Paper elevation={24} sx={{
            padding: 2, bgColor: "#F1F1F1"
        }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1}>
                <Typography variant="h4"
                            sx={{display: 'block', color: '#BD0000'}}>Periods</Typography>
                <CreateButton fields={createFields} objectType={"Budgeting Period"} apiUrl={apiUrl}/>
            </Stack>
            <Divider/>
            {alert && <Alert sx={{marginTop: 2, whiteSpace: 'pre-wrap'}} severity={alert.type}
                             onClose={() => setAlert(null)}>{alert.message}</Alert>}
            <Box sx={{display: "flex", flexWrap: 'wrap', justifyContent: 'flex-start'}}>
                {objects.map(object => (
                    <Box key={object.id} sx={{width: 330, m: 1}}>
                        <BudgetingPeriodCard
                            apiUrl={apiUrl}
                            object={object}
                            setUpdatedObjectId={setUpdatedObjectId}
                            setDeletedObjectId={setDeletedObjectId}
                        />
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}