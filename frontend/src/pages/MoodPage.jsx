import React, { useState } from "react";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { Movie } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navbar from "../components/Navbar"; // Importing Navbar

const darkRed = "rgb(185 28 28)";

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, sans-serif",
    h4: {
      fontFamily: "Bebas Neue",
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h6: {
      fontFamily: "Bebas Neue",
      fontWeight: 700,
      fontSize: "1.8rem",
    },
    body1: {
      fontFamily: "Roboto",
      fontSize: "1rem",
    },
  },
  palette: {
    primary: { main: "#E50914" },
    background: { default: "#000" },
    text: { primary: "#fff" },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            background: "#111827",
            opacity: 0.9,
            borderRadius: "8px",
            "& fieldset": { borderColor: "#E50914" },
            "&:hover fieldset": { borderColor: "#E50914" },
            "&.Mui-focused fieldset": { borderColor: "#E50914" },
          },
          "& .MuiInputBase-input": {
            color: "white",
            fontSize: "1rem",
            padding: "16.5px 14px",
          },
          "& .MuiInputLabel-root": {
            color: "white",
            opacity: 0.7,
            fontSize: "1rem",
          },
          "& .MuiInputLabel-shrink": { color: "#E50914" },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "15px",
          padding: "10px 20px",
          fontSize: "1rem",
          textTransform: "none",
          opacity: 0.9,
          "&:hover": { opacity: 1 },
        },
        containedPrimary: {
          "&:hover": { backgroundColor: "#E50914" },
        },
      },
    },
  },
});

const moodTextStyle = {
  color: "#f5f5f5",
  mt: 6,
  mb: 2,
  textAlign: "left",
  width: "100%",
  fontFamily:
    'Open Sans, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
};

const MoodPage = () => {
  const [mood, setMood] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);

  const handleMoodSubmit = async () => {
    setIsPredicting(true);

    try {
      const response = await fetch("http://localhost:5000/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood }),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error submitting mood:", error);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar /> {/* Navbar is now imported */}
        <Container component="main" maxWidth="md" sx={{ mt: 4, flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Typography variant="h4" sx={moodTextStyle}>
            Tell us about your mood
          </Typography>
          <TextField
            multiline
            fullWidth
            rows={7}
            variant="outlined"
            placeholder="Describe your current mood and the type of movie you'd like to watch..."
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "16px",
                padding: "6px 14px",
              },
              "& .MuiInputBase-input": {
                color: "#ffffff",
                fontSize: "1.1rem",
                fontWeight: "400",
                paddingLeft: "4px",
                paddingTop: "10px",
              },
              "& .MuiInputLabel-root": {
                color: "white",
                opacity: 1,
                fontSize: "1rem",
                top: "-10px",
                left: "14px",
              },
              "& .MuiInputLabel-shrink": {
                color: "#E50914",
                left: "14px",
              },
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: "#E50914",
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Movie />}
            onClick={handleMoodSubmit}
            sx={{
              mt: 2,
              alignSelf: "flex-start",
              transition: "transform 0.2s",
              transform: isPredicting ? "scale(1.02)" : "scale(1)",
              backgroundColor: isPredicting ? darkRed : "#E50914",
              "&:hover": {
                transform: "scale(1.02)",
                backgroundColor: darkRed,
              },
            }}
          >
            {isPredicting ? "Predicting..." : "Predict"}
          </Button>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default MoodPage;
