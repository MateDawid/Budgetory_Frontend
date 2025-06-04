import {Box, Card, CardActions, CardHeader, Stack, Chip, Typography, Divider} from "@mui/material";
import PageviewIcon from '@mui/icons-material/Pageview';
import React, {useContext} from "react";
import {Link} from 'react-router-dom';
import StyledButton from "../../app_infrastructure/components/StyledButton";
import truncateText from "../../app_infrastructure/utils/truncateText";
import DeleteButton from "../../app_infrastructure/components/DeleteButton";
import {BudgetContext} from "../../app_infrastructure/components/BudgetContext";

/**
 * DepositCard component to display single Deposit card on Budgets list.
 * @param {string} apiUrl - Base API url to be called with DELETE method.
 * @param {object} object - Deposit object.
 * @param {function|null} setDeletedObjectId - DepositList useState setter for refreshing Deposit list on Deposit removing.
 */
const DepositCard = ({apiUrl, object, setDeletedObjectId}) => {
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
                        <DeleteButton apiUrl={apiUrl} objectId={object.id} objectDisplayName="Deposit" setDeletedObjectId={setDeletedObjectId} rightbarDepositsRefresh/>
                    </Box>
                </CardActions>
            </Box>
        </Card>
    )
}

export default DepositCard;