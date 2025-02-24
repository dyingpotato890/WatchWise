import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Box, Button, Menu, MenuItem, Snackbar, Alert } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loggedIn, setLoggedIn] = useState(() => JSON.parse(localStorage.getItem("isLoggedIn")) || false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(loggedIn));
  }, [loggedIn]);

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
        top: "10px", // Moved navbar slightly up
        left: "50%",
        transform: "translateX(-50%)",
        width: "98%", // Decreased the size slightly
        zIndex: 1000,
        padding: "8px 0", // Reduced padding
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: "48px" }}>
        {/* Logo */}
        <Box sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          <img src={logo} alt="WatchWise Logo" style={{ height: "28px" }} />
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", gap: "1.5rem" }}> {/* Reduced gap */}
          {["Features", "About Us", "Contact"].map((item) => (
            <Button key={item} color="inherit" sx={{ fontSize: "0.9rem", fontWeight: "500" }}>
              <Link
                to={`/${item.toLowerCase().replace(" ", "-")}`}
                style={{
                  textDecoration: "none",
                  color: "#ffffff",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {item}
              </Link>
            </Button>
          ))}

          {/* Recommend Button */}
          <Button color="inherit" onClick={handleRecommendClick} sx={{ fontSize: "0.9rem", fontWeight: "500" }}>
            Recommend
          </Button>
        </Box>

        {/* Show Login Button if Not Logged In */}
        {!loggedIn && (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#8B0000",
              borderRadius: "15px", // Adjusted for a sleeker look
              padding: "4px 14px", // Reduced padding
              textTransform: "none",
              fontSize: "0.85rem",
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
              width: "30px", // Reduced profile picture size
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

        {/* Dropdown Menu */}
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