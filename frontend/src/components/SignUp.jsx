import { Container, TextField, Button, Typography, Box, Link, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const SignUp = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        // Validate password: at least 8 characters, one special character, and one number
        const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            setError('Password must be at least 8 characters long and include at least one special character and one number.');
        } else {
            setError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (error) {
            alert('Please fix the errors before submitting.');
            return;
        }
        alert('Account Created Successfully!');
        navigate('/login');
    };

    return (
        <Container component="main" maxWidth="xs" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Paper elevation={10} style={{
                padding: '2rem',
                backgroundColor: '#000000',
                color: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(255, 0, 0, 0.8)'
            }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Sign Up
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Full Name"
                        variant="outlined"
                        fullWidth
                        required
                        InputLabelProps={{ style: { color: 'white' } }}
                        InputProps={{ style: { color: 'white' } }}
                        style={{ marginBottom: '1rem' }}
                    />
                    <TextField
                        label="Email Address"
                        variant="outlined"
                        fullWidth
                        required
                        type="email"
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
                        value={password}
                        onChange={handlePasswordChange}
                        InputLabelProps={{ style: { color: 'white' } }}
                        InputProps={{ style: { color: 'white' } }}
                        style={{ marginBottom: '1rem' }}
                        error={!!error}
                        helperText={error}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        style={{ backgroundColor: 'red', color: 'white' }}
                        disabled={!!error}
                    >
                        Create Account
                    </Button>
                </form>

                <Box mt={2} textAlign="center">
                    <Typography variant="body2">
                        Already have an account?{' '}
                        <Link href="/login" style={{ color: 'red' }}>
                            Login Here
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default SignUp;
