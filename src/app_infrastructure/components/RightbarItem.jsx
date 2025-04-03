import {ListItem, Stack, Typography, ListItemText} from "@mui/material";
import * as React from "react";


/**
 * RightbarItem component to display single Deposit in Rightbar.
 */
const RightbarItem = (deposit) => {
    return (
        <ListItem>
            <ListItemText primary={
                <React.Fragment>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography>{deposit.deposit.name}</Typography>
                        <Typography>{deposit.deposit.balance}</Typography>
                    </Stack>
                </React.Fragment>
            }/>
        </ListItem>
    )
}

export default RightbarItem;
