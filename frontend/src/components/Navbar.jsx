import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Box, Button, Menu, MenuItem, Snackbar, Alert } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Default value should be false
  const [loggedIn, setLoggedIn] = useState(() => JSON.parse(localStorage.getItem("isLoggedIn")) || false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const open = Boolean(anchorEl);

  // Keep isLoggedIn in sync with localStorage
  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(loggedIn));
  }, [loggedIn]);

  // If on login page, force login button (avoid showing profile)
  useEffect(() => {
    if (location.pathname === "/login") {
      setLoggedIn(false);
      localStorage.setItem("isLoggedIn", "false");
    }
  }, [location.pathname]);

  // Simulate successful authentication (Replace with actual authentication logic)
  const handleLogin = () => {
    // Normally, this would be set after a backend API call for authentication
    setLoggedIn(true);
    navigate("/"); // Redirect to homepage after login
  };

  const handleLogout = async () => {
    try {
      // Call backend to update isLoggedIn to false (mocking API call)
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
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
      setOpenSnackbar(true);
    } else {
      navigate("/recommend");
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0)",
        backdropFilter: "blur(10px)",
        top: "25px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "95%",
        zIndex: 1000,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Box sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          <img src={logo} alt="WatchWise Logo" style={{ height: "30px" }} />
        </Box>


        {/* Navigation Links */}
        <Box sx={{ display: "flex", gap: "2rem" }}>
          {["Features", "About Us", "Contact"].map((item) => (
            <Button key={item} color="inherit">
              <Link
                to={`/${item.toLowerCase().replace(" ", "-")}`}
                style={{
                  textDecoration: "none",
                  color: "#ffffff",
                  fontSize: "1rem",
                  fontWeight: "600",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {item}
              </Link>
            </Button>
          ))}

          {/* Recommend Button */}
          <Button color="inherit" onClick={handleRecommendClick} sx={{ fontSize: "1rem", fontWeight: "600" }}>
            Recommend
          </Button>
        </Box>

        {/* Show Login Button if Not Logged In */}
        {!loggedIn && (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#8B0000",
              borderRadius: "20px",
              padding: "8px 20px",
              textTransform: "none",
              fontSize: "1rem",
              color: "#fff",
              "&:hover": { backgroundColor: "#600000" },
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        )}

        {/* Show Profile Picture if Logged In */}
        {loggedIn && (
          <Box
            sx={{
              width: "40px",
              height: "40px",
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

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          sx={{
            mt: 2,
            "& .MuiPaper-root": {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "#ffffff",
              borderRadius: "10px",
            },
          }}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>Settings</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>

      {/* Snackbar for Login Alert */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="warning" sx={{ width: "100%" }}>
          Login to continue!
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

export default Navbar;
