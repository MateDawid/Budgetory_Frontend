import { AppBar } from '@mui/material'
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { removeTokens } from "../../app_users/services/LoginService";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { useContext } from 'react';
import React from 'react';
import { AlertContext } from '../store/AlertContext';

const StyledToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between"
})

/**
 * Navbar component to display navigation bar on top of the page.
 */
const Navbar = () => {
    const navigate = useNavigate();
    const { setAlert } = useContext(AlertContext);
    
    /**
     * Handles User logout.
     */
    const handleLogout = () => {
        removeTokens();
        setAlert(null)
        navigate('/login');
    }

    return (
        <AppBar position="sticky" sx={{ backgroundColor: "#BD0000" }}>
            <StyledToolbar>
                <Typography
                    variant="h6"
                    component="a"
                    href="/"
                    sx={{
                        textDecoration: 'none',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                    }}
                >
                    BUDGETORY
                </Typography>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </StyledToolbar>
        </AppBar>
    )
}

export default Navbar