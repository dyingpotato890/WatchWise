import React, { useState } from "react";
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
    const [movies, setMovies] = useState([
        { id: 1, title: "Mars Attacks!", poster: "https://image.tmdb.org/t/p/w500//bGxhc8Cd908XbDxg5baDvbiVzUI.jpg" },
        { id: 2, title: "Mystery Men", poster: "https://image.tmdb.org/t/p/w500//ciVSbFmDecOIwlxl9F6GhHVgCVJ.jpg" },
        { id: 3, title: "Almost Love", poster: "https://image.tmdb.org/t/p/w500//zLWthIm1tPEaahni2KlVSW4YaJR.jpg" },
        { id: 4, title: "Klaus", poster: "https://image.tmdb.org/t/p/w500//q125RHUDgR4gjwh1QkfYuJLYkL.jpg" },
        { id: 5, title: "Internet Famous", poster: "https://image.tmdb.org/t/p/w500//9HZ4gaNBP7Dc3TdFgCIh8BbgZ8Q.jpg" },
        { id: 6, title: "Lady Dynamite", poster: "https://m.media-amazon.com/images/M/MV5BMTU2OTM0NjkzNF5BMl5BanBnXkFtZTgwOTc2MDU5MzI@._V1_SX300.jpg" },
        { id: 7, title: "Brews Brothers", poster: "https://m.media-amazon.com/images/M/MV5BZGE0MWMxOWQtZTFhZC00NzU0LWEzYWEtNTkxMjBkYTliZWY5XkEyXkFqcGc@._V1_SX300.jpg" },
        { id: 8, title: "50 First Dates", poster: "https://image.tmdb.org/t/p/w500//sQM9OKpj876pDWFbkfRIrpQG6fZ.jpg" },
        { id: 9, title: "Something's Gotta Give", poster: "https://image.tmdb.org/t/p/w500//jwwVNuGRUBXcudG6wOKP9U60BzU.jpg" },
        { id: 10, title: "Beverly Hills Ninja", poster: "https://image.tmdb.org/t/p/w500//kAUtHecWe0KS54jNggapnbHBGTI.jpg" },
    ]);

    const [open, setOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [rating, setRating] = useState("");

    const handleDeleteClick = (movie) => {
        setSelectedMovie(movie);
        setOpen(true);
    };

    const handleConfirmDelete = () => {
        if (rating !== "" && selectedMovie) {
            setMovies(movies.filter((m) => m.id !== selectedMovie.id));
        }
        setOpen(false);
        setRating("");
        setSelectedMovie(null);
    };

    return (
        <Box
            sx={{
                padding: "20px",
                textAlign: "center",
                overflowY: "auto", // Enables scrolling
                maxHeight: "calc(100vh - 80px)", // Limits height
                scrollbarWidth: "thin", // Firefox support
                scrollbarColor: "darkred black", // Firefox scrollbar color
                "&::-webkit-scrollbar": {
                    width: "8px", // Adjust width of scrollbar
                },
                "&::-webkit-scrollbar-track": {
                    background: "black", // Background of scrollbar
                },
                "&::-webkit-scrollbar-thumb": {
                    background: "darkred", // Scroller color
                    borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                    background: "#8B0000", // Darker red on hover
                },
            }}
        >
            <Typography variant="h4" gutterBottom>
                Watchlist
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                {movies.map((movie) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                        <Box
                            sx={{
                                backgroundColor: "black",
                                color: "white",
                                padding: "10px",
                                borderRadius: "8px",
                                boxShadow: "0px 4px 10px rgba(255,0,0,0.3)",
                                textAlign: "center",
                                position: "relative",
                            }}
                        >
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                style={{
                                    width: "150px", // Fixed width
                                    height: "180px", // Fixed height
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                }}
                            />
                            <Typography variant="h6" mt={1}>
                                {movie.title}
                            </Typography>
                            <Button
                                variant="contained"
                                color="warning"
                                size="small"
                                sx={{
                                    marginTop: "5px",
                                    opacity: 0.7,
                                    fontSize: "12px", // Makes it subtle
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
