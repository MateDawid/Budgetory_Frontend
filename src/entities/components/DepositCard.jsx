import {Box, Card, CardActions, CardHeader, Stack, Chip, Typography, Divider} from "@mui/material";
import PageviewIcon from '@mui/icons-material/Pageview';
import React, {useContext} from "react";
import {Link} from 'react-router-dom';
import StyledButton from "../../app_infrastructure/components/StyledButton";
import truncateText from "../../app_infrastructure/utils/truncateText";
import DeleteButton from "../../app_infrastructure/components/DeleteButton";
import {BudgetContext} from "../../app_infrastructure/components/BudgetContext";

/**
 * DepositCard component to display single Budget card on Budgets list.
 * @param {string} apiUrl - Base API url to be called with DELETE method.
 * @param {object} object - BudgetingPeriod object.
 * @param {function|null} setUpdatedObjectId - useState setter for refreshing objects list on object update.
 * @param {function|null} setDeletedObjectId - BudgetingPeriodList useState setter for refreshing BudgetingPeriod list on BudgetingPeriod removing.
 */
const DepositCard = ({apiUrl, object, setUpdatedObjectId, setDeletedObjectId}) => {
    const {contextBudgetCurrency} = useContext(BudgetContext);

    return (
        <Card variant="outlined" sx={{marginTop: 2, borderColor: "#D0D0D0"}}>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                    <CardHeader title={truncateText(object.name, 18)}/>
                    <Chip label={object.is_active ? "🟢 Active" : "🔴 Inactive"} variant="outlined" />
                </Stack>
                <Divider sx={{width: "100%", mb: 1, mt: 1}}/>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} width="50%">
                    <Typography fontSize={12} fontWeight="bold" color="secondary">Balance:</Typography>
                    <Typography fontSize={12} color="secondary">{object.balance} {contextBudgetCurrency}</Typography>
                </Stack>
                <Divider sx={{width: "100%", mb: 1, mt: 1}}/>
                <CardActions sx={{width: "100%"}}>
                    <Box sx={{width: "100%", display: "flex", justifyContent: 'space-around'}}>
                        <StyledButton component={Link} to={`/deposits/${object.id}`} variant="outlined" startIcon={<PageviewIcon/>}>
                            View
                        </StyledButton>
                        <DeleteButton apiUrl={apiUrl} objectId={object.id} objectDisplayName="Deposit" setDeletedObjectId={setDeletedObjectId}/>
                    </Box>
                </CardActions>
            </Box>
        </Card>
    )
}

export default DepositCard;