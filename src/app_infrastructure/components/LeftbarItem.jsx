import ListItemButton from "@mui/material/ListItemButton";
import {Link} from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";

const iconComponentStyling = {color: '#BD0000'}
const listItemButtonStyling = [
    {minHeight: 48, px: 2.5},
    open ? {justifyContent: 'initial'} : {justifyContent: 'center'},
]
const listItemIconStyling = [
    {minWidth: 0, justifyContent: 'center',},
    open ? {mr: 3} : {mr: 'auto'},
]
const listItemTextStyling = [
    open ? {opacity: 1,} : {opacity: 0,},
    {color: '#FFFFFF'}
]


/**
 * LeftbarItem component to display single navigation item in Leftbar.
 */
const LeftbarItem = ({url, displayText, icon}) => {
    return (
        <ListItemButton component={Link} to={url} sx={listItemButtonStyling}>
            <ListItemIcon sx={listItemIconStyling}>
                {React.cloneElement(icon, { style: iconComponentStyling })}
            </ListItemIcon>
            <ListItemText primary={displayText} sx={listItemTextStyling}/>
        </ListItemButton>
    )
}

export default LeftbarItem;
