import {Box, Card, CardActions, CardHeader} from "@mui/material";
import PageviewIcon from '@mui/icons-material/Pageview';
import React from "react";
import {Link} from 'react-router-dom';
import StyledButton from "../../app_infrastructure/components/StyledButton";
import BudgetDeleteButton from "../pages/BudgetDeleteButton";

/**
 * Truncate text if it exceeds a certain length.
 */
const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
};

/**
 * BudgetCard component to display single Budget card on Budgets list.
 */
const BudgetCard = ({budget, setDeletedBudgetId}) => {

    return (
        <Card variant="outlined" sx={{marginTop: 2, borderColor: "#D0D0D0"}}>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <CardHeader title={truncateText(budget.name, 18)}/>
                <CardActions sx={{width: "100%"}}>
                    <Box sx={{width: "100%", display: "flex", justifyContent: 'space-around'}}>
                        <StyledButton component={Link} to={`/budgets/${budget.id}`} variant="outlined" startIcon={<PageviewIcon/>}>
                            View
                        </StyledButton>
                        <BudgetDeleteButton budgetId={budget.id} setDeletedBudgetId={setDeletedBudgetId}/>
                    </Box>
                </CardActions>
            </Box>
        </Card>
    )
}

export default BudgetCard;