import React from 'react';
import {Avatar, Container, Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Divider from "@mui/material/Divider";

/**
 * ErrorPage component to display app error.
 */
function ErrorPage() {
    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={10} sx={{marginTop: 8, padding: 2}}>
                <Avatar
                    sx={{
                        mx: "auto",
                        bgcolor: "#BD0000",
                        textAlign: "center",
                        mb: 1,
                    }}
                >
                    <ErrorOutlineOutlinedIcon/>
                </Avatar>
                <Typography component="h5" variant="h5" sx={{textAlign: "center"}}>Server error</Typography>
                <Divider sx={{margin: 2, textAlign: "center"}}/>
                <Typography variant="body1" sx={{margin: 2}}>Application error occured. Please try again
                    later.</Typography>
            </Paper>
        </Container>
    )
}

export default ErrorPage;