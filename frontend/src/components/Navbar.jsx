import React, { useState } from "react";
import { AppBar, Toolbar, Box, Button, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleLogin = () => setLoggedIn(true);
  const handleLogout = () => {
    setLoggedIn(false);
    setAnchorEl(null);
  };

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0)",
        backdropFilter: "blur(10px)",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "95%",
        zIndex: 1000,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: "50px !important" }}>
        {/* Logo */}
        <Box>
          <img src={logo} alt="Logo" style={{ height: "25px" }} />
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", gap: "1.5rem" }}>
          {["Features", "About Us", "Recommend", "Contact"].map((item) => (
            <Button key={item} color="inherit">
              <Link
                to={`/${item.toLowerCase().replace(" ", "-")}`}
                style={{
                  textDecoration: "none",
                  color: "#ffffff",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {item}
              </Link>
            </Button>
          ))}
        </Box>

        {/* Before Login: Display "Login" Button */}
        {!loggedIn && (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#8B0000",
              borderRadius: "20px",
              padding: "6px 16px",
              textTransform: "none",
              fontSize: "0.9rem",
              color: "#fff",
              "&:hover": { backgroundColor: "#5734E0" },
            }}
            onClick={handleLogin}
          >
            Login
          </Button>
        )}

        {/* After Login: Display Profile Picture with Dropdown */}
        {loggedIn && (
          <Box
            sx={{
              width: "35px",
              height: "35px",
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

        {/* Dropdown Menu for Profile */}
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
    </AppBar>
  );
};

export default Navbar;