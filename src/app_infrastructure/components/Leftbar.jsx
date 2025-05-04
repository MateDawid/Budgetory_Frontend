import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SellIcon from "@mui/icons-material/Sell";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import LocalGroceryStoreRoundedIcon from "@mui/icons-material/LocalGroceryStoreRounded";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LeftbarItem from "./LeftbarItem";

/**
 * Leftbar component to display subpages navigation on left side of screen
 */
const Leftbar = () => {
    return (
        <Box width={240} height="100%" sx={{zIndex: 999, backgroundColor: '#252525', display: {xs: "none", sm: "none", md: "block"}}}>
            <Box position="fixed" height="100%" sx={{backgroundColor: '#252525', overflow: 'auto'}}>
                <List>
                    <LeftbarItem url="/budgets" displayText="Budgets" icon={<AccountBalanceIcon />} />
                    <LeftbarItem url="/periods" displayText="Periods" icon={<CalendarMonthIcon />} />
                    <LeftbarItem url="/deposits" displayText="Deposits" icon={<AccountBalanceWalletRoundedIcon />} />
                    <LeftbarItem url="/entities" displayText="Entities" icon={<LocalGroceryStoreRoundedIcon />} />
                    <LeftbarItem url="/categories" displayText="Transfer categories" icon={<SellIcon/>}/>
                    <LeftbarItem url="/incomes" displayText="Incomes" icon={<PaymentIcon />} />
                    <LeftbarItem url="/expenses" displayText="Expenses" icon={<ReceiptIcon />} />
                    <LeftbarItem url="/expense_predictions" displayText="Expense predictions" icon={<CalculateOutlinedIcon />} />
                </List>
            </Box>
        </Box>
    )
}

export default Leftbar;