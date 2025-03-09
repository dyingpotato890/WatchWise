import React, { useState, useEffect } from "react";
import {
    AppBar,
    Toolbar,
    Box,
    Button,
    Menu,
    MenuItem,
    Snackbar,
    Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import axios from "axios";

const checkLoginStatus = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        if (!token) return false; // No token means not logged in

        const response = await axios.get("http://localhost:5010/api/check", {
            headers: {
                "x-access-token": token, // Include token in x-access-token header
            },
        });

        return response.status === 200; // If status is 200, return true
    } catch (error) {
        console.error("Login status check failed:", error);
        return false; // Any error means not logged in
    }
};

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [loggedIn, setLoggedIn] = useState(
        () => JSON.parse(localStorage.getItem("isLoggedIn")) || false,
    );
    const [anchorEl, setAnchorEl] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const open = Boolean(anchorEl);

useEffect(() => {
        const fetchLoginStatus = async () => {
            console.log("Sending request to check login status...");
            const isLoggedIn = await checkLoginStatus();
            console.log("Login status response:", JSON.stringify(isLoggedIn));
            setLoggedIn(isLoggedIn);
            localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn)); // Store the boolean value
        };

        fetchLoginStatus();
    }, []); 
    useEffect(() => {
        if (location.pathname === "/login") {
            setLoggedIn(false);
            localStorage.setItem("isLoggedIn", "false");
        }
    }, [location.pathname]);

    const handleLogin = () => {
        setLoggedIn(true);
        navigate("/");
    };

    const handleLogout = async () => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setLoggedIn(false);
            localStorage.setItem("isLoggedIn", "false");
            setAnchorEl(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleRecommendClick = () => {
        if (!loggedIn) {
            setOpenSnackbar(true); // Show Snackbar warning if not logged in
        } else {
            navigate("/chat"); // Redirect to /chat if logged in
        }
    };

    const handleScrollToSection = (sectionId) => {
        if (location.pathname !== "/") {
            navigate("/");
            setTimeout(() => {
                setTimeout(() => {
                    const section = document.getElementById(sectionId);
                    if (section) {
                        section.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                }, 300);
            }, 500);
        } else {
            setTimeout(() => {
                const section = document.getElementById(sectionId);
                if (section) {
                    section.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 100);
        }
    };

    const handleLogoClick = () => {
        if (location.pathname !== "/") {
            navigate("/");
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: "rgba(255, 255, 255, 0)",
                backdropFilter: "blur(10px)",
                top: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "98%",
                zIndex: 1000,
                padding: "8px 0",
            }}
        >
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    minHeight: "48px",
                }}
            >
                <Box sx={{ cursor: "pointer" }} onClick={handleLogoClick}>
                    <img src={logo} alt="WatchWise Logo" style={{ height: "28px" }} />
                </Box>

                <Box sx={{ display: "flex", gap: "1.5rem" }}>
                    <Button
                        color="inherit"
                        sx={{ fontSize: "0.9rem", fontWeight: "500" }}
                        onClick={() => navigate("/chat")}
                    >
                        Chat
                    </Button>

                    <Button
                        color="inherit"
                        sx={{ fontSize: "0.9rem", fontWeight: "500" }}
                        onClick={() => handleScrollToSection("about-us")}
                    >
                        About Us
                    </Button>
                    <Button
                        color="inherit"
                        sx={{ fontSize: "0.9rem", fontWeight: "500" }}
                        onClick={() => handleScrollToSection("contact-us")}
                    >
                        Contact
                    </Button>

                    <Button
                        color="inherit"
                        onClick={handleRecommendClick}
                        sx={{ fontSize: "0.9rem", fontWeight: "500" }}
                    >
                        Recommend
                    </Button>
                </Box>

                {!loggedIn && (
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#8B0000",
                            borderRadius: "15px",
                            padding: "4px 14px",
                            textTransform: "none",
                            fontSize: "0.85rem",
                            color: "#fff",
                            "&:hover": { backgroundColor: "#600000" },
                        }}
                        onClick={() => navigate("/login")}
                    >
                        LOGIN
                    </Button>
                )}

                {loggedIn && (
                    <Box
                        sx={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "2px solid #ffffff",
                            cursor: "pointer",
                        }}
                        onClick={handleProfileClick}
                    >
                        <img
                            src="https://wallpapers.com/images/featured/cool-profile-picture-87h46gcobjl5e4xu.jpg"
                            alt="Profile"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </Box>
                )}

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    sx={{
                        mt: 1.5,
                        "& .MuiPaper-root": {
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                            color: "#ffffff",
                            borderRadius: "10px",
                        },
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            handleClose();
                            navigate("/profile"); // Navigate to profile page
                        }}
                    >
                        Profile
                    </MenuItem>
                    <MenuItem onClick={handleClose}>Settings</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Toolbar>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity="warning"
                    sx={{ width: "100%" }}
                >
                    Login to continue!
                </Alert>
            </Snackbar>
        </AppBar>
    );
};

export default Navbar;
