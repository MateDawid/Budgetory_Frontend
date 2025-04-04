import * as React from "react";
import {Box, Card, List} from "@mui/material";
import RightbarItem from "./RightbarItem"

/**
 * Rightbar component to display Deposits balances on right side of screen
 */
const Rightbar = () => {
    return (
        <Box flex={1} zIndex={999} sx={{display: {xs: "none", sm: "none", md: "block"}}}>
            <Box position="fixed" width={250} p={2}>
                <Card p={2}>
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