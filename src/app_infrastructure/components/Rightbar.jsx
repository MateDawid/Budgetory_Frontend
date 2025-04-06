import * as React from "react";
import {Box, Card, List, Divider} from "@mui/material";
import RightbarItem from "./RightbarItem"
import BudgetSelector from "./BudgetSelector";

/**
 * Rightbar component to display BudgetSelector and Deposits balances on right side of screen
 */
const Rightbar = () => {
    return (
        <Box width={240} sx={{display: {xs: "none", sm: "none", md: "block"}}}>
            <Box position="fixed" width={240} pt={2} display="flex" justifyContent="center">
                <Card>
                    <Box width={220} display="flex" flexDirection="column" alignItems="center" pt={2}>
                        <BudgetSelector />
                        <Divider variant="middle" />
                        <List sx={{width: "100%"}}>
                            <RightbarItem deposit={{name: "Deposit 1", balance: "123 $"}}/>
                            <RightbarItem deposit={{name: "Deposit 2", balance: "345 $"}}/>
                        </List>
                    </Box>
                </Card>

            </Box>
        </Box>
    )
}

export default Rightbar;