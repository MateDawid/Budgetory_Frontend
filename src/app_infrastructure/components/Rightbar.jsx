import * as React from "react";
import {Box, Card, List, Divider} from "@mui/material";
import RightbarItem from "./RightbarItem"
import BudgetSelector from "./BudgetSelector";
import {useContext} from "react";
import {BudgetContext} from "./BudgetContext";


/**
 * Rightbar component to display BudgetSelector and Deposits balances on right side of screen
 */
const Rightbar = () => {
    const {contextBudgetDeposits} = useContext(BudgetContext);

    return (
        <Box width={240} sx={{display: {xs: "none", sm: "none", md: "block"}}}>
            <Box position="fixed" width={240} pt={2} display="flex" justifyContent="center">
                <Card>
                    <Box width={220} display="flex" flexDirection="column" alignItems="center" pt={2}>
                        <BudgetSelector />
                        <Divider variant="middle" />
                        <List sx={{width: "100%"}}>
                            {contextBudgetDeposits.map(deposit => (
                                <RightbarItem key={deposit.id} deposit={deposit}/>
                            ))}
                        </List>
                    </Box>
                </Card>

            </Box>
        </Box>
    )
}

export default Rightbar;