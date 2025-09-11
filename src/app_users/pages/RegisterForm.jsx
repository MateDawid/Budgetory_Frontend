import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Alert, Avatar, Container, Paper, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { getAccessToken } from "../services/LoginService";
import { useForm } from "react-hook-form";
import { registerUser } from "../services/RegisterService";
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { AlertContext } from '../../app_infrastructure/store/AlertContext';


/**
 * RegisterForm component handles user registration.
 * It manages the email and password input fields,
 * validates the input, and performs registration process.
 */
function RegisterForm() {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [ formErrors, setFormErrors ] = useState({})
    const { alert, setAlert } = useContext(AlertContext);

    useEffect(() => {
        /**
         * Asynchronously obtains access token. If token exists, navigates to landing page.
         */
        const checkIfTokenExists = async () => {
            getAccessToken().then((token) => {
                if (token) {
                    navigate('/');
                }
            })
        }
        checkIfTokenExists()
    }, []);

    /**
     * Handles form submission.
     * Validates input fields and calls API to create user.
     * @param {Object} data - Form data.
     */
    const onSubmit = async (data) => {
        try {
            const { response, isError } = await registerUser(data);
            if (isError) {
                setAlert({
                    type: 'error',
                    message: response.response.data.detail?.non_field_errors
                        || 'An error occurred. Please try again.'
                });

                if (response.response.data.detail) {
                    const requestErrors = {};
                    for (const key in response.response.data.detail) {
                        requestErrors[key] = response.response.data.detail[key];
                    }
                    setFormErrors(requestErrors);
                }


            } else {
                setAlert({ type: 'success', message: 'Account created successfully.' })
                navigate('/login');
            }
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.response.data.message || 'Network error. Please try again later.'
            });
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={10} sx={{ marginTop: 8, padding: 2 }}>
                <Typography
                    variant="h6"
                    sx={{
                        textDecoration: 'none',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textAlign: "center",
                        width: '100%',
                        marginBottom: 1
                    }}
                >
                    BUDGETORY
                </Typography>
                <Avatar
                    sx={{
                        mx: "auto",
                        bgcolor: "#BD0000",
                        textAlign: "center",
                        mb: 1,
                    }}
                >
                    <AppRegistrationOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>Register</Typography>
                {
                    alert &&
                    <Alert
                        sx={{ marginTop: 2, marginBottom: 2, whiteSpace: 'pre-wrap' }}
                        severity={alert.type}
                        onClose={() => setAlert(null)}>
                        {alert.message}
                    </Alert>
                }
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                    <TextField
                        data-cy='email-field'
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        autoComplete="email"
                        autoFocus
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: 'Invalid email address'
                            }
                        })}
                        error={!!formErrors.email}
                        helperText={formErrors.email ? formErrors.email : ''}
                    />
                    <TextField
                        data-cy='username-field'
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
                        autoComplete="username"
                        {...register('username', {
                            required: 'Username is required'
                        })}
                        error={!!formErrors.username}
                        helperText={formErrors.username ? formErrors.username : ''}
                    />
                    <TextField
                        data-cy='password-1-field'
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        {...register('password_1', {
                            required: 'Password is required'
                        })}
                        error={!!formErrors.password_1}
                        helperText={formErrors.password_1 ? formErrors.password_1 : ''}
                    />
                    <TextField
                        data-cy='password-2-field'
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Repeat password"
                        type="password"
                        autoComplete="current-password"
                        {...register('password_2', {
                            required: 'Password is required'
                        })}
                        error={!!formErrors.password_2}
                        helperText={formErrors.password_2 ? formErrors.password_2 : ''}
                    />
                    <Button data-cy='register-button' type="submit" variant="contained" fullWidth sx={{ mt: 1, bgcolor: "#BD0000" }}>
                        Register
                    </Button>
                </Box>
                <Button data-cy='login-button' component={RouterLink} to="/login" variant="contained" fullWidth
                    sx={{ mt: 1, bgcolor: "#BD0000" }}>
                    Log in
                </Button>
            </Paper>
        </Container>
    )
}

export default RegisterForm;