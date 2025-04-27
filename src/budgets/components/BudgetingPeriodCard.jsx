import {Box, Card, CardActions, CardHeader, Stack, Chip, Typography, Divider} from "@mui/material";
import PageviewIcon from '@mui/icons-material/Pageview';
import React, {useContext} from "react";
import {Link} from 'react-router-dom';
import StyledButton from "../../app_infrastructure/components/StyledButton";
import truncateText from "../../app_infrastructure/utils/truncateText";
import DeleteButton from "../../app_infrastructure/components/DeleteButton";
import PeriodStatuses from "../utils/PeriodStatuses";
import BudgetingPeriodStatusUpdateButton from "./BudgetingPeriodStatusUpdateButton";
import {BudgetContext} from "../../app_infrastructure/components/BudgetContext";

/**
 * BudgetCard component to display single Budget card on Budgets list.
 * @param {string} apiUrl - Base API url to be called with DELETE method.
 * @param {object} object - BudgetingPeriod object.
 * @param {function|null} setUpdatedObjectId - useState setter for refreshing objects list on object update.
 * @param {function|null} setDeletedObjectId - BudgetingPeriodList useState setter for refreshing BudgetingPeriod list on BudgetingPeriod removing.
 */
const BudgetingPeriodCard = ({apiUrl, object, setUpdatedObjectId, setDeletedObjectId}) => {
    const {contextBudgetCurrency} = useContext(BudgetContext);

    return (
        <Card variant="outlined" sx={{marginTop: 2, borderColor: "#D0D0D0"}}>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                    <CardHeader title={truncateText(object.name, 18)}/>
                    <Chip label={object.status_display} variant="outlined" />
                </Stack>
                <Divider sx={{width: "100%", mb: 1, mt: 1}}/>
                <Typography fontSize={12} color="primary">{object.date_start} - {object.date_end}</Typography>
                <Divider sx={{width: "100%", mb: 1, mt: 1}}/>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} width="90%">
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} width="50%">
                        <Typography fontSize={12} fontWeight="bold" color="secondary">Incomes:</Typography>
                        <Typography fontSize={12} color="secondary">{object.incomes_sum} {contextBudgetCurrency}</Typography>
                    </Stack>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} width="50%">
                        <Typography fontSize={12} fontWeight="bold" color="secondary">Expenses:</Typography>
                        <Typography fontSize={12} color="secondary">{object.expenses_sum} {contextBudgetCurrency}</Typography>
                    </Stack>
                </Stack>
                <Divider sx={{width: "100%", mb: 1, mt: 1}}/>
                <CardActions sx={{width: "100%"}}>
                    <Box sx={{width: "100%", display: "flex", justifyContent: 'space-around'}}>
                        {object.status === PeriodStatuses.DRAFT && (
                            <BudgetingPeriodStatusUpdateButton
                                apiUrl={apiUrl}
                                objectId={object.id}
                                newPeriodStatus={PeriodStatuses.ACTIVE}
                                objectName={object.name}
                                setUpdatedObjectId={setUpdatedObjectId}
                            />
                        )}
                        {object.status === PeriodStatuses.ACTIVE && (
                            <BudgetingPeriodStatusUpdateButton
                                apiUrl={apiUrl}
                                objectId={object.id}
                                newPeriodStatus={PeriodStatuses.CLOSED}
                                objectName={object.name}
                                setUpdatedObjectId={setUpdatedObjectId}
                            />
                        )}
                        <StyledButton component={Link} to={`/periods/${object.id}`} variant="outlined" startIcon={<PageviewIcon/>}>
                            View
                        </StyledButton>
                        <DeleteButton apiUrl={apiUrl} objectId={object.id} objectDisplayName="Period" setDeletedObjectId={setDeletedObjectId} isDisabled={object.status !== 1}/>
                    </Box>
                </CardActions>
            </Box>
        </Card>
    )
}

export default BudgetingPeriodCard;