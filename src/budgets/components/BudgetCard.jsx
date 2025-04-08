import {Box, Button, Card, CardActions, CardHeader} from "@mui/material";
import PageviewIcon from '@mui/icons-material/Pageview';
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import {styled} from "@mui/material/styles";
import {Link} from 'react-router-dom';

/**
 * Truncate text if it exceeds a certain length.
 */
const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
};

const StyledButton = styled(Button)({
    backgroundColor: "#FFFFFF",
    color: "#BD0000",
    borderColor: "#BD0000",
    '&:hover': {
        backgroundColor: "#BD0000",
        color: "#FFFFFF",
        borderColor: "#FFFFFF"
    },
})

/**
 * BudgetCard component to display single Budget card on Budgets list.
 */
const BudgetCard = ({budget}) => {

    return (
        <Card variant="outlined" sx={{marginTop: 2, borderColor: "#D0D0D0"}}>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <CardHeader title={truncateText(budget.name, 18)}/>
                <CardActions sx={{width: "100%"}}>
                    <Box sx={{width: "100%", display: "flex", justifyContent: 'space-around'}}>
                        <StyledButton component={Link} to={`/budgets/${budget.id}`} variant="outlined" startIcon={<PageviewIcon/>}>
                            View
                        </StyledButton>
                        {/*TODO: Popup on delete click like in DataTable*/}
                        <StyledButton component={Link} to={`/budgets/${budget.id}/delete`} variant="outlined" startIcon={<DeleteIcon/>}>
                            Delete
                        </StyledButton>
                    </Box>
                </CardActions>
            </Box>
        </Card>
    )
}

export default BudgetCard;