import {ListItem, Stack, Typography, ListItemText} from "@mui/material";
import * as React from "react";
import {useContext} from "react";
import {BudgetContext} from "./BudgetContext";


/**
 * RightbarItem component to display single Deposit in Rightbar.
 */
const RightbarItem = (deposit) => {
    const {contextBudgetCurrency} = useContext(BudgetContext);

    return (
        <ListItem>
            <ListItemText primary={
                <React.Fragment>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
                        <Typography>{deposit.deposit.name}</Typography>
                        <Typography sx={{fontWeight: "bold", color: "#BD0000"}}>
                            {deposit.deposit.balance}&nbsp;{contextBudgetCurrency}
                        </Typography>
                    </Stack>
                </React.Fragment>
            }/>
        </ListItem>
    )
}

export default RightbarItem;
