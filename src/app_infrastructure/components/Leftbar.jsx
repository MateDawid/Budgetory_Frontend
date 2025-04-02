import SidebarList from "./SidebarList";
import * as React from "react";
import Box from "@mui/material/Box";

/**
 * Leftbar component to display subpages navigation on left side of screen
 */
const Leftbar = () => {
    return (
        <Box flex={1} pr={2} sx={{display: {xs: "none", sm: "block"}}}>
            <Box position="fixed" height="100%" sx={{backgroundColor: '#252525'}}>
                <SidebarList/>
            </Box>
        </Box>
    )
}

export default Leftbar;