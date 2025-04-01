import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
} from "@mui/material";

const Watchlist = () => {
    const [movies, setMovies] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [rating, setRating] = useState("");

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const fetchWatchlist = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch("http://localhost:5010/api/fetchWatchlater", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch watchlist");
            }

            const data = await response.json();
            if (data && data.watchlist) {
                setMovies(data.watchlist);
            }
        } catch (error) {
            console.error("Error fetching watchlist:", error);
        }
    };

    const handleDeleteClick = (movie) => {
        setSelectedMovie(movie);
        console.log("Selected movie:", movie); // Debugging log
        setOpen(true);
    };
    
    const handleConfirmDelete = async () => {
        if (rating !== "" && selectedMovie) {
            try {
                const token = localStorage.getItem("accessToken");
    
                const response = await fetch("http://localhost:5010/api/addRating", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                    body: JSON.stringify({
                        show_id: selectedMovie.show_id,
                        rating: rating,
                    }),
                });
    
                if (!response.ok) {
                    throw new Error("Failed to submit rating");
                }
    
                // Remove the movie from the watchlist after successful submission
                setMovies(movies.filter((m) => m.show_id !== selectedMovie.show_id));
                console.log("Rating submitted successfully!");
    
            } catch (error) {
                console.error("Error submitting rating:", error);
            }
        }
    
        // Close dialog and reset
        setOpen(false);
        setRating("");
        setSelectedMovie(null);
    };

    return (
        <Box
            sx={{
                padding: "20px",
                textAlign: "center",
                overflowY: "auto",
                maxHeight: "calc(100vh - 80px)",
                scrollbarWidth: "thin",
                scrollbarColor: "darkred black",
                "&::-webkit-scrollbar": {
                    width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                    background: "black",
                },
                "&::-webkit-scrollbar-thumb": {
                    background: "darkred",
                    borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                    background: "#8B0000",
                },
            }}
        >
            <Typography variant="h4" gutterBottom>
                Watchlist
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                {movies.map((movie, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={movie.show_id || index}>
                            <Box
                                sx={{
                                    backgroundColor: "black",
                                    color: "white",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    boxShadow: "0px 4px 10px rgba(255,0,0,0.3)",
                                    textAlign: "center",
                                    position: "relative",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    paddingBottom: "20px", // Increased padding at the bottom
                                    marginBottom: "10px",  // Added margin for extra spacing
                                }}
                            >
                            <Box
                                sx={{
                                    width: "100%",
                                    paddingTop: "150%", // 2:3 aspect ratio typical for movie posters
                                    position: "relative",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                }}
                            >
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                    }}
                                />
                            </Box>
                            <Typography 
                                variant="h6" 
                                mt={1}
                                sx={{
                                    flexGrow: 1,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    minHeight: "64px", // Ensures consistent space for title
                                }}
                            >
                                {movie.title}
                            </Typography>
                            <Button
                                variant="contained"
                                color="warning"
                                size="small"
                                sx={{
                                    marginTop: "5px",
                                    opacity: 0.7,
                                    fontSize: "12px",
                                    padding: "3px 8px",
                                    transition: "opacity 0.3s",
                                    "&:hover": { opacity: 1, backgroundColor: "#ff9800" },
                                }}
                                onClick={() => handleDeleteClick(movie)}
                            >
                                Remove
                            </Button>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Rating Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Rate the Movie</DialogTitle>
                <DialogContent>
                    <Typography>
                        How would you rate "{selectedMovie?.title}" out of 10?
                    </Typography>
                    <TextField
                        type="number"
                        inputProps={{ min: 1, max: 10 }}
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        disabled={rating === ""}
                    >
                        Submit & Remove
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Watchlist;