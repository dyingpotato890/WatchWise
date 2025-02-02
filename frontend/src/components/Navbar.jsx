import { AppBar, Toolbar, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
    return (
        <AppBar
            position="static"
            style={{
                backgroundColor: '#000000',
                boxShadow: '0 4px 20px rgba(255, 0, 0, 0.8)',
            }}
        >
            <Toolbar>
                {/* Logo */}
                <Box sx={{ flexGrow: 1 }}>
                    <img
                        src={logo}
                        alt="WatchWise Logo"
                        style={{ height: '25px' }} // Adjusted logo size
                    />
                </Box>

                {/* Navigation Links */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem', // Increased gap between links
                        marginRight: '2rem', // Move links a bit to the left (more centered)
                    }}
                >
                    <Button color="inherit">
                        <Link
                            to="/"
                            style={{
                                textDecoration: 'none',
                                color: 'white',
                                fontSize: '1.1rem', // Increased font size
                                fontWeight: '500', // Slightly bolder
                            }}
                        >
                            Home
                        </Link>
                    </Button>
                    <Button color="inherit">
                        <Link
                            to="/about"
                            style={{
                                textDecoration: 'none',
                                color: 'white',
                                fontSize: '1.1rem', // Increased font size
                                fontWeight: '500', // Slightly bolder
                            }}
                        >
                            About
                        </Link>
                    </Button>
                    <Button color="inherit">
                        <Link
                            to="/contact"
                            style={{
                                textDecoration: 'none',
                                color: 'white',
                                fontSize: '1.1rem', // Increased font size
                                fontWeight: '500', // Slightly bolder
                            }}
                        >
                            Contact
                        </Link>
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;