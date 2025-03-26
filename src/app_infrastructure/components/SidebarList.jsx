import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SellIcon from '@mui/icons-material/Sell';
import LocalGroceryStoreRoundedIcon from '@mui/icons-material/LocalGroceryStoreRounded';
import LightbulbCircleIcon from '@mui/icons-material/LightbulbCircle';
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import List from "@mui/material/List";
import {Link} from "@mui/material";


const listItemStyling = {display: 'block'}
const listItemButtonStyling = [
    {minHeight: 48, px: 2.5},
    open ? {justifyContent: 'initial'} : {justifyContent: 'center'},
]
const listItemIconStyling = [
    {minWidth: 0, justifyContent: 'center',},
    open ? {mr: 3} : {mr: 'auto'},
]
const iconComponentStyling = {color: '#BD0000'}
const listItemTextStyling = [
    open ? {opacity: 1,} : {opacity: 0,},
    {color: '#FFFFFF'}
]

/**
 * SidebarList component for displaying list of sidebar components.
 */
// TODO: Separate component for ListItemButton
function SidebarList() {
    return (
        <List>
            <ListItem key="Budgets" disablePadding sx={listItemStyling}>
                <ListItemButton component={Link} to="/budgets" sx={listItemButtonStyling}>
                    <ListItemIcon sx={listItemIconStyling}>
                        <AccountBalanceIcon style={iconComponentStyling}/>
                    </ListItemIcon>
                    <ListItemText primary="Budgets" sx={listItemTextStyling}/>
                </ListItemButton>
                <ListItemButton component={Link} to="/periods" sx={listItemButtonStyling}>
                    <ListItemIcon sx={listItemIconStyling}>
                        <CalendarMonthIcon style={iconComponentStyling}/>
                    </ListItemIcon>
                    <ListItemText primary="Periods" sx={listItemTextStyling}/>
                </ListItemButton>
                <ListItemButton component={Link} to="/transfer_categories" sx={listItemButtonStyling}>
                    <ListItemIcon sx={listItemIconStyling}>
                        <SellIcon style={iconComponentStyling}/>
                    </ListItemIcon>
                    <ListItemText primary="Transfer categories" sx={listItemTextStyling}/>
                </ListItemButton>
                <ListItemButton component={Link} to="/deposits" sx={listItemButtonStyling}>
                    <ListItemIcon sx={listItemIconStyling}>
                        <AccountBalanceWalletRoundedIcon style={iconComponentStyling}/>
                    </ListItemIcon>
                    <ListItemText primary="Deposits" sx={listItemTextStyling}/>
                </ListItemButton>
                <ListItemButton component={Link} to="/entities" sx={listItemButtonStyling}>
                    <ListItemIcon sx={listItemIconStyling}>
                        <LocalGroceryStoreRoundedIcon style={iconComponentStyling}/>
                    </ListItemIcon>
                    <ListItemText primary="Entities" sx={listItemTextStyling}/>
                </ListItemButton>
                                <ListItemButton component={Link} to="/expense_predictions" sx={listItemButtonStyling}>
                    <ListItemIcon sx={listItemIconStyling}>
                        <LightbulbCircleIcon style={iconComponentStyling}/>
                    </ListItemIcon>
                    <ListItemText primary="Expense predictions" sx={listItemTextStyling}/>
                </ListItemButton>
            </ListItem>
        </List>
    );
}

export default SidebarList;