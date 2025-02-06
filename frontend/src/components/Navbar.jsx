import { AppBar, Toolbar, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  return (
    <AppBar
      position="fixed" // Stays on top even when scrolling
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0)", // Light transparent tint
        backdropFilter: "blur(10px)", // Blur effect
       // RED GLOWING SHADOW
        top: "25px", // Space from the top for floating effect
        left: "50%", // Centered horizontally
        transform: "translateX(-50%)",
        width: "95%", // Slightly reduced width to look floating
        zIndex: 1000, // Ensures it's always on top
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Box>
          <img src={logo} alt="Logo" style={{ height: "30px" }} />
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", gap: "2rem" }}>
          {["Features", "About Us", "Integration", "Pricing", "Contact"].map(
            (item) => (
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
            )
          )}
        </Box>

        {/* Get Started Button */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#8B0000",
            borderRadius: "20px",
            padding: "8px 20px",
            textTransform: "none",
            fontSize: "1rem",
            color: "#fff",
            "&:hover": { backgroundColor: "#5734E0" },
          }}
        >
          Recommend →
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
