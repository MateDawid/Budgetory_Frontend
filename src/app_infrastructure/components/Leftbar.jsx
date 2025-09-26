import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SellIcon from "@mui/icons-material/Sell";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import LocalGroceryStoreRoundedIcon from "@mui/icons-material/LocalGroceryStoreRounded";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LeftbarItem from "./LeftbarItem";
import BarChartIcon from '@mui/icons-material/BarChart';
import { ListSubheader, styled } from "@mui/material";

const StyledListSubheader = styled(ListSubheader)({
    color: '#FFFFFF', 
    backgroundColor: '#252525'
})

/**
 * Leftbar component to display subpages navigation on left side of screen
 */
const Leftbar = () => {
    return (
        <Box width={240} height="100%" sx={{zIndex: 999, backgroundColor: '#252525', display: {xs: "none", sm: "none", md: "block"}}}>
            <Box position="fixed" height="100%" width={180} sx={{backgroundColor: '#252525', overflow: 'auto'}}>
                <List>
                    <StyledListSubheader>Budgets</StyledListSubheader>
                    <LeftbarItem url="/budgets" displayText="Budgets" icon={<AccountBalanceIcon />} />
                    <LeftbarItem url="/periods" displayText="Periods" icon={<CalendarMonthIcon />} />
                    <StyledListSubheader>Entities</StyledListSubheader>
                    <LeftbarItem url="/deposits" displayText="Deposits" icon={<AccountBalanceWalletRoundedIcon />} />
                    <LeftbarItem url="/entities" displayText="Entities" icon={<LocalGroceryStoreRoundedIcon />} />
                    <StyledListSubheader>Planning</StyledListSubheader>
                    <LeftbarItem url="/categories" displayText="Categories" icon={<SellIcon/>}/>
                    <LeftbarItem url="/predictions" displayText="Predictions" icon={<BarChartIcon/>}/>
                    <StyledListSubheader>Transfers</StyledListSubheader>
                    <LeftbarItem url="/incomes" displayText="Incomes" icon={<PaymentIcon />} />
                    <LeftbarItem url="/expenses" displayText="Expenses" icon={<ReceiptIcon />} />
                </List>
            </Box>
        </Box>
    )
}

export default Leftbar;