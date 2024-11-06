import {Outlet} from "react-router-dom";
import React from "react";
import {Button} from "@mui/material";

function Layout() {
    return (
        <>
            <Button variant="contained">BUDGETORY</Button>
            <Outlet/>
        </>
    );
}

export default Layout;