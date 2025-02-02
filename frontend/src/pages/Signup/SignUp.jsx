import { Container, TextField, Button, Typography, Box, Link, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import './SignUp.css'; // Import the CSS file

const SignUp = () => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [matchError, setMatchError] = useState('');

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

    const handleConfirmPasswordChange = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);

        if (newConfirmPassword !== password) {
            setMatchError('Passwords do not match.');
        } else {
            setMatchError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (error || matchError) {
            alert('Please fix the errors before submitting.');
            return;
        }
        alert('Account Created Successfully!');
        navigate('/login');
    };

    const isFormValid = fullName && email && password && confirmPassword && !error && !matchError;

    return (
        <>
            <Navbar />
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
                    className="signup-paper" // Add animation class
                    style={{
                        padding: '2rem',
                        backgroundColor: '#000000',
                        color: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(255, 0, 0, 0.8)',
                        transform: 'scale(1)',
                        transition: 'transform 0.3s ease-in-out',
                    }}
                >
                    <Typography variant="h4" align="center" gutterBottom>
                        Sign Up
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Full Name"
                            variant="outlined"
                            fullWidth
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            InputLabelProps={{ style: { color: 'white' } }}
                            InputProps={{ style: { color: 'white' } }}
                            style={{ marginBottom: '1rem' }}
                            className="animated-input" // Add animation class
                        />
                        <TextField
                            label="Email Address"
                            variant="outlined"
                            fullWidth
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputLabelProps={{ style: { color: 'white' } }}
                            InputProps={{ style: { color: 'white' } }}
                            style={{ marginBottom: '1rem' }}
                            className="animated-input" // Add animation class
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
                            className="animated-input" // Add animation class
                        />
                        <TextField
                            label="Re-enter Password"
                            variant="outlined"
                            fullWidth
                            required
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            InputLabelProps={{ style: { color: 'white' } }}
                            InputProps={{ style: { color: 'white' } }}
                            style={{ marginBottom: '1rem' }}
                            error={!!matchError}
                            helperText={matchError}
                            className="animated-input" // Add animation class
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            className="animated-button" // Add animation class
                            style={{
                                backgroundColor: isFormValid ? 'red' : 'grey',
                                color: 'white',
                                transition: 'background-color 0.3s ease-in-out',
                            }}
                            disabled={!isFormValid}
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
        </>
    );
};

export default SignUp;