import { Container, TextField, Button, Typography, Box, Link, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        alert('Logged in Successfully!');
        navigate('/home');
    };

    return (
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
    );
};

export default Login;
