import React, {useState} from 'react';
import {Link as RouterLink, Navigate, useNavigate} from 'react-router-dom';
import {Avatar, Container, Paper, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {isLoggedIn} from "../services/LoginService";
import {useForm} from "react-hook-form";
import {registerUser} from "../services/RegisterService";
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";


/**
 * RegisterForm component handles user registration.
 * It manages the email and password input fields,
 * validates the input, and performs registration process.
 */
function RegisterForm() {
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [error, setError] = useState('');

    if (isLoggedIn()) {
        return <Navigate to='/'/>;
    }

    /**
     * Handles form submission.
     * Validates input fields and calls API to create user.
     * @param {Object} data - Form data.
     */
    const onSubmit = async (data) => {
        try {
            const {response, isError} = await registerUser(data.email, data.password_1, data.password_2);
            if (isError) {
                setError(response.response.data.detail.email || response.response.data.detail.password_1 || response.response.data.detail.password_2 || response.response.data.detail.non_field_errors ||'An error occurred. Please try again.');
            } else {
                navigate('/login');
            }
        } catch (error) {
            setError(error.response.data.message || 'Network error. Please try again later.');
        }
    };

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
                    <AppRegistrationOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5" sx={{textAlign: "center"}}>Register</Typography>
                {error && <Typography data-cy='errors-display' color="error">{error}</Typography>}
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{mt: 1}}>
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
                        error={!!errors.email}
                        helperText={errors.email ? errors.email.message : ''}
                        sx={{mb: 2}}
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
                            required: 'Password is required',
                            minLength: {
                                value: 8,
                                message: 'Password must be at least 8 characters'
                            }
                        })}
                        error={!!errors.password_1}
                        helperText={errors.password_1 ? errors.password_1.message : ''}
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
                            required: 'Password is required',
                            minLength: {
                                value: 8,
                                message: 'Password must be at least 8 characters'
                            }
                        })}
                        error={!!errors.password_2}
                        helperText={errors.password_2 ? errors.password_2.message : ''}
                    />
                    <Button data-cy='register-button' type="submit" variant="contained" fullWidth sx={{mt: 1, bgcolor: "#BD0000"}}>
                        Register
                    </Button>
                </Box>
                <Typography component="h3" variant="h6" sx={{textAlign: "center"}}>Already have an account?</Typography>
                <Button data-cy='login-button' component={RouterLink} to="/login" variant="contained" fullWidth
                        sx={{mt: 1, bgcolor: "#BD0000"}}>
                    Log in
                </Button>
            </Paper>
        </Container>
    )
}

export default RegisterForm;