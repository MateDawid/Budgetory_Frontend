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
            const {response, isError} = await registerUser(data.email, data.password);
            console.log(response.response.data)
            if (isError) {
                setError(response.response.data.detail.email || response.response.data.detail.password || 'An error occurred. Please try again.');
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
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters'
                            }
                        })}
                        error={!!errors.password}
                        helperText={errors.password ? errors.password.message : ''}
                    />
                    <Button type="submit" variant="contained" fullWidth sx={{mt: 1, bgcolor: "#BD0000"}}>
                        Register
                    </Button>
                </Box>
                <Typography component="h3" variant="h6" sx={{textAlign: "center"}}>Already have an account?</Typography>
                <Button component={RouterLink} to="/login" variant="contained" fullWidth
                        sx={{mt: 1, bgcolor: "#BD0000"}}>
                    Log in
                </Button>
            </Paper>
        </Container>
    )
}

export default RegisterForm;