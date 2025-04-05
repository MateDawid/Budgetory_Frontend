import * as React from "react";
import {Box, Card, List, Divider} from "@mui/material";
import RightbarItem from "./RightbarItem"
import BudgetSelector from "./BudgetSelector";

/**
 * Rightbar component to display BudgetSelector and Deposits balances on right side of screen
 */
const Rightbar = () => {
    return (
        <Box flex={1} sx={{display: {xs: "none", sm: "none", md: "block"}}}>
            <Box position="fixed" width="240px" p={2}>
                <Card p={2}>
                    <BudgetSelector />
                    <Divider variant="middle" />
                    <List>
                        <RightbarItem deposit={{name: "Deposit 1", balance: "123 $"}}/>
                        <RightbarItem deposit={{name: "Deposit 2", balance: "345 $"}}/>
                    </List>
                </Card>

            </Box>
        </Box>
    )
}

export default Rightbar;