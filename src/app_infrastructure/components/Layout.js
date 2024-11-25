import React from "react";
import {Outlet} from "react-router-dom";
import Navbar from "./Navbar";
import {Container} from "@mui/material";

/**
 * Layout component holds base elements of displayed pages.
 */
function Layout() {
    return (
        <>
            <Navbar/>
            <Container>
                <Outlet/>
            </Container>
        </>
    );
}

export default Layout;