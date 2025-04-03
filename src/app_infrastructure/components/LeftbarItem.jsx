import ListItemButton from "@mui/material/ListItemButton";
import {Link} from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import {styled} from "@mui/material/styles";

const StyledListItemButton = styled(ListItemButton)({
    justifyContent: 'center',
    minHeight: 48,
    px: 2.5
})

const StyledListItemIcon = styled(ListItemIcon)({
    justifyContent: 'center',
    minWidth: 0,
    marginRight: 15
})


/**
 * LeftbarItem component to display single navigation item in Leftbar.
 */
const LeftbarItem = ({url, displayText, icon}) => {
    return (
        <StyledListItemButton component={Link} to={url}>
            <StyledListItemIcon>
                {React.cloneElement(icon, { style: {color: '#BD0000'} })}
            </StyledListItemIcon>
            <ListItemText primary={displayText} sx={{color: '#FFFFFF'}}/>
        </StyledListItemButton>
    )
}

export default LeftbarItem;
