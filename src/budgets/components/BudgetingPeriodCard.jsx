import {Box, Card, CardActions, CardHeader, Typography, Stack} from "@mui/material";
import PageviewIcon from '@mui/icons-material/Pageview';
import React from "react";
import {Link} from 'react-router-dom';
import StyledButton from "../../app_infrastructure/components/StyledButton";
import truncateText from "../../app_infrastructure/utils/truncateText";
import DeleteButton from "../../app_infrastructure/components/DeleteButton";
import PeriodStatuses from "../utils/PeriodStatuses";
import BudgetingPeriodStatusUpdateButton from "./BudgetingPeriodStatusUpdateButton";

/**
 * BudgetCard component to display single Budget card on Budgets list.
 * @param {string} apiUrl - Base API url to be called with DELETE method.
 * @param {object} object - BudgetingPeriod object.
 * @param {function|null} setUpdatedObjectId - useState setter for refreshing objects list on object update.
 * @param {function|null} setDeletedObjectId - BudgetingPeriodList useState setter for refreshing BudgetingPeriod list on BudgetingPeriod removing.
 */
const BudgetingPeriodCard = ({apiUrl, object, setUpdatedObjectId, setDeletedObjectId}) => {
    return (
        <Card variant="outlined" sx={{marginTop: 2, borderColor: "#D0D0D0"}}>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1}>
                    <CardHeader title={truncateText(object.name, 18)}/>
                    <Typography>{object.status_display}</Typography>
                </Stack>
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