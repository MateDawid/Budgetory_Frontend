import React, {useState} from 'react';
import {Avatar, Container, Paper, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {isLoggedIn, logIn} from "../services/LogInService";
import {Link as RouterLink, Navigate} from "react-router-dom";
import Typography from "@mui/material/Typography";
import {useForm} from 'react-hook-form';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Box from "@mui/material/Box";

/**
 * LoginForm component handles user login.
 * It manages the email and password input fields,
 * validates the input, and simulates a login process.
 */
function LoginForm() {
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [error, setError] = useState('');

    if (isLoggedIn()) {
        return <Navigate to='/'/>;
    }

    /**
     * Handles form submission.
     * Validates input fields and calls API to perform login.
     * @param {Object} data - Form data.
     */
    const onSubmit = async (data) => {
        try {
            const {response, isError} = await logIn(data.email, data.password);
            if (isError) {
                setError(response.response.data.detail.non_field_errors || 'An error occurred. Please try again.');
            }
        } catch (error) {
            setError(error.response.data.message || 'Network error. Please try again later.');
        }
    }

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
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5" sx={{textAlign: "center"}}>Log in</Typography>
                {error && <Typography color="error">{error}</Typography>}
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{mt: 1}}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        autoComplete="email"
                        autoFocus
                        {...register('email', {
                            required: 'Email is required'
                        })}
                        error={!!errors.email}
                        helperText={errors.email ? errors.email.message : ''}
                        sx={{mb: 2}}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        {...register('password', {
                            required: 'Password is required'
                        })}
                        error={!!errors.password}
                        helperText={errors.password ? errors.password.message : ''}
                    />
                    <Button type="submit" variant="contained" fullWidth sx={{mt: 1, bgcolor: "#BD0000"}}>
                        Log in
                    </Button>
                </Box>
                <Typography component="h3" variant="h6" sx={{textAlign: "center"}}>Don't have an account?</Typography>
                <Button component={RouterLink} to="/register" variant="contained" fullWidth
                        sx={{mt: 1, bgcolor: "#BD0000"}}>
                    Register
                </Button>
            </Paper>
        </Container>

    )
}

export default LoginForm;