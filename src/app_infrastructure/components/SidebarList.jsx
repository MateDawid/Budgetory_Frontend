import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
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
function SidebarList() {
    return (
        <List>
            <ListItem key="Budgets" disablePadding sx={listItemStyling}>
                <ListItemButton component={Link} to="/budget-list" sx={listItemButtonStyling}>
                    <ListItemIcon sx={listItemIconStyling}>
                        <AccountBalanceIcon style={iconComponentStyling}/>
                    </ListItemIcon>
                    <ListItemText primary="Budgets" sx={listItemTextStyling}/>
                </ListItemButton>
            </ListItem>
        </List>
    );
}

export default SidebarList;