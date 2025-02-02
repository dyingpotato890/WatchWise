import React from 'react';
import { Container, TextField, Button, Typography, Box, Link, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        const username = e.target.username.value; // Use name="username"
        const password = e.target.password.value; // Use name="password"
    
        try {
            const response = await axios.post('http://localhost:5010/api/login', {
                username: username, // Send the username
                password: password, // Send the password
            });
    
            // Handle success
            alert('Logged in Successfully!');
            navigate('/home');
        } catch (error) {
            // Handle error (wrong credentials or server issues)
            console.error(error); // Log the error for debugging
            alert('Login Failed!');
        }
    };    

    return (
        <>
        <Navbar/>
        <Container
            component="main"
            maxWidth="xs"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <Paper
                elevation={10}
                style={{
                    padding: '2rem',
                    backgroundColor: '#000000',
                    color: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(255, 0, 0, 0.8)',
                }}
            >
                <Typography variant="h4" align="center" gutterBottom>
                    Login
                </Typography>

                <form onSubmit={handleLogin}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        required
                        type="text"
                        name="username" // Add name attribute
                        InputLabelProps={{ style: { color: 'white' } }}
                        InputProps={{ style: { color: 'white' } }}
                        style={{ marginBottom: '1rem' }}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        fullWidth
                        required
                        type="password"
                        name="password" // Add name attribute
                        InputLabelProps={{ style: { color: 'white' } }}
                        InputProps={{ style: { color: 'white' } }}
                        style={{ marginBottom: '1rem' }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        style={{ backgroundColor: 'red', color: 'white' }}
                    >
                        Login
                    </Button>
                </form>

                <Box mt={2} textAlign="center">
                    <Typography variant="body2">
                        Don't have an account?{' '}
                        <Link href="/register" style={{ color: 'red' }}>
                            Sign Up Here
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    </>
    );
};

export default Login;