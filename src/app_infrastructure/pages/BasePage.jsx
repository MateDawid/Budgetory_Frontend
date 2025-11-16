import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import Navbar from "../components/Navbar";
import { getAccessToken } from "../../app_users/services/LoginService";
import { Alert, Snackbar, Stack } from "@mui/material";
import Leftbar from "../components/Leftbar";
import Rightbar from "../components/Rightbar";
import { AlertContext } from "../store/AlertContext";
import React from "react";

/**
 * Base layout for subpages.
 */
export default function BasePage() {
    const { alert, setAlert } = useContext(AlertContext);
    const navigate = useNavigate();

    useEffect(() => {
        /**
         * Asynchronously obtains access token. If token does not exist, navigates to login page.
         */
        const checkIfTokenExists = async () => {
            getAccessToken().then((token) => {
                if (!token) {
                    navigate('/login');
                }
            })
        }
        checkIfTokenExists()
    }, []);

    return (
        <Box>
            <Navbar />
            <Stack direction="row" justifyContent="space-between" spacing={1}>
                <Leftbar />
                <Box flex={5} pt={2}>
                    <Outlet />
                </Box>
                <Rightbar />
            </Stack>
            <Snackbar
                open={!!alert}
                autoHideDuration={8000}
                onClose={() => setAlert(null)}
            >
                <Alert
                    severity={alert?.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alert?.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}